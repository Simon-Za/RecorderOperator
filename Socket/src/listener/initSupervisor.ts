import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { RecordingState } from "../types/recorder";
import { RecorderOperator } from "../..";
import { RecorderHooks } from "../hooks/recorderHooks";
import { Free3DKeys } from "../types/keys";
import { Recorder } from "../data/recorder";
import { OperatorHooks } from "../hooks/operatorHooks";
import { RecorderProxy } from "../types/proxy";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";

class Supervisor {

}

class InitSupervisor extends BaseWebSocketListener {
    listenerKey: string;
    private _operator: RecorderOperator | null = null
    private _supervisor: Supervisor | null = null

    constructor(webSocketServer: RecorderOperator, webSocket: WebSocket, webSocketHooks: RecorderHooks) {
        super(webSocketServer, webSocket, webSocketHooks)

        this._operator = this.webSocketServer as RecorderOperator


    }

    private OnUpdateRecorder = (recorder: Recorder[]) => {
        console.log(this)
        const takeRecorder: ReceivedEvent = new ReceivedEvent(OperatorHooks.UPDATE_RECORDER)
        takeRecorder.addData("Proxy", this.GetRecorderProxy(recorder))
        this.webSocket.send(takeRecorder.JSONString)
    }
    private OnFinish = () => {
        const onFinish: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_FINISH_RECORD)
        this.webSocket.send(onFinish.JSONString)
    }

    private GetRecorderProxy(recorder: Recorder[]): RecorderProxy[] {
        const recorderProxy: RecorderProxy[] = []
        for (const r of recorder) {
            recorderProxy.push(r.RecorderData)
        }

        return recorderProxy
    }

    protected SetKey(): void {
        this.listenerKey = Free3DKeys.INIT_SUPERVISOR
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        if (this._supervisor === null) {
            return
        }

        console.log("1111111111111111111")
        console.log(this._operator?.Hooks.listenerCount(OperatorHooks.UPDATE_RECORDER))
        console.log(this._operator?.Hooks.listenerCount(OperatorHooks.FINISH))

        this._operator?.Hooks.UnSubscribeListener(OperatorHooks.UPDATE_RECORDER, this.OnUpdateRecorder.bind(this))
        this._operator?.Hooks.UnSubscribeListener(OperatorHooks.FINISH, this.OnFinish.bind(this))
    }
    protected listener(body: any): void {
        if (this._supervisor !== null) {
            console.log("Supervisor wurde bereits initiiert.")
            return
        }

        this._supervisor = new Supervisor()

        this._operator?.Hooks.SubscribeHookListener(OperatorHooks.UPDATE_RECORDER, this.OnUpdateRecorder.bind(this))
        this._operator?.Hooks.SubscribeHookListener(OperatorHooks.FINISH, this.OnFinish.bind(this))

        console.log(this._operator?.Hooks.listenerCount(OperatorHooks.UPDATE_RECORDER))
        console.log(this._operator?.Hooks.listenerCount(OperatorHooks.FINISH))

        const recorder: Recorder[] | undefined = this._operator?.Recorder

        if (recorder === undefined) {
            return;
        }

        if (recorder.length === 0) {
            return;
        }

        const takeRecorder: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_INIT_SUPERVISOR)
        takeRecorder.addData("Proxy", this.GetRecorderProxy(recorder))
        this.webSocket.send(takeRecorder.JSONString)
    }

}

module.exports = InitSupervisor