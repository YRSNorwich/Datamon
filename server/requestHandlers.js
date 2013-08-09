var queryString = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    http = require("http"),
    events = require("events"),
    util = require('util'),
    url = require('url');

function start(response, postData) {
    fs.readFile("../index.html", function(err, data) {
        if (err) throw err;
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(data);
        response.end();
    });
}

var chunk;
var counties;

function getCountyData(res, req) {
    fs.readFile("./statstomaps/exported_data/counties.json", 'utf8', function(err, data) {
        if(err) {
            console.log(err);
            return;
        }
        counties = JSON.parse(data);

        res.writeHead(200, {'content-type': 'application/json'});

        res.end(data);
    });

}

function getChunk(res, req) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query; 
    query = JSON.stringify(query);
    chunk = JSON.parse(query);

    fs.readFile("./statstomaps/exported_data/chunks/chunk_" + chunk.coord1 + "_" + chunk.coord2 + ".json", 'utf8', function(err, data) {
        if(err) {
            console.log(err);
            return;
        }
        res.writeHead(200, {'content-type': 'application/json'});

        res.end(data);
    });
}

function upload(response, request) {
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
exports.getChunk = getChunk;
exports.getCountyData = getCountyData;
