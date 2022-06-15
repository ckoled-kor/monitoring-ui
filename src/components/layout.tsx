import { Button, Dropdown, Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import styles from './layout.module.css'

import 'antd/dist/antd.css';
import { useAuth } from '../config/auth';
import { useNavigate } from 'react-router-dom';
import socket from '../services/bffApi/websocket';

const { Header, Content, Footer } = Layout;

export default function GlobalLayout({ children, login }: any) {
  const auth = useAuth();
  const nav = useNavigate();

  const onLogout = async () => {
    try {
      await auth.signOut();
      nav('/login', { replace: true })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Layout className={styles.layout} style={{
      minHeight: '100vh',
      position: 'relative'
    }}>
      <Header className={styles.header} style={{background:'black'}}>
        <a style={{height:'100%'}} href='/dashboard'>
          <svg xmlns='http://www.w3.org/2000/svg' className={styles.logo} href='/dashboard'>
            <g fill="none">
              <path fill="#FFF" d="M14 1.6c-.6-.5-1.3-1-2.1-1.2A13 13 0 008.7 0H0v23h4.5v-8h4c1.2 0 2.3 0 3.3-.4.8 0 1.5-.5 2.2-1 .6-.7 1-1.6 1.3-2.5a16.6 16.6 0 000-7.1c-.3-1-.7-1.7-1.3-2.4zm-3 7.8c0 .5-.4.9-.6 1.3-.2.3-.6.4-.9.5l-1.5.2H4.5V4H8l1.4.1c.4.1.7.3 1 .6l.5 1 .2 1.8c0 .7 0 1.4-.2 2zm18.7-1C29 7.7 28.3 7 27.4 7a9.6 9.6 0 00-3.3-.6c-1.2 0-2.4.2-3.4.4-1 .3-1.7.7-2.2 1.4a5 5 0 00-1.3 2.6c-.3 1.4-.4 2.8-.4 4.1l.3 4a9 9 0 001.2 2.6c.6.7 1.4 1 2.3 1.4a14 14 0 006.8 0c.9-.3 1.6-.7 2.3-1.4.5-.8 1-1.6 1-2.6a20.2 20.2 0 000-8c0-1-.5-1.7-1-2.5zm-3.1 9.1c0 .6-.2 1.1-.4 1.7l-.9.7h-2.6c-.4-.2-.7-.5-.9-.9-.2-.4-.4-1-.4-1.5l-.1-2.6.1-2.4c0-.6.2-1.1.4-1.5.2-.3.5-.6.9-.7.8-.2 1.8-.2 2.6 0 .3.1.6.4.9.7.2.4.4 1 .4 1.5l.1 2.4-.1 2.6zm7.7-9.4c-.9.8-1.3 2.3-1.3 4.2V23h4.4V12.2c-.2-.6.1-1.1.4-1.5.4-.3 1-.4 1.5-.4h2.3V6.7h-2.8c-2.1 0-3.5.4-4.5 1.4zm17 5.5l-2.2-.3-1.8-.7c-.3-.3-.4-.7-.4-1.2-.2-.4.1-.9.4-1.1.6-.3 1.1-.4 1.7-.4a3 3 0 011.7.4c.4.5.5 1 .5 1.7H55c0-1.9-.4-3.4-1.3-4.2A8.5 8.5 0 0049 6.4c-2.1 0-3.7.4-4.8 1.3a5 5 0 00-1.7 3.8c0 1.6.5 2.7 1.3 3.6.8.8 2 1.3 3 1.5l2.2.4c.5 0 1.1.2 1.7.5.2.3.5.7.4 1.1 0 .6-.2 1-.4 1.3-.3.2-.9.4-1.9.4-.5.1-1.2-.2-1.8-.4-.3-.3-.5-.9-.5-1.8h-4c0 .7.2 1.3.3 2 .2.6.4 1.3.9 1.7.5.5 1.2.8 2 1a11.1 11.1 0 006 0c1 0 1.6-.3 2.2-.9l1.1-1.5c.1-.7.3-1.2.3-2 .1-1.2-.3-2.2-1-3.2-.8-.8-2-1.4-3-1.6zm10-2.6l.7-.7 1.4-.1 1.2.1.7.4c0 .4.2.7.4 1.1l.1 1.5H70c0-1-.1-2-.4-3-.2-.8-.6-1.5-1.1-2.2a4 4 0 00-2-1.2c-1-.3-2-.4-3-.4a14 14 0 00-3.3.4c-.8.3-1.5.7-2 1.4A5 5 0 0057 11c-.3 1.3-.5 2.6-.5 4 0 1.3.2 2.5.3 3.8.3 1 .7 1.9 1.3 2.6.5.6 1.2 1.2 2 1.5 1.2.2 2.3.4 3.4.4 2.3.1 3.8-.4 4.8-1.5 1-1 1.5-2.8 1.7-5.1h-4l-.2 1.6-.4 1.1-.7.6-1.2.1-1.4-.1-.7-.7c-.2-.5-.4-1-.4-1.6l-.1-2.5.1-2.6c0-.6.2-1.1.4-1.5zM80 6.4c-1.8 0-3 .7-3.7 1.8V0h-4.4v23h4.4v-9.9c0-1 .1-1.9.5-2.3.4-.4 1.1-.7 1.8-.5l1.2.1c.2 0 .4.3.5.4.3.4.4.7.4 1.1.2.4.2 1 .2 1.5V23h4.3V12.5c0-2-.4-3.5-1.1-4.4-.8-1.1-2.2-1.7-4-1.7zm21 8.5a17 17 0 00-.4-3.8c-.1-1-.5-1.8-1.1-2.6A4.6 4.6 0 0097.4 7a9.6 9.6 0 00-3.4-.6c-1 0-2 .2-3.2.6-.8.3-1.5.8-2 1.5-.8.7-1.2 1.6-1.3 2.6a17.9 17.9 0 000 7.8 5 5 0 001.2 2.6c.6.7 1.3 1 2.3 1.4 1 .2 2 .4 3.3.4 2.1 0 3.7-.4 4.6-1.4 1-1 1.6-2.5 1.7-3.8h-3.9c0 .5-.3 1.2-.7 1.6-.6.3-1.1.4-1.7.4l-1.2-.1c-.5-.1-.7-.3-.9-.7-.3-.3-.4-.8-.5-1.2-.2-.7-.2-1.4-.2-2h9.5v-1.2zm-9.5-1.6c0-.6.2-1.1.3-1.7.1-.4.3-.8.6-1 .1-.2.4-.3.7-.5l1-.1 1.2.1c.3.2.6.3.7.6.3.3.4.5.4 1 .2.5.2 1 .2 1.6h-5z"></path>
              <path fill="#D5001C" d="M124.3 2.3a5.5 5.5 0 00-2.8-1.8 16 16 0 00-4.4-.5h-8.3v23h8.2c1.5 0 3.1-.1 4.5-.7 1.1-.2 2.1-1 3-1.9.7-1 1.2-2.2 1.4-3.6a34.5 34.5 0 000-11c-.3-1.3-.9-2.4-1.6-3.5zm-3 13.5c0 .8-.2 1.6-.6 2.4-.3.6-.7.8-1.3 1.1-.9.2-1.6.2-2.3.2h-3.6V4h3.6l2.3.2c.6.3 1 .6 1.3 1.1.4.7.5 1.5.7 2.2l.1 3.9-.1 4.4zm7.1 7.2h4.4V6.7h-4.4V23zm0-19h4.4V0h-4.4v4zm16.7 4.9c-.3-.8-.9-1.5-1.7-2-.7-.2-1.4-.5-2.3-.5a7 7 0 00-2.8.6c-.7.3-1.4.7-2 1.4a5 5 0 00-1 2.4 17.7 17.7 0 000 7.8c0 1 .3 1.8.9 2.6.4.7 1.1 1.1 1.8 1.4 1 .3 1.9.4 2.9.4.7 0 1.5-.1 2.2-.4.7-.4 1.3-.8 1.6-1.5V24c0 .4 0 1-.2 1.3l-.4.9a3 3 0 01-.8.5h-2.4l-.7-.5a3 3 0 01-.5-.7l-.1-1.3h-4.2c0 .9.2 1.7.4 2.5.3.7.5 1.4 1.1 1.8a4 4 0 002 1c1.1.4 2.2.5 3.2.5 2.4 0 4.3-.5 5.4-1.5 1.1-1 1.7-2.6 1.7-5V6.8H145V9zm-.4 8.4l-.5 1.5c-.2.4-.5.7-.8.8l-1.4.1-1.3-.1c-.4-.1-.7-.4-.8-.8-.3-.4-.5-1-.5-1.5l-.1-2.6.1-2.4c0-.5.2-1 .5-1.3.1-.3.4-.6.8-.7.4-.2.9-.2 1.3-.2.6 0 1 0 1.4.2.3.1.6.4.8.7l.5 1.3.1 2.4-.1 2.6zM151.6 4h4.5V0h-4.5v4zm0 19h4.5V6.7h-4.5V23zm12.3-20h-4.3v3.8h-2v3.6h1.9v7.1c0 2.2.4 3.6 1.3 4.4.8 1 2.4 1.4 4.3 1.4h2.7V20H166c-.6 0-1.1-.2-1.7-.6-.3-.3-.4-.8-.4-1.6v-7.4h4V6.7h-4V3zM181 8.4a4.7 4.7 0 00-2-1.4 12.4 12.4 0 00-6.2 0 4 4 0 00-2 1l-1.1 1.7c-.3.8-.4 1.7-.4 2.5h4c0-1 .2-1.5.5-1.8.6-.3 1.1-.4 1.7-.4.8 0 1.4.1 1.7.5.3.6.4 1.3.4 2v.7l-2.1.4-3 .6c-.7.3-1.4.6-2 1.1-.5.5-1 .9-1.2 1.5-.3.6-.4 1.4-.3 2.1 0 1.5.4 2.6 1.4 3.3 1 .8 2.3 1 3.7 1 .8 0 1.7 0 2.5-.5a3 3 0 001.3-1.3V23h4.2V12.3c0-.7-.1-1.5-.3-2.2-.1-.6-.4-1.2-.8-1.7zm-3.4 9.5c0 .6-.1 1.3-.7 1.8-.4.4-1.1.6-1.7.6-1.3 0-2-.6-2-1.8 0-.6.3-1.1.7-1.4a7 7 0 012.4-.8l1.3-.3v2zm7-17.9v23h4.3V0h-4.4z"></path>
            </g>
          </svg>
        </a>
        {!login && <Dropdown overlay={<Menu
          items={[
            {
              key: '1',
              label: (
                <Button type='text' size='small' danger onClick={onLogout}>Logout</Button>
              ),
            }
          ]}
        />} placement="bottomRight">
          <Button className={styles.dropdown_button} type='text' style={{
            color: 'white',
            border: '2px solid',
            borderRadius:'50%'
          }} 
          icon={<UserOutlined/>}/>
        </Dropdown>}
      </Header>
      <Content className={styles.content} style={{
        minHeight: 'calc(100%-70px)',
        paddingBottom: '70px',
        marginTop: 'auto',
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch'
      }}>{children}</Content>
      <Footer className={styles.footer} style={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
      }}>Porsche Digital ©2022
      {/* <button onClick={() => socket.initSocket()}>
        Test Websocket</button><button onClick={() => socket.closeSocket()}>
        Close Websocket</button> */}
        </Footer>
    </Layout>
  );
}