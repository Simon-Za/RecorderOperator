import WebSocket from 'ws';
import { exec } from 'child_process';
import config from "config"

export class ReceivedEvent {
    public eventName: string;
    public data: { [key: string]: any };

    constructor(name: string) {
        this.eventName = name;
        this.data = {};
    }

    public get JSONString(): string {
        return JSON.stringify(this)
    }

    public addData(key: string, value: any) {
        this.data[key] = value;
    }

}

const socket: any = config.get("socket")
const azureKinect: any = config.get("azureKinect")
const url: string = `ws://${socket.host}:${socket.port}`

console.log(url)

const ws = new WebSocket(url);

ws.on('open', () => {
    console.log('Connected to the WebSocket server');

    const connect: ReceivedEvent = new ReceivedEvent("INIT_RECORDER")
    connect.addData("Type", azureKinect.type)
    connect.addData("ID", azureKinect.id)

    ws.send(connect.JSONString)
});

ws.on('message', (body) => {
    console.log(`Received message: ${body}`);
    const jsonBody = JSON.parse(body.toString());
    const event = jsonBody.hasOwnProperty("eventName") ? jsonBody["eventName"] : ""
    const data = jsonBody.hasOwnProperty("data") ? jsonBody["data"] : ""
    // if (event !== "SET_FACTOR" && event !== "MOVE_CLIENT") {
    console.log(event)
    // }
    ws.emit(event, data)
    // executeCommand(data.toString());
});



function executeCommand(command: string) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }
        console.log(`Command output: ${stdout}`);
    });
}

