import dayJS from "dayjs";
import { EventEmitter } from "events";

class TvWebSocket {
  private url = "wss://api.fcoin.pro/v2/ws";
  private ws: WebSocket | null = null;
  private success: IUtilsMap<string> = {};
  private failure: IUtilsMap<string> = {};
  private timer: NodeJS.Timeout | null = null;
  private evt = new EventEmitter();

  public initWebSocket() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = this.onopen.bind(this);
    this.ws.onclose = this.onclose.bind(this);
    this.ws.onerror = this.onerror.bind(this);
    this.ws.onmessage = this.onmessage.bind(this);
    console.log(" >> WebSocket init :", this.url);
  }

  private onopen() {
    if (!this.ws) {
      return;
    }
    console.log(" >> WebSocket open...");
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      // 断线重新订阅
      for (const key in this.success) {
        this.ws.send(this.success[key]);
        console.log(` >> WebSocket send: ${this.success[key]}`);
      }
    }
    // 失败重新订阅
    for (const key in this.failure) {
      if (this.success[key]) {
        continue;
      }
      this.ws.send(this.failure[key]);
      this.success[key] = this.failure[key];
      console.log(` >> WebSocket send: ${this.failure[key]}`);
    }
    this.failure = {};
    setInterval(() => {
      this.ws?.send(
        JSON.stringify({
          cmd: "ping",
          args: [Date.now()],
          id: "react-tv",
        })
      );
    }, 10000);
  }

  private onclose() {
    this.ws = null;
    console.log(" >> Websocket Close...");
    if (!this.timer) {
      this.onReconnection();
    }
  }

  private onerror(event: Event) {
    console.log(" >> Websocket Error...", event);
  }

  private onmessage(event: MessageEvent) {
    try {
      if (!event.data) {
        return;
      }
      const data = JSON.parse(event.data);
      if (data.type === "ping") {
        return;
      }
      this.onBroadcast(data);
    } catch (e) {}
  }

  /**
   * 广播通知
   */
  private onBroadcast(msg: any) {
    if (!this.success[msg.type]) {
      return;
    }
    this.evt.emit(msg.type, msg);
  }

  public subscribe(
    name: string,
    params: any,
    callback: (...args: any[]) => void
  ) {
    let ee: EventEmitter;
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      ee = this.failurePush(name, params, callback);
    } else {
      ee = this.successPush(name, params, callback);
    }
    return {
      remove: () => {
        this.unsubscribe(name);
        ee.removeAllListeners(name);
      },
    };
  }

  public unsubscribe(name: string) {
    if (this.failure[name]) {
      delete this.failure[name];
    }
    if (!this.success[name]) {
      return;
    }
    if (!this.ws) {
      delete this.success[name];
      return;
    }
    this.evt.removeAllListeners(name);
    console.log(` >> WebSocket send: ${this.success[name]}`);
    delete this.success[name];
  }

  private successPush(
    name: string,
    params: any,
    callback: (...args: any[]) => void
  ) {
    this.success[name] = JSON.stringify(params);
    this.ws?.send(this.success[name]);
    console.log(` >> WebSocket send: ${this.success[name]}`);
    return this.evt.on(name, callback);
  }

  private failurePush(
    name: string,
    params: any,
    callback: (...args: any[]) => void
  ) {
    this.failure[name] = JSON.stringify(params);
    console.log(` >> WebSocket 准备订阅: ${this.failure[name]}`);
    return this.evt.on(name, callback);
  }

  /**
   * 断线重连
   */
  private onReconnection() {
    if (!this.url) {
      return;
    }
    this.initWebSocket();
    this.timer = setInterval(() => {
      this.initWebSocket();
      const now = dayJS().format("YYYY-MM-DD HH:mm:ss");
      console.log(` >> [${now}] WebSocket Reconnect....`);
    }, 3000);
  }
}

export const ws = new TvWebSocket();
