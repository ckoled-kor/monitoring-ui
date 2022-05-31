import { Layout } from 'antd';

import styles from './layout.module.css'

import 'antd/dist/antd.css';

const { Header, Content, Footer } = Layout;

export default function GlobalLayout({ children }: any) {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <h1 className={styles.logo}>Company Logo</h1>
      </Header>
      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}>Company Name ©2022</Footer>
    </Layout>
  );
}