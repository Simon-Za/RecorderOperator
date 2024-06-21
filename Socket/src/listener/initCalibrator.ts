import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { RecorderOperator } from './../../index';
import { RecorderHooks } from "../hooks/recorderHooks";
import { Free3DKeys } from "../types/keys";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { Calibrator } from "../data/calibrator";

class InitCalibrator extends BaseWebSocketListener {
    listenerKey: string;
    private _operator: RecorderOperator | null = null;
    private _calibrator: Calibrator | null = null;

    constructor(webSocketServer: RecorderOperator, webSocket: WebSocket, webSocketHooks: RecorderHooks) {
        super(webSocketServer, webSocket, webSocketHooks)

        this._operator = this.webSocketServer as RecorderOperator

        this.webSocketHooks.SubscribeHookListener(RecorderHooks.CREATE_CALIBRATOR, this.OnCreateCalibrator)
        this.webSocketHooks.SubscribeHookListener(RecorderHooks.REMOVE_CALIBRATOR, this.OnRemoveCalibrator)
    }

    private OnCreateCalibrator = (calibrator: Calibrator) => {
        this._calibrator = calibrator
    }

    private OnRemoveCalibrator = (calibrator: Calibrator) => {
        this._calibrator = null
    }

    protected SetKey(): void {
        this.listenerKey = Free3DKeys.INIT_CALIBRATOR
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.CREATE_CALIBRATOR, this.OnCreateCalibrator)
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.REMOVE_CALIBRATOR, this.OnRemoveCalibrator)
    }
    protected listener(body: any): void {
        if (this._calibrator !== null) {
            console.log("Calibrator wurde bereits eingeloggt.")
            return;
        }

        this._operator?.CreateCalibrator(this.webSocket, this.webSocketHooks)

        const onInitCalibrator: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_INIT_CALIBRATOR)
        this.webSocket.send(onInitCalibrator.JSONString)
    }

}

module.exports = InitCalibrator