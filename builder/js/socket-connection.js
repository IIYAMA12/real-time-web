var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host.split(":")[0];
const socket = io.connect(baseUrl + ":4444"); // "http://localhost:4444"
console.log(baseUrl);