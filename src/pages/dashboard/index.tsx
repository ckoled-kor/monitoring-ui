import GlobalLayout from '../../components/layout';
import Flow from '../../components/graph';

import './dashboard.css';
import { useEffect } from 'react';
import { initSocket, socket } from '../../services/bffApi/websocket';

export default function Dashboard() {
  document.title='Dashboard | Monitoring App';
  useEffect(() => {
    // commented out cuz changing websocket.js sets socket to undefined while still open
    if ((!socket || socket.readyState === WebSocket.CLOSED)) initSocket()
    console.log(socket)
  }, [])
  return (
    <GlobalLayout>
      <div className='graph-div'>
        <Flow />
      </div>
    </GlobalLayout>
  );
}
