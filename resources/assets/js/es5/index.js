console.log('hello world');
console.log('123');
var wsocket = new WebSocket('ws://localhost:3031');
wsocket.onmessage = function (e) {
    console.log(e);
}
wsocket.onclose = function (e) {

}
wsocket.onerror = function (e) {

}
wsocket.onopen = function (e) {

}