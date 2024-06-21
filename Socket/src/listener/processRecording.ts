import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { RecordingState } from "../types/recorder";
import { RecorderOperator } from "../..";
import { RecorderHooks } from "../hooks/recorderHooks";
import { Free3DKeys } from "../types/keys";
import { Recorder } from "../data/recorder";


class ProcessRecording extends BaseWebSocketListener {
    listenerKey: string;
    private _recorder: Recorder | null = null
    private _operator: RecorderOperator | null = null

    constructor(webSocketServer: RecorderOperator, webSocket: WebSocket, webSocketHooks: RecorderHooks) {
        super(webSocketServer, webSocket, webSocketHooks)

        this._operator = this.webSocketServer as RecorderOperator

        this.webSocketHooks.SubscribeHookListener(RecorderHooks.CREATE_RECORDER, this.OnCreateRecorder)
        this.webSocketHooks.SubscribeHookListener(RecorderHooks.REMOVE_RECORDER, this.OnRemoveRecorder)
    }

    private OnCreateRecorder = (recorder: Recorder) => {
        this._recorder = recorder
    }
    private OnRemoveRecorder = (Recorder: Recorder) => {
        this._recorder = null
    }

    protected SetKey(): void {
        this.listenerKey = Free3DKeys.PROCESS_RECORDING
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.CREATE_RECORDER, this.OnCreateRecorder)
        this.webSocketHooks.UnSubscribeListener(RecorderHooks.REMOVE_RECORDER, this.OnRemoveRecorder)
    }
    protected listener(body: RecordingState): void {
        if (this._recorder === null) {
            return
        }

        const state: string = body.State

        this._recorder.TakeState(state)

        this._operator?.UpdateRecorder()
    }

}

module.exports = ProcessRecording