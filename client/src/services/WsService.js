class WsService {
  setWs = (ws) => {
    this.ws = ws;
  };

  onmessage = (msg) => {
    console.log(msg);
  };
}

const wsService = new WsService();

export default wsService;
