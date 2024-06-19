import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";

export class RecorderHooks extends WebSocketHooks {
    public static readonly CREATE_RECORDER = "CREATE_RECORDER"
    public static readonly REMOVE_RECORDER = "REMOVE_RECORDER"
}