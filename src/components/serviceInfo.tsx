import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Divider, List } from 'antd';
import { useEffect, useState } from 'react';
import date from 'date-and-time';

import { usePopupContext } from './graph';

import styles from './serviceInfo.module.css';
import { BffApiService } from '../services/bffApi';
import { useAuth } from '../config/auth';
import { ILogGroup, IService } from '../interfaces';
import { useLogGroupStore } from '../services/state/logGroups';

// const staticlogs = require('./logGroups.json');

export default function ServiceInfo({ service }: {service: IService}) {
  const auth = useAuth();
  const logGroupStore = useLogGroupStore();
  const [showModal, setShowModal] = usePopupContext();
  const [logGroups, setLogGroups] = useState([] as ILogGroup[]);

  const close = () => {
    setShowModal(false);
  }

  useEffect(() => {
    const api = new BffApiService(auth.apiToken || sessionStorage.getItem('dashboard.token')!)
    const getData = async () => {
      // const logs: ILogGroup[] = staticlogs[service.serviceName];
      // await new Promise(r => setTimeout(r, 1000));
      if (!logGroupStore.logGroups[service.serviceName]) {
        const theLogs = (await api.getLogGroups(service.serviceName))?.logGroups!;
        logGroupStore.addLogGroups(theLogs, service.serviceName);
      }
      const logs = logGroupStore.logGroups[service.serviceName] || [];
      setLogGroups(logs);
      // setLogGroups(logs?.logGroups);
    }
    getData();
  }, [auth.apiToken, logGroupStore, service.serviceName]);

  return (
    <div className={styles.content_div}>
      <Button className={styles.exit} type='text' icon={<CloseOutlined />} danger onClick={close}/>
      <h1 className={styles.title}>{service.serviceName}</h1>
      <Divider className={styles.divider} />
      <p className={styles.status}>Status:&nbsp;{<p style={{color:service.healthStatus.status==='UP'?'green':'red', fontWeight:'bold'}}>{service.healthStatus.status}</p>}</p>
      <p className={styles.contact}>Contact Info: {service.contactInfo?.name} {<a href={`mailto:${service.contactInfo?.email}`}>{service.contactInfo?.email}</a>}</p>
      <p className={styles.team}>Team: {service.team}</p>
      <p className={styles.last_update}>Last Update: {date.format(new Date(service.lastUpdateTS), 'YYYY/MM/DD HH:mm:ss')}</p>
      <p className={styles.error_status}>Log Error Status:&nbsp;{service.logErrorStatus?<p style={{color:'red', fontWeight:'bold'}}>{service.logErrorStatus}</p>:<p style={{color:'green', fontWeight:'bold'}}>OK</p>} {service.lastLogEventsWithErrorsTS && date.format(new Date(service.lastLogEventsWithErrorsTS), 'YYYY/MM/DD HH:mm:ss')}</p>
      <Divider className={styles.list_divider} orientation='left'>Log Groups</Divider>
      {logGroups.length===0?<LoadingOutlined className={styles.loading}/>:
        <List
          className={styles.list}
          dataSource={logGroups}
          renderItem={(logGroup: ILogGroup) => (
            <List.Item className={styles.list_item}>
              <a href={logGroup.logGroupLink} className={styles.log} style={{color:(logGroup.logErrorStatus)?'red':'inherit'}}>{logGroup.logGroupName}</a>
              <text style={{marginRight:'5px', fontSize: '12px'}}>{date.format(new Date(logGroup.lastUpdateTS), 'YYYY/MM/DD HH:mm:ss')}</text>
            </List.Item>
          )}
        />
      }
    </div>
  );
}