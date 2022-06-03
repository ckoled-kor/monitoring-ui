import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, List } from 'antd';
import { useEffect, useState } from 'react';
import { usePopupContext } from './graph';

import styles from './serviceInfo.module.css';

const staticlogs = require('./logGroups.json');

export default function ServiceInfo({ serviceName }: any) {
  const [showModal, setShowModal] = usePopupContext();
  const [logGroups, setLogGroups] = useState([] as any);

  const close = () => {
    setShowModal(false);
  }

  useEffect(() => {
    const getData = async () => {
      const logs = staticlogs[serviceName];
      await new Promise(r => setTimeout(r, 1000));
      setLogGroups(logs);
    }
    getData();
  }, []);

  return (
    <div className={styles.content_div}>
      <Button className={styles.exit} icon={<CloseOutlined />} danger onClick={close}/>
      <h1 className={styles.title}>{serviceName}</h1>
      {logGroups.length===0?<LoadingOutlined className={styles.loading}/>:
        <List
          className={styles.list}
          dataSource={logGroups}
          renderItem={(logGroup: any) => (
            <List.Item style={{color:(logGroup.logErrorStatus)?'red':'inherit'}}>
              {logGroup.logGroupName}
            </List.Item>
          )}
        />
      }
    </div>
  );
}