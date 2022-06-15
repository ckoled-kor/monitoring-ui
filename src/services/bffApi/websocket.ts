import { bff } from '.';
import { ILogGroup, IService } from '../../interfaces';
import { useLogGroupStore, LogGroupState, addLogGroups } from '../state/logGroups';
import { useServiceStore } from '../state/services';

interface IEvent {
  eventType: string,
  service?: IService,
  logGroup?: ILogGroup
}

export class BffSocket {
  private readonly reconnectAttempts: number;
  private attempt: number;
  private lastEvent: string;
  public socket: WebSocket | undefined;

  constructor(attempts?: number) {
    this.reconnectAttempts = attempts || 50;
    this.lastEvent = '';
    this.socket = undefined;
    this.attempt = 0;
  }

  async initSocket() {
    try {
      const user = JSON.parse(sessionStorage.getItem('dashboard.user')!)
      console.log(user)
      const idToken = user.signInUserSession.idToken.jwtToken
      this.socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL!}?idToken=${idToken}`)
      this.socket.onopen = async (event: any) => {
        console.log('websocket opened');
        this.attempt = 0;
        if (this.lastEvent) {
          const token = sessionStorage.getItem('dashboard.token');
          const newServices = (await bff.getServices(token!, this.lastEvent)) || {services: []};
          useServiceStore.setState({...useServiceStore.getState(), services: [...(useServiceStore.getState().services || []), ...newServices.services]})
          Object.keys(useLogGroupStore.getState().logGroups).forEach(async (svcName) => {
            const newLogGroups = (await bff.getLogGroups(svcName, token!, this.lastEvent)) || {logGroups: []};
            const temp: LogGroupState = addLogGroups(useLogGroupStore.getState().logGroups, newLogGroups.logGroups, svcName)
            useLogGroupStore.setState({...useLogGroupStore.getState(), logGroups: {...temp}})
          })
        }
      }
      this.socket.onerror = (err: any) => {
        console.log('websocket error');
        this.socket?.close()
      }
      this.socket.onmessage = (event: MessageEvent) => {
        console.log(event.data);
        this.lastEvent = new Date().toISOString();
        JSON.parse(event.data).events.forEach((ev: IEvent) => {
          switch(ev.eventType) {
            case 'CREATE': 
              if (ev.service) {
                useServiceStore.setState({...useServiceStore.getState(), services: [...(useServiceStore.getState().services || []), ev.service]})
              } else if (ev.logGroup) {
                if (useLogGroupStore.getState().logGroups[ev.logGroup.serviceName]) {
                  const temp: LogGroupState = addLogGroups(useLogGroupStore.getState().logGroups, [ev.logGroup], ev.logGroup.serviceName)
                  useLogGroupStore.setState({...useLogGroupStore.getState(), logGroups: {...temp}})
                }
              }
            break;
            case 'DELETE':
              if (ev.service) {
                useServiceStore.setState({
                  ...useLogGroupStore.getState(),
                  services: [...(useServiceStore.getState().services?.filter((s) => s.serviceName !== ev.service?.serviceName) || [])]
                })
              } else if (ev.logGroup) {
                const temp: LogGroupState = {...useLogGroupStore.getState().logGroups}
                temp[ev.logGroup.serviceName] = temp[ev.logGroup.serviceName]?.filter((lg) => lg.logGroupId !== ev.logGroup?.logGroupId)
                useLogGroupStore.setState({...useLogGroupStore.getState(), logGroups: {...temp}})
              }
            break;
            default: 
          }
        })
      }
      this.socket.onclose = (event: any) => {
        console.log('websocket closed');
        this.lastEvent = new Date().toISOString();
        if (this.attempt < this.reconnectAttempts) {
          this.attempt++;
          console.log(`Attempt ${this.attempt}, reconnect in ${3+0.5*this.attempt^2}s`);
          setTimeout(this.initSocket, 3+0.5*this.attempt^2);
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  closeSocket() {
    try {
      this.attempt = this.reconnectAttempts;
      this.socket?.close();
    } catch (e) {
      console.log(e);
    }
  }
}
export default new BffSocket(20);