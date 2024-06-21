import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { RecorderOperator } from "../..";
import { Free3DKeys } from "../types/keys";
import { RecorderHooks } from "../hooks/recorderHooks";
import { TPrepareRecord } from "../types/recorder";
import { OperatorHooks } from "../hooks/operatorHooks";
import { Recorder } from "../data/recorder";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";


class PrepareRecording extends BaseWebSocketListener {
    listenerKey: string;
    private _operator: RecorderOperator | null = null
    private _recorder: Recorder | null = null;
    private _isIdle: boolean = true;

    constructor(webSocketServer: RecorderOperator, webSocket: WebSocket, webSocketHooks: RecorderHooks) {
        super(webSocketServer, webSocket, webSocketHooks)

        this._operator = this.webSocketServer as RecorderOperator
        this.webSocketHooks.SubscribeHookListener(RecorderHooks.CREATE_RECORDER, this.OnCreateRecorder.bind(this))
    }

    private OnUpdateRecorder(recorder: Recorder[]) {
        this._isIdle = this.ValidateRecorderStates(recorder)
    }
    private ValidateRecorderStates(recorder: Recorder[]): boolean {
        for (const element of recorder) {
            if (element.Type === 'Sub') {
                if (element.State === 'Waiting' || element.State === 'Recording') {
                    return false;
                }
                if (!element.State.includes('Idle')) {
                    return false;
                }
            }
        }
        return true;
    }

    private OnCreateRecorder(recorder: Recorder): void {
        this._recorder = recorder
        this._operator?.Hooks.SubscribeHookListener(OperatorHooks.UPDATE_RECORDER, this.OnUpdateRecorder.bind(this))
    }

    protected SetKey(): void {
        this.listenerKey = Free3DKeys.PREPARE_RECORD
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.CREATE_RECORDER, this.OnCreateRecorder.bind(this))

        if (this._recorder === null) {
            return;
        }

        this._operator?.Hooks.UnSubscribeListener(OperatorHooks.UPDATE_RECORDER, this.OnUpdateRecorder.bind(this))
    }
    protected listener(body: TPrepareRecord): void {
        const fileName: string = body.FileName

        if (!this._isIdle) {
            console.log("Recorder warten bereits.")

            const errorEvent: ReceivedEvent = new ReceivedEvent("ERROR");
            errorEvent.addData("Message", "Recorder warten bereits.")

            this.webSocket.send(errorEvent.JSONString)

            return
        }

        this._operator?.Hooks.DispatchHook(OperatorHooks.PREPARE_RECORDING, {
            FileName: fileName
        })
    }
}

module.exports = PrepareRecording