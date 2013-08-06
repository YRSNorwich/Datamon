var fs = require("fs"),
    path = require("path");

function route(handle, pathname, response, request) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
	handle[pathname](response, request);
    } else {
	var filename = path.join(process.cwd(), "../", pathname);
	path.exists(filename, function(exists) {
	    if(!exists) {
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not fount");
		response.end();
		return;
	    }

	    fs.readFile(filename, "binary",  function(err, data) {
		if(err) {
		    response.writeHead(500, {"Content-Type": "text/plain"});
		    response.write(err + "\n");
		    response.end();
		    return;
		}
		
		switch(getFileExt(filename)) {
		    case "js":
			response.writeHead(200, {"Content-Type": "text/javascript"});
			break;
		    case "css":
			response.writeHead(200, {"Content-Type": "text/css"});
			break;
		    case "php":
			  response.writeHead(200, {"Content-Type": "application/php"});
			  break;
		    default:
			response.writeHead(200);
		}

		response.write(data, "binary");
		response.end();
	    });
	});
    }
}

function getFileExt(filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}


exports.route = route;
