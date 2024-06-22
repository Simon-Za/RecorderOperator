import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";

export class OperatorHooks extends WebSocketHooks {
    public static readonly PREPARE_RECORDING = "PREPARE_RECORDING";
    public static readonly RECORD = "RECORD"
    public static readonly UPDATE_RECORDER = "UPDATE_RECORDER"
    public static readonly FINISH_RECORD = "FINISH"
    public static readonly CONNECT_CALIBRATOR = "CONNECT_CALIBRATOR"
    public static readonly DISCONNECT_CALIBRATOR = "DISCONNECT_CALIBRATOR"
    public static readonly UPDATE_CALIBRATOR = "UPDATE_CALIBRATOR"
    public static readonly CALIBRATE = "CALIBRATE"
}