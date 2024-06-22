import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { RecorderOperator } from "../..";
import { Free3DKeys } from "../types/keys";
import { RecorderHooks } from "../hooks/recorderHooks";
import { TCalibrate, TPrepareRecord } from "../types/recorder";
import { OperatorHooks } from "../hooks/operatorHooks";
import { Supervisor } from "../data/supervisor";
import { Calibrator } from "../data/calibrator";


class StartCalibrating extends BaseWebSocketListener {
    listenerKey: string;
    private _operator: RecorderOperator | null = null
    private _supervisor: Supervisor | null = null
    private _calibrator: Calibrator | null = null

    constructor(webSocketServer: RecorderOperator, webSocket: WebSocket, webSocketHooks: RecorderHooks) {
        super(webSocketServer, webSocket, webSocketHooks)

        this._operator = this.webSocketServer as RecorderOperator
        this._calibrator = this._operator.Calibrator
        this._supervisor = this._operator.Supervisor

        this.webSocketHooks.SubscribeHookListener(RecorderHooks.CREATE_SUPERVISOR, this.OnCreateSupervisor)
        this.webSocketHooks.SubscribeHookListener(RecorderHooks.REMOVE_SUPERVISOR, this.OnRemoveSupervisor)
    }

    private OnCreateSupervisor = (supervisor: Supervisor) => {
        this._supervisor = supervisor
        this._operator?.Hooks.SubscribeHookListener(OperatorHooks.CONNECT_CALIBRATOR, this.OnUpdateCalibrator)
    }
    private OnRemoveSupervisor = (supervisor: Supervisor) => {
        this._operator?.Hooks.UnSubscribeListener(OperatorHooks.DISCONNECT_CALIBRATOR, this.OnUpdateCalibrator)
        this._supervisor = null
    }

    private OnUpdateCalibrator = (calibrator: Calibrator) => {
        this._calibrator = calibrator
    }

    protected SetKey(): void {
        this.listenerKey = Free3DKeys.TRIGGER_CALIBRATION
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.CREATE_SUPERVISOR, this.OnCreateSupervisor)
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.REMOVE_SUPERVISOR, this.OnRemoveSupervisor)
    }
    protected listener(body: TCalibrate): void {
        if (this._supervisor === null) {
            console.log("Supervisor muss erst initiiert werden.")
            return;
        }

        if (this._calibrator === null) {
            console.log("Calibrator muss sich erst verbunden haben.")
            return
        }

        this._operator?.Hooks.DispatchHook(OperatorHooks.CALIBRATE, body.Proxy)
    }
}

module.exports = StartCalibrating