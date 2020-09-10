groveuartwifi.setupWifi(
    SerialPin.P15,
    SerialPin.P1,
    BaudRate.BaudRate115200,
    "test-ssid",
    "test-passwd"
)

basic.forever(() => {
    if (groveuartwifi.wifiOK()) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }
    groveuartwifi.sendToThinkSpeak("write_api_key", 1, 2, 3, 4, 5, 6, 7, 8)
    groveuartwifi.sendToIFTTT("ifttt_event", "ifttt_key", "hello", 'micro', 'bit')
    basic.pause(60000)
})