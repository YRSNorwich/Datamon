var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/postLonLat"] = requestHandlers.postLonLat;
handle["/getChunk"] = requestHandlers.getChunk;
handle["/getCountyData"] = requestHandlers.getCountyData;

server.start(router.route, handle);
