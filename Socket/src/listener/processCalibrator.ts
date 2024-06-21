import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { RecordingState } from "../types/recorder";
import { RecorderOperator } from "../..";
import { RecorderHooks } from "../hooks/recorderHooks";
import { Free3DKeys } from "../types/keys";
import { Calibrator } from "../data/calibrator";
import { OperatorHooks } from "../hooks/operatorHooks";


class ProcessCalibrator extends BaseWebSocketListener {
    listenerKey: string;
    private _calibrator: Calibrator | null = null
    private _operator: RecorderOperator | null = null

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
        this.listenerKey = Free3DKeys.PROCESS_CALIBRATOR
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.CREATE_CALIBRATOR, this.OnCreateCalibrator)
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.REMOVE_CALIBRATOR, this.OnRemoveCalibrator)
    }
    protected listener(body: RecordingState): void {
        if (this._calibrator === null) {
            return
        }

        const state: string = body.State

        this._calibrator.TakeState(state)

        this._operator?.Hooks.DispatchHook(OperatorHooks.UPDATE_CALIBRATOR, this._calibrator)
    }

}

module.exports = ProcessCalibrator