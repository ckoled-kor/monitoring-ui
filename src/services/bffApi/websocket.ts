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
    socket.onmessage = (event: any) => {
      console.log(event.data);
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

