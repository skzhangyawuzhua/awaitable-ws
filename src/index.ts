import { Subject, Subscription } from "rxjs";
import type { WebSocket as NodeWs } from "ws";

interface wsConfig {
  url: string;
  protocols?: string;
  openFn?: () => void;
}

interface request_handler {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

interface taro_ws extends Omit<Taro.SocketTask, "send" | "close"> {
  send: (n: string) => void;
  close: (arg0: number, reason: string) => void;
}

class awaitableWs {
  public connection_status_object: Subject<boolean>;
  public ws_config: wsConfig;

  public is_taro: boolean = false;

  private connected = false;
  wsp!: WebSocket | NodeWs | taro_ws;
  private disable_reconnection = false;

  constructor(config: wsConfig) {
    this.ws_config = config;

    this.connection_status_object = new Subject<boolean>();

    this.connect_websocket(config);
  }

  public handle_ws_open = () => {
    this.connection_status_object.next(true);

    this.connected = true;

    this.ws_config.openFn && this.ws_config.openFn();
  };

  private handle_ws_close() {
    console.log("on close");

    this.callbacks.forEach(v => {
      v.reject("disconnected");
    });

    this.callbacks.clear();

    this.connection_status_object.next(false);

    this.connected = false;

    if (!this.disable_reconnection) {
      const timer = setTimeout(() => {
        this.connect_websocket(this.ws_config);
        clearTimeout(timer);
      }, 1000);
    }
  }

  private async connect_websocket(config: wsConfig) {
    const { url, protocols } = config;

    try {
      if (process.env.TARO_ENV) {
        this.is_taro = true;
      }
    } catch (e) {}

    this.callbacks.clear();

    if (this.is_taro) {
      const taro = await import("@tarojs/taro");

      const mini = await taro.connectSocket({
        url,
        protocols: protocols ? [protocols] : void 0,
      });

      this.wsp = {
        ...mini,
        send: (n: string) => {
          mini.send({
            data: n,
          });
        },
        close: (code: number, reason: string) => {
          mini.close({ code, reason });
        },
      };
    } else if (this.is_browser) {
      this.wsp = new WebSocket(url);
    } else {
      const ws = (await import("ws")).default;

      this.wsp = new ws(url);
    }

    if (this.is_taro) {
      (this.wsp as taro_ws).onMessage(e => {
        this.on_json_rpc_reply(e as any);
      });

      (this.wsp as taro_ws).onClose(() => {
        this.handle_ws_close();
      });

      (this.wsp as taro_ws).onOpen(() => {
        this.handle_ws_open();
      });
    } else {
      (this.wsp as WebSocket).onmessage = e => this.on_json_rpc_reply(e);

      (this.wsp as WebSocket).onclose = () => {
        this.handle_ws_close();
      };

      (this.wsp as WebSocket).onopen = () => {
        this.handle_ws_open();
      };
    }
  }

  private get is_browser() {
    return typeof window === "object";
  }

  private async ensure_connected() {
    if (this.connected) return;
    while (!this.connected) {
      await this.sleep();
    }
  }

  private sleep(n?: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, n || 800);
    });
  }

  public is_connected() {
    return this.connected;
  }

  private id = 0;

  public cookie: string = "";

  private callbacks = new Map<number, request_handler>();

  private async on_json_rpc_reply(ev: MessageEvent) {
    try {
      const rep = JSON.parse(ev.data as string);

      if (!rep.id) {
        return;
      }

      this.callbacks.get(rep.id)?.resolve(rep);
      this.callbacks.delete(rep.id);
    } catch (e) {
      // console.log(e);
    }
  }

  public send<responseType>(req: object) {
    return new Promise<responseType>((resolve, reject) => {
      this.ensure_connected().then(() => {
        this.id++;
        this.callbacks.set(this.id, {
          resolve,
          reject,
        });

        this.wsp.send(JSON.stringify({ ...req, id: this.id }));
      });
    });
  }

  public custom_send(arg: any) {
    return new Promise((resolve, reject) => {
      this.ensure_connected().then(() => {
        this.id++;
        this.callbacks.set(this.id, {
          resolve,
          reject,
        });

        this.wsp.send(arg);
      });
    });
  }

  public close(reconnect: boolean = true) {
    this.disable_reconnection = reconnect;
    this.wsp.close(0, "");
  }
}

export default awaitableWs;
