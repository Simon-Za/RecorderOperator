import { RecorderOperator } from "../.."
import { RecorderHooks } from "../hooks/recorderHooks"
import { WebSocket } from "ws"

export abstract class OperatorComponent {
    protected webSocket: WebSocket
    protected hooks: RecorderHooks

    constructor(webSocket: WebSocket, hooks: RecorderHooks) {
        this.webSocket = webSocket
        this.hooks = hooks
    }

    public abstract TakeOperator(operator: RecorderOperator): void;
    public abstract RemoveOperator(operator: RecorderOperator): void;

    public get WebSocket(): WebSocket {
        return this.webSocket
    }
    public get Hooks(): RecorderHooks {
        return this.hooks
    }
}