
import { WebSocket } from 'ws';
import { OperatorHooks } from '../hooks/operatorHooks';
import { RecorderOperator } from '../..';
import { ReceivedEvent } from '../../athaeck-websocket-express-base/base/helper';
import { Recorder } from './recorder';
import { RecorderProxy } from '../types/proxy';
import { Free3DKeys } from '../types/keys';
import { GetRecorderProxy } from '../helper/proxy';
import { RecorderHooks } from '../hooks/recorderHooks';
import { Calibrator } from './calibrator';
import { OperatorComponent } from './operatorComponent';

export class Supervisor extends OperatorComponent {
    constructor(webSocket: WebSocket, hooks: RecorderHooks) {
        super(webSocket, hooks)
    }

    public TakeOperator(operator: RecorderOperator): void {
        this.hooks.DispatchHook(RecorderHooks.CREATE_SUPERVISOR, this)
        operator.Hooks.SubscribeHookListener(OperatorHooks.UPDATE_RECORDER, this.OnUpdateRecorder)
        operator.Hooks.SubscribeHookListener(OperatorHooks.FINISH_RECORD, this.OnFinishRecord)
        operator.Hooks.SubscribeHookListener(OperatorHooks.CONNECT_CALIBRATOR, this.OnConnectCalibrator)
        operator.Hooks.SubscribeHookListener(OperatorHooks.DISCONNECT_CALIBRATOR, this.OnDisconnectCalibrator)
        operator.Hooks.SubscribeHookListener(OperatorHooks.UPDATE_CALIBRATOR, this.OnUpdateCalibrator)
    }
    public RemoveOperator(operator: RecorderOperator): void {
        this.hooks.DispatchHook(RecorderHooks.REMOVE_SUPERVISOR, this)
        operator.Hooks.UnSubscribeListener(OperatorHooks.UPDATE_RECORDER, this.OnUpdateRecorder)
        operator.Hooks.UnSubscribeListener(OperatorHooks.FINISH_RECORD, this.OnFinishRecord)
        operator.Hooks.UnSubscribeListener(OperatorHooks.CONNECT_CALIBRATOR, this.OnConnectCalibrator)
        operator.Hooks.UnSubscribeListener(OperatorHooks.DISCONNECT_CALIBRATOR, this.OnDisconnectCalibrator)
        operator.Hooks.UnSubscribeListener(OperatorHooks.UPDATE_CALIBRATOR, this.OnUpdateCalibrator)
    }

    private OnUpdateRecorder = (recorder: Recorder[]) => {
        const takeRecorder: ReceivedEvent = new ReceivedEvent(OperatorHooks.UPDATE_RECORDER)
        takeRecorder.addData("Proxy", GetRecorderProxy(recorder))
        this.webSocket.send(takeRecorder.JSONString)
    }

    private OnUpdateCalibrator = (calibrator: Calibrator) => {
        const updateCalibrator: ReceivedEvent = new ReceivedEvent(OperatorHooks.UPDATE_CALIBRATOR)
        updateCalibrator.addData("Proxy", calibrator.CalibratorData)
        this.webSocket.send(updateCalibrator.JSONString)
    }

    private OnFinishRecord = () => {
        const onFinish: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_FINISH_RECORD)
        this.webSocket.send(onFinish.JSONString)
    }

    private OnConnectCalibrator = (calibrator: Calibrator) => {
        const connectCalibrator: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_CONNECT_CALIBRATOR)
        connectCalibrator.addData("Proxy", calibrator.CalibratorData)
        this.webSocket.send(connectCalibrator.JSONString)
    }
    private OnDisconnectCalibrator = (Calibrator: Calibrator) => {
        const disconnectCalibrator: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_DISCONNECT_CALIBRATOR)
        this.webSocket.send(disconnectCalibrator.JSONString)
    }
}