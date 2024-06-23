# RecorderOperator
This project contains a WebSocket server for the network communication of an operator UI, the recording receivers and the calibrator.

## Project Overview

### System Requirements
| Component   | Version   |
|-------------|-----------|
| Node      | v18.18.0      |
| npx      | ^9.8.1     |

### Tested on
- Windows 10
- Nvidia RTX 2080 Super

## How to start the Repo
1. install and start the WebSocket-Server in chapter [Installation WebSocket-Server](WSS)
2. install and start operator client in chapter [Installation of Operator UI](operator)
3. install and start recorder in chapter [Installation of Recorder](recorder)

## [Installation WebSocket-Server](WSS)
1. navigate to the folder of the server ```.\Socket``` via the console ```cd .\Socket\```
2. install project via ```npm install```
3. create a ```local.json``` in the folder ```.\Socket\config```
4. add to the ```local.json``` the following JSON object:
```bash
{
    "express": {
        "networkAdapter": "", #The network adapter must be specified here, e.g. WLAN, so that the WebSocket server can be reached via the IP address of your device, which the network has assigned to your device.
        "useNetwork": #write true, if the server can be arrived via the network. false, if it's on your local device
    }
}
```
5. run the project with ```npm run dev```
6. if the project compiled once, you can use the promt ```npm start```

## [Installation of Operator UI](operator)
1. navigate to the folder of the UI (```.\Client\OperatorClient```) : ```cd .\Client\OperatorClient\```
2. edit ```.env``` with the following line:
```typescript
VITE_WEBSOCKET_ADDRESS="ws://<ip-address, where the WebSocket-Server is available>:8080"
```
3. install the project via: ```npm install```
4. install the project via: ```npm run dev```
5. open the website on ```http://localhost:5173/```


## [Installation of Recorder](recorder)
1. navigate to the folder of the recorder ```.\Receiver``` via ``` cd .\Receiver\```
2. install the project via ```npm install```
3. create a ```local.json``` in the folder ```.\Receiver\config```
4. add to the ```local.json``` the following JSON object:
```bash
{
    "socket": {
        "host": "", #add the ip-address of the WebSocket-Server, if its running locally type localhost
    },
    "azureKinect": {
        "type": "", #type of recorder [e.g. if it's the master, type Master, if it's a Sub, type Sub]
        "id": "", #id of the recorder [e.g. the  first Sub is 1, the second Sub is 2, Master has id 0]
        "sdkPath": "", #path, where the k4arecorder.exe is installed [e.g. C:/Program Files/Azure Kinect SDK v1.4.1/tools/k4arecorder.exe]
        "folderPath": "", #folder, where the video should be saved [e.g. C:/Users/nicka/OneDrive/Desktop/Test]
        "baseCommand": "{{sdkPath}} <insert here the command of Sub or Master recording (the commands are stored in Notion) (e.g. --device 0 --external-sync master --imu OFF -c 1080p -d NFOV_2X2BINNED -r 30 -l 10)> </insert> {{folderPath}}/{{fileName}}.mkv" #copy it, but add the command inside the <> brackets 
    },
    "timer": {
        "time": "", #change timer in sekunds, to set its delay [e.g. 15]
    }
}
```
5. run the project via ```npm run start```
