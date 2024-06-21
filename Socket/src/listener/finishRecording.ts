import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { RecorderOperator } from "../..";
import { Free3DKeys } from "../types/keys";
import { RecorderHooks } from "../hooks/recorderHooks";
import { OperatorHooks } from "../hooks/operatorHooks";


class FinishRecording extends BaseWebSocketListener {
    listenerKey: string;
    private _operator: RecorderOperator | null = null

    constructor(webSocketServer: RecorderOperator, webSocket: WebSocket, webSocketHooks: RecorderHooks) {
        super(webSocketServer, webSocket, webSocketHooks)

        this._operator = this.webSocketServer as RecorderOperator
    }

    protected SetKey(): void {
        this.listenerKey = Free3DKeys.FINISH_RECORD
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {

    }
    protected listener(body: any): void {

        this._operator?.Hooks.DispatchHook(OperatorHooks.FINISH, null)
    }
}

module.exports = FinishRecording