import { WebSocket } from "ws";
import { RecorderHooks } from "../hooks/recorderHooks";
import { RecorderOperator } from './../../index';
import { OperatorHooks } from "../hooks/operatorHooks";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { Free3DKeys } from "../types/keys";
import { PrepareRecordProxy, RecordProxy, RecorderProxy } from "../types/proxy";


export class Recorder {
    private _socket: WebSocket
    private _hooks: RecorderHooks

    private _state: string
    private _type: string;
    private _id: string

    constructor(socket: WebSocket, hooks: RecorderHooks, type: string, id: string) {
        this._socket = socket
        this._hooks = hooks
        this._type = type
        this._id = id
        this._state = "Idle"
    }

    public get Socket(): WebSocket {
        return this._socket
    }
    public get Hooks(): RecorderHooks {
        return this._hooks
    }

    public TakeOperator(operator: RecorderOperator): void {
        if (this._type === "Sub") {
            operator.Hooks.SubscribeHookListener(OperatorHooks.PREPARE_RECORDING, this.OnPrepareRecording.bind(this))
        }

        operator.Hooks.SubscribeHookListener(OperatorHooks.RECORD, this.OnRecord.bind(this))
    }

    private OnPrepareRecording(proxy: PrepareRecordProxy): void {
        const prepareRecording: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_PREPARE_RECORD)
        prepareRecording.addData("Proxy", proxy)

        this._socket.send(prepareRecording.JSONString)
    }

    private OnRecord(proxy: RecordProxy): void {
        const record: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_TRIGGER_RECORD)
        record.addData("Proxy", proxy)

        this._socket.send(record.JSONString)
    }

    public RemoveOperator(operator: RecorderOperator): void {
        // console
        if (this._type === "Sub") {
            operator.Hooks.UnSubscribeListener(OperatorHooks.PREPARE_RECORDING, this.OnPrepareRecording.bind(this))
        }

        operator.Hooks.UnSubscribeListener(OperatorHooks.RECORD, this.OnRecord.bind(this))
    }

    public TakeState(state: string): void {
        this._state = state
    }

    public get State(): string {
        return this._state
    }
    public get Type(): string {
        return this._type
    }
    public get RecorderData(): RecorderProxy {
        return {
            Type: this._type,
            State: this._state,
            ID: this._id
        }
    }
}
