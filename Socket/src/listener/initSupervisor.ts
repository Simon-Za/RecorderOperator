import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { RecorderOperator } from "../..";
import { RecorderHooks } from "../hooks/recorderHooks";
import { Free3DKeys } from "../types/keys";
import { Recorder } from "../data/recorder";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { Supervisor } from "../data/supervisor";
import { GetRecorderProxy } from "../helper/proxy";

class InitSupervisor extends BaseWebSocketListener {
    listenerKey: string;
    private _operator: RecorderOperator | null = null
    private _supervisor: Supervisor | null = null

    constructor(webSocketServer: RecorderOperator, webSocket: WebSocket, webSocketHooks: RecorderHooks) {
        super(webSocketServer, webSocket, webSocketHooks)

        this._operator = this.webSocketServer as RecorderOperator

        this.webSocketHooks.SubscribeHookListener(RecorderHooks.CREATE_SUPERVISOR, this.OnCreateSupervisor)
        this.webSocketHooks.SubscribeHookListener(RecorderHooks.REMOVE_SUPERVISOR, this.OnRemoveSupervisor)
    }

    private OnCreateSupervisor = (supervisor: Supervisor) => {
        this._supervisor = supervisor
    }

    private OnRemoveSupervisor = (supervisor: Supervisor) => {
        this._supervisor = null
    }

    protected SetKey(): void {
        this.listenerKey = Free3DKeys.INIT_SUPERVISOR
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.CREATE_SUPERVISOR, this.OnCreateSupervisor)
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.REMOVE_SUPERVISOR, this.OnRemoveSupervisor)
    }
    protected listener(body: any): void {
        if (this._supervisor !== null) {
            console.log("Supervisor wurde bereits initiiert.")
            return
        }

        this._operator?.CreateSupervisor(this.webSocket, this.webSocketHooks)

        const recorder: Recorder[] | undefined = this._operator?.Recorder

        const takeRecorder: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_INIT_SUPERVISOR)
        takeRecorder.addData("Recorder", GetRecorderProxy(recorder))
        takeRecorder.addData("Calibrator", this._operator?.Calibrator?.CalibratorData)
        this.webSocket.send(takeRecorder.JSONString)
    }

}

module.exports = InitSupervisor