import { Button, Dropdown, Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import styles from './layout.module.css'

import 'antd/dist/antd.css';

const { Header, Content, Footer } = Layout;

export default function GlobalLayout({ children, login }: any) {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <h1 className={styles.logo}>Company Logo</h1>
        {!login && <Dropdown overlay={<Menu
          items={[
            {
              key: '1',
              label: (
                <a target="_blank" rel="noopener noreferrer" href="/dashboard">
                  DashBoard
                </a>
              )
            }
          ]}
        />} placement="bottomRight">
          <Button className={styles.dropdown_button} icon={<UserOutlined/>}/>
        </Dropdown>}
      </Header>
      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}>Company Name ©2022</Footer>
    </Layout>
  );
}