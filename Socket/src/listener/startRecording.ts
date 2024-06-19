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


class StartRecording extends BaseWebSocketListener {
    listenerKey: string;
    private _operator: RecorderOperator | null = null
    private _isPrepared: boolean = true;

    constructor(webSocketServer: RecorderOperator, webSocket: WebSocket, webSocketHooks: RecorderHooks) {
        super(webSocketServer, webSocket, webSocketHooks)

        this._operator = this.webSocketServer as RecorderOperator

        this._operator?.Hooks.SubscribeHookListener(OperatorHooks.UPDATE_RECORDER, this.OnUpdateRecorder.bind(this))
    }

    private OnUpdateRecorder(recorder: Recorder[]) {
        this._isPrepared = this.ValidateRecorderStates(recorder)
    }
    private ValidateRecorderStates(recorder: Recorder[]): boolean {

        for (const element of recorder) {

            if (element.Type === 'Sub') {
                if (element.State !== 'Waiting') {
                    return false;
                }
            } else if (element.Type === 'Master') {
                if (element.State !== 'Idle') {
                    return false;
                }
            }
        }
        // Wenn alle Bedingungen erfüllt sind, gib True zurück
        return true;
    }

    protected SetKey(): void {
        this.listenerKey = Free3DKeys.TRIGGER_RECORD
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this._operator?.Hooks.UnSubscribeListener(OperatorHooks.UPDATE_RECORDER, this.OnUpdateRecorder.bind(this))
    }
    protected listener(body: TPrepareRecord): void {
        const fileName: string = body.FileName

        if (!this._isPrepared) {
            console.log("Recorder wurden bereits gestartet.")

            const errorEvent: ReceivedEvent = new ReceivedEvent("ERROR");
            errorEvent.addData("Message", "Recorder wurden bereits gestartet.")

            this.webSocket.send(errorEvent.JSONString)

            return
        }

        this._operator?.Hooks.DispatchHook(OperatorHooks.RECORD, {
            FileName: fileName
        })
    }
}

module.exports = StartRecording