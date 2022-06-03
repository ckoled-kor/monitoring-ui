import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Divider, List } from 'antd';
import { useEffect, useState } from 'react';
import date from 'date-and-time';

import { usePopupContext } from './graph';

import styles from './serviceInfo.module.css';

const staticlogs = require('./logGroups.json');

export default function ServiceInfo({ service }: any) {
  const [showModal, setShowModal] = usePopupContext();
  const [logGroups, setLogGroups] = useState([] as any);

  const close = () => {
    setShowModal(false);
  }

  useEffect(() => {
    const getData = async () => {
      const logs = staticlogs[service.serviceName];
      await new Promise(r => setTimeout(r, 1000));
      setLogGroups(logs);
    }
    getData();
  }, [service.serviceName]);

  return (
    <div className={styles.content_div}>
      <Button className={styles.exit} type='text' icon={<CloseOutlined />} danger onClick={close}/>
      <h1 className={styles.title}>{service.serviceName}</h1>
      <Divider className={styles.divider} />
      <p className={styles.contact}>Contact Info: {service.contactInfo.name} {<a href={`mailto:${service.contactInfo.email}`}>{service.contactInfo.email}</a>}</p>
      <p className={styles.team}>Team: {service.team}</p>
      <p className={styles.last_update}>Last Update: {date.format(new Date(service.lastUpdateTS), 'YYYY/MM/DD HH:mm:ss')}</p>
      <p className={styles.error_status}>Log Error Status: {service.logErrorStatus?<text style={{color:'red'}}>{service.logErrorStatus}</text>:<text style={{color:'green'}}>OK</text>} {service.lastLogEventsWithErrorsTS && date.format(new Date(service.lastLogEventsWithErrorsTS), 'YYYY/MM/DD HH:mm:ss')}</p>
      <Divider className={styles.list_divider} orientation='left'>Log Groups</Divider>
      {logGroups.length===0?<LoadingOutlined className={styles.loading}/>:
        <List
          className={styles.list}
          dataSource={logGroups}
          renderItem={(logGroup: any) => (
            <List.Item className={styles.list_item}>
              <text style={{color:(logGroup.logErrorStatus)?'red':'inherit'}}>{logGroup.logGroupName}</text>
              <text style={{marginRight:'5px'}}>{date.format(new Date(logGroup.lastUpdateTS), 'YYYY/MM/DD HH:mm:ss')}</text>
            </List.Item>
          )}
        />
      }
    </div>
  );
}