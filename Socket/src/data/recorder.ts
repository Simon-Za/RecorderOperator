import { WebSocket } from "ws";
import { RecorderHooks } from "../hooks/recorderHooks";
import { RecorderOperator } from './../../index';
import { OperatorHooks } from "../hooks/operatorHooks";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { Free3DKeys } from "../types/keys";
import { PrepareRecordProxy, RecordProxy, RecorderProxy } from "../types/proxy";
import { OperatorComponent } from "./operatorComponent";


export class Recorder extends OperatorComponent {
    private _state: string
    private _type: string;
    private _id: string

    constructor(socket: WebSocket, hooks: RecorderHooks, type: string, id: string) {
        super(socket, hooks)
        this._type = type
        this._id = id
        this._state = "Idle"
    }

    public TakeOperator(operator: RecorderOperator): void {
        this.hooks.DispatchHook(RecorderHooks.CREATE_RECORDER, this)
        if (this._type === "Sub") {
            operator.Hooks.SubscribeHookListener(OperatorHooks.PREPARE_RECORDING, this.OnPrepareRecording)
        }

        operator.Hooks.SubscribeHookListener(OperatorHooks.RECORD, this.OnRecord)
    }

    private OnPrepareRecording = (proxy: PrepareRecordProxy) => {
        const prepareRecording: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_PREPARE_RECORD)
        prepareRecording.addData("Proxy", proxy)

        this.webSocket.send(prepareRecording.JSONString)
    }

    private OnRecord = (proxy: RecordProxy) => {
        const record: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_TRIGGER_RECORD)
        record.addData("Proxy", proxy)

        this.webSocket.send(record.JSONString)
    }

    public RemoveOperator(operator: RecorderOperator): void {
        this.hooks.DispatchHook(RecorderHooks.REMOVE_RECORDER, this)
        if (this._type === "Sub") {
            operator.Hooks.UnSubscribeListener(OperatorHooks.PREPARE_RECORDING, this.OnPrepareRecording)
        }

        operator.Hooks.UnSubscribeListener(OperatorHooks.RECORD, this.OnRecord)
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
