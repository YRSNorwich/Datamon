var queryString = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    http = require("http"),
    events = require("events"),
    util = require('util');

function start(response, postData) {
  console.log("Request handler 'start' was called.");

  fs.readFile("../index.html", function(err, data) {
      if (err) throw err;
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(data);
      response.end();
  });
}

function getChunk(res, req) {
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();

  form.parse(request, function(error, fields, files) {

    /* Possible error on Windows systems:
       tried to rename to an already existing file */
    fs.rename(files.upload.path, "/tmp/test.png", function(err) {
      if (err) {
        fs.unlink("/tmp/test.png");
        fs.rename(files.upload.path, "/tmp/test.png");
      }
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.end();
  });
}

function lonLat(res, req) {
    console.log("Req handler 'lonLat' called");
    var form = new formidable.IncomingForm();

    form.parse(req, function(error, fields, files) {
	if (error) {
	    // Check for and handle any errors here.
			      
 	    console.error(err.message);
	    return;
	}
	res.writeHead(200, {'content-type': 'multipart/form-data'});

	//return the longitude and latitude	
	res.end(util.inspect(fields));
    });

    return;
}

function postLonLat(res) {
    fs.writeFile('message.txt', res, function (err) {
	  if (err) throw err;
	    console.log('It\'s saved!');
    });
}

exports.start = start;
exports.upload = upload;
exports.postLonLat = postLonLat;
