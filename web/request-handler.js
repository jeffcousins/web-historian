var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js'); 
var fs = require('fs');


exports.handleRequest = function(request, response) {
  var statusCode = 200;
  var headers = httpHelpers.headers;

  var onFileReadDone = function (err, data) {
    if (err) { 
      throw err;
    }
    httpHelpers.serveAssets(response, data);
  }

  if (request.method == 'POST') {
    var body = '';

    request.on('data', function(data) {
      body += data;
    }); 
     
    request.on('end', function() {
      var message = JSON.parse(body);
      message['createdAt'] = new Date().toISOString();

      messages.push(message);

      statusCode = 201;
      response.writeHead(statusCode, headers);
      response.end();
    }); 

  } else { //  GET

    // if (request.url !== "/classes/messages" && request.url !== "/log") {
    //   statusCode = 404;
    //   response.writeHead(statusCode, headers); 
    //   response.end();
    // } else {

      var path = archive.paths.siteAssets + "/index.html";

      if (request.url !== '/') {
        path = archive.paths.archivedSites + request.url;
      }

      console.log(path);

      response.writeHead(statusCode, headers); 


      fs.readFile(path, onFileReadDone); 



      //response.end(archive.paths.list);  /// for responding to list requests
    //}

  }
};


