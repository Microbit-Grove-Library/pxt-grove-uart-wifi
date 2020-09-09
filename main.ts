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
    //% txPin.defl=SerialPin.P1
    //% rxPin.defl=SerialPin.P15
    //% baudRate.defl=BaudRate.BaudRate115200
    export function setupWifi(txPin: SerialPin, rxPin: SerialPin, baudRate: BaudRate, ssid: string, passwd: string) {
        let result = 0

        isWifiConnected = false

        serial.redirect(
            txPin,
            rxPin,
            baudRate
        )

        serial.writeLine("AT")
        result = waitAtResponse("OK", "ERROR")

        serial.writeLine("AT+CWMODE=1")
        result = waitAtResponse("OK", "ERROR")

        serial.writeLine(`AT+CWJAP="${ssid}","${passwd}"`)
        result = waitAtResponse("CONNECTED", "ERROR")

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

    function waitAtResponse(target1: string, target2: string) {
        let buffer = ""
        let start = input.runningTime()

        // 1s timeout
        while ((input.runningTime() - start) < 1000) {
            buffer += serial.readString()

            if (buffer.includes(target1)) return 1
            if (buffer.includes(target2)) return 2

            basic.pause(100)
        }

        return 0

    }



}