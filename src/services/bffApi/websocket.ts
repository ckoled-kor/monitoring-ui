import { ILogGroup, IService } from '../../interfaces';
import { useLogGroupStore, LogGroupState, addLogGroups } from '../state/logGroups';
import { useServiceStore } from '../state/services';

interface IEvent {
  eventType: string,
  service?: IService,
  logGroup?: ILogGroup
}

export let socket: WebSocket;

export const initSocket = async () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('dashboard.user')!)
    console.log(user)
    const idToken = user.signInUserSession.idToken.jwtToken
    socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL!}?idToken=${idToken}`)
    socket.onopen = (event: any) => {
      console.log('opened');
    }
    socket.onmessage = (event: MessageEvent) => {
      console.log(event.data);
      JSON.parse(event.data).events.forEach((ev: IEvent) => {
        if (ev.eventType === 'CREATE') {
          if (ev.service) {
            useServiceStore.setState({...useServiceStore.getState(), services: [...(useServiceStore.getState().services || []), ev.service]})
          } else if (ev.logGroup) {
            if (useLogGroupStore.getState().logGroups[ev.logGroup.serviceName]) {
              const temp: LogGroupState = addLogGroups(useLogGroupStore.getState().logGroups, [ev.logGroup], ev.logGroup.serviceName)
              useLogGroupStore.setState({...useLogGroupStore.getState(), logGroups: {...temp}})
            }
          }
        } else if (ev.eventType === 'DELETE') {
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
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}

export const closeSocket = () => {
  try {
    socket?.close()
    console.log('closed')
  } catch (e) {
    console.log(e);
  }
}

