groveuartwifi.setupWifi(
    SerialPin.P1,
    SerialPin.P15,
    BaudRate.BaudRate115200,
    "test-ssid",
    "test-passwd"
)

basic.forever(() => {
    if (groveuartwifi.wifiOK()) {
        basic.showNumber(1);
    }
    else {
        basic.showNumber(0);
    }
    basic.pause(1000);
})