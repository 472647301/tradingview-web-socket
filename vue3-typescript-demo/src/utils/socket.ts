import type { IUtilsMap } from "@/types/utils";
import pako from "@/plugins/pako";
import dayJS from "@/plugins/dayjs";
import EventEmitter from "@/plugins/events";

class TvWebSocket {
  private url = "wss://api.huobi.pro/ws";
  private ws: WebSocket | null = null;
  private success: IUtilsMap<string> = {};
  private failure: IUtilsMap<string> = {};
  private timer: NodeJS.Timer | null = null;
  private evt = new EventEmitter();

  public initWebSocket() {
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";
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
      // 斷線重新訂閱
      for (const key in this.success) {
        this.ws.send(this.success[key]);
        console.log(` >> WebSocket send: ${this.success[key]}`);
      }
    }
    // 失敗重新訂閱
    for (const key in this.failure) {
      if (this.success[key]) {
        continue;
      }
      this.ws.send(this.failure[key]);
      this.success[key] = this.failure[key];
      console.log(` >> WebSocket send: ${this.failure[key]}`);
    }
    this.failure = {};
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

  private onmessage(event: MessageEvent<pako.Data>) {
    if (!event.data) {
      return;
    }
    const text = pako.inflate(event.data, {
      to: "string",
    });
    const data = JSON.parse(text);
    // console.log("---inflate----", data);
    if (data && data.ping) {
      this.ws?.send(
        JSON.stringify({
          pong: Date.now(),
        })
      );
      return;
    }
    this.onBroadcast(data);
  }

  /**
   * 廣播通知
   */
  private onBroadcast(msg: any) {
    if (!this.success[msg.ch]) {
      return;
    }
    this.evt.emit(msg.ch, msg);
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
    const unsub = JSON.parse(this.success[name]);
    unsub.cmd = "unsub";
    this.ws.send(JSON.stringify(unsub));
    this.evt.removeAllListeners(name);
    console.log(` >> WebSocket send: ${JSON.stringify(unsub)}`);
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
    console.log(` >> WebSocket 準備訂閱: ${this.failure[name]}`);
    return this.evt.on(name, callback);
  }

  /**
   * 斷線重連
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
