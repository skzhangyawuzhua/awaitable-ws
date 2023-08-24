import { Subject } from "rxjs";
import type { WebSocket as NodeWs } from "ws";
interface wsConfig {
    url: string;
    is_taro?: boolean;
    protocols?: string;
    openFn?: (msg: any) => void;
}
interface taro_ws extends Omit<Taro.SocketTask, "send" | "close"> {
    send: (n: string) => void;
    close: (arg0: number, reason: string) => void;
}
declare class awaitableWs {
    connection_status_object: Subject<boolean>;
    ws_config: wsConfig;
    private connected;
    wsp: WebSocket | NodeWs | taro_ws;
    private disable_reconnection;
    constructor(config: wsConfig);
    private handle_ws_close;
    private connect_websocket;
    private get is_browser();
    openFn: (msg: any) => void;
    private ensure_connected;
    private sleep;
    is_connected(): boolean;
    private id;
    cookie: string;
    private callbacks;
    private on_json_rpc_reply;
    send<responseType>(req: object): Promise<responseType>;
    custom_send(arg: any): Promise<unknown>;
    close(reconnect?: boolean): void;
}
export default awaitableWs;
