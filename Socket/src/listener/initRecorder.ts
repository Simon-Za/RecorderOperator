import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { RecorderOperator } from './../../index';
import { RecorderHooks } from "../hooks/recorderHooks";
import { Free3DKeys } from "../types/keys";
import { TRecorder } from "../types/recorder";
import { Recorder } from "../data/recorder";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";

class InitRecorder extends BaseWebSocketListener {
    listenerKey: string;
    private _operator: RecorderOperator | null = null;
    private _recorder: Recorder | null = null;

    constructor(webSocketServer: RecorderOperator, webSocket: WebSocket, webSocketHooks: RecorderHooks) {
        super(webSocketServer, webSocket, webSocketHooks)

        this._operator = this.webSocketServer as RecorderOperator

        this.webSocketHooks.SubscribeHookListener(RecorderHooks.CREATE_RECORDER, this.OnCreateRecorder.bind(this))
    }

    private OnCreateRecorder(recorder: Recorder): void {
        this._recorder = recorder
    }

    protected SetKey(): void {
        this.listenerKey = Free3DKeys.INIT_RECORDER
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.CREATE_RECORDER, this.OnCreateRecorder.bind(this))
    }
    protected listener(body: TRecorder): void {
        console.log(body)
        const type: string = body.Type
        const id: string = body.ID

        if (this._recorder !== null) {
            console.log("Recorder wurde bereits aktiviert.")

            const errorEvent: ReceivedEvent = new ReceivedEvent("ERROR");
            errorEvent.addData("Message", "Recorder wurde bereits aktiviert.")

            this.webSocket.send(errorEvent.JSONString)
            return
        }

        this._operator?.CreateRecorder(type, id, this.webSocket, this.webSocketHooks)
    }

}

module.exports = InitRecorder