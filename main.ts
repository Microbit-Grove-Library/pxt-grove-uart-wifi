/** 
 * Grove - UART WiFi V2 (https://wiki.seeedstudio.com/Grove-UART_Wifi_V2/)
 */


/**
 * Functions to operate Grove module.
 */
//% weight=10 color=#9F79EE icon="\uf108" block="Grove - UART WiFi V2"
namespace groveuartwifi {
    // let serial = serial
    // let input = input

    let isWifiConnected = false

    /**
     * Setup Grove - Uart WiFi V2 to connect to  Wi-Fi
     */
    //% block="Setup Wifi|TX %txPin|RX %rxPin|Baud rate %baudrate|SSID = %ssid|Password = %passwd"
    //% txPin.defl=SerialPin.P15
    //% rxPin.defl=SerialPin.P1
    //% baudRate.defl=BaudRate.BaudRate115200
    export function setupWifi(txPin: SerialPin, rxPin: SerialPin, baudRate: BaudRate, ssid: string, passwd: string) {
        let result = 0

        isWifiConnected = false

        serial.redirect(
            txPin,
            rxPin,
            baudRate
        )

        sendAtCmd("AT")
        result = waitAtResponse("OK", "ERROR", "None", 1000)

        sendAtCmd("AT+CWMODE=1")
        result = waitAtResponse("OK", "ERROR", "None", 1000)

        sendAtCmd(`AT+CWJAP="${ssid}","${passwd}"`)
        result = waitAtResponse("WIFI GOT IP", "ERROR", "None", 20000)

        if (result == 1) {
            isWifiConnected = true
        }

    }

    /**
    * Check if Grove - Uart WiFi V2 is connected to Wifi
    */
    //% block="Wifi OK?"
    export function wifiOK() {
        return isWifiConnected
    }

    // export function setSerialBufferSize(size: number) {
    //     serial.setRxBufferSize(size)
    //     serial.setTxBufferSize(size)
    // }

    /**
    * Check if Grove - Uart WiFi V2 is connected to Wifi
    */
    //% block="Send Data to your ThinkSpeak Channel|URL of ThinkSpeak %url|Write API Key %apiKey|Field1 %field1|Field2 %field2|Field3 %field3|Field4 %field4|Field5 %field5|Field6 %field6|Field7 %field7|Field8 %field8"
    export function sendToThinkSpeak(url: string, apiKey: string, field1: number, field2: number, field3: number, field4: number, field5: number, field6: number, field7: number, field8: number) {
        let result = 0
        if (isWifiConnected) {
            // establish TCP connection
            sendAtCmd("AT+CIPSTART=\"TCP\",\"" + url + "\",80")
            result = waitAtResponse("OK", "ALREADY CONNECTED", "ERROR", 2000)
            if (result == 3) return false
            let data = "GET /update?api_key=" + apiKey

            if (!isNaN(field1)) data = data + "&field1=" + field1
            if (!isNaN(field2)) data = data + "&field2=" + field2
            if (!isNaN(field3)) data = data + "&field3=" + field3
            if (!isNaN(field4)) data = data + "&field4=" + field4
            if (!isNaN(field5)) data = data + "&field5=" + field5
            if (!isNaN(field6)) data = data + "&field6=" + field6
            if (!isNaN(field7)) data = data + "&field7=" + field7
            if (!isNaN(field8)) data = data + "&field8=" + field8

            sendAtCmd("AT+CIPSEND=" + (data.length + 2))
            sendAtCmd(data)
            result = waitAtResponse("SEND OK", "SEND FAIL", "ERROR", 5000)

            // // close the TCP connection
            // sendAtCmd("AT+CIPCLOSE")
            // waitAtResponse("OK", "ERROR", "None", 2000)

            if (result == 1) return true
            else return false
        }
        return false
    }


    function waitAtResponse(target1: string, target2: string, target3: string, timeout: number) {
        let buffer = ""
        let start = input.runningTime()

        // 1s timeout
        while ((input.runningTime() - start) < timeout) {
            buffer += serial.readString()

            if (buffer.includes(target1)) return 1
            if (buffer.includes(target2)) return 2
            if (buffer.includes(target3)) return 3

            basic.pause(100)
        }

        return 0

    }

    function sendAtCmd(cmd: string) {
        serial.writeString(cmd + "\u000D\u000A")
    }


}