import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";

export class OperatorHooks extends WebSocketHooks {
    public static readonly PREPARE_RECORDING = "PREPARE_RECORDING";
    public static readonly RECORD = "RECORD"
    public static readonly UPDATE_RECORDER = "UPDATE_RECORDER"
    public static readonly FINISH = "FINISH"
}