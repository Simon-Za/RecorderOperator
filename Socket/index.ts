import { WebSocket } from "ws";
import { AddRoute, BaseExpressRoute } from "./athaeck-websocket-express-base/athaeck-express-base/base/express";
import { BaseWebSocketExpressAdoon } from "./athaeck-websocket-express-base/base";
import { WebSocketHooks } from "./athaeck-websocket-express-base/base/hooks";
import { Free3DSocketListenerFactory } from './src/index';
import bodyParser from "body-parser";

import { Recorder } from './src/data/recorder';
import { RecorderHooks } from "./src/hooks/recorderHooks";
import { OperatorHooks } from "./src/hooks/operatorHooks";
import { Supervisor } from "./src/data/supervisor";
import { Calibrator } from "./src/data/calibrator";

export class RecorderOperator extends BaseWebSocketExpressAdoon {
    private _recorder: Recorder[] = []
    private _supervisor: Supervisor | null = null
    private _calibrator: Calibrator | null = null
    private _operatorHooks: OperatorHooks;

    constructor(port: number) {
        super(port)

        this._operatorHooks = new OperatorHooks()
        this.factory = new Free3DSocketListenerFactory("./listener/")
        this.initializeMiddleware()
    }

    public get Hooks(): OperatorHooks {
        return this._operatorHooks
    }
    public get Recorder(): Recorder[] {
        return this._recorder
    }
    public get Calibrator(): Calibrator | null {
        return this._calibrator
    }
    public get Supervisor(): Supervisor | null {
        return this._supervisor
    }

    protected ValidateConnection(webSocket: WebSocket): boolean {
        return true
    }
    protected CreateHooks(): WebSocketHooks {
        return new RecorderHooks()
    }
    Init(webSocket: WebSocket, hooks: WebSocketHooks): void {

    }
    Disconnect(webSocket: WebSocket): WebSocketHooks | undefined {
        const recorder: Recorder | undefined = this._recorder.find(r => r.Socket === webSocket);

        if (recorder) {
            recorder.RemoveOperator(this)

            this._recorder = this._recorder.filter(r => r !== recorder)

            this.UpdateRecorder();
        }

        let hooks: WebSocketHooks | undefined = recorder?.Hooks;

        if (this._supervisor) {
            if (webSocket === this._supervisor.WebSocket) {
                hooks = this._supervisor.Hooks
                this._supervisor.RemoveOperator(this)
                this._supervisor = null;
            }
        }

        if (this._calibrator) {
            if (webSocket === this._calibrator.WebSocket) {
                hooks = this._calibrator.Hooks
                this._calibrator.RemoveOperator(this)
                this._operatorHooks.DispatchHook(OperatorHooks.DISCONNECT_CALIBRATOR, this._calibrator)
                this._calibrator = null;
            }
        }

        return hooks
    }
    AddRoute(route: BaseExpressRoute): void {
        this.app = AddRoute(this.app, route);
    }
    initializeMiddleware(): void {
        this.app.use(bodyParser.json());
    }

    public CreateRecorder(type: string, id: string, webSocket: WebSocket, hooks: RecorderHooks) {
        const recorder: Recorder = new Recorder(webSocket, hooks, type, id);
        recorder.TakeOperator(this)

        this._recorder.push(recorder)

        this.UpdateRecorder();
    }
    public CreateCalibrator(webSocket: WebSocket, hooks: RecorderHooks): void {
        this._calibrator = new Calibrator(webSocket, hooks)
        this._calibrator.TakeOperator(this)

        this._operatorHooks.DispatchHook(OperatorHooks.CONNECT_CALIBRATOR, this._calibrator)
    }

    public CreateSupervisor(webSocket: WebSocket, hooks: RecorderHooks): void {
        const supervisor: Supervisor = new Supervisor(webSocket, hooks)
        supervisor.TakeOperator(this)

        this._supervisor = supervisor
    }

    public UpdateRecorder(): void {
        this._operatorHooks.DispatchHook(OperatorHooks.UPDATE_RECORDER, this._recorder)
    }

}

export const recorderOperator: RecorderOperator = new RecorderOperator(8080)
recorderOperator.Start()