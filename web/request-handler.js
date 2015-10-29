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

  var noFile = function (isFile) {
    statusCode = 404;
    response.writeHead(statusCode, headers);  
    response.end();  
  }
 
  var serveFile = function() { 
    var path = archive.paths.siteAssets + "/index.html"; 

    if (request.url !== '/') { 
      path = archive.paths.archivedSites + request.url;
    }

    response.writeHead(statusCode, headers); 
    fs.readFile(path, onFileReadDone);
  }

  var postComplete = function() {
    statusCode = 302;
    response.writeHead(statusCode, headers); 
    response.end();
  }

  if (request.method == 'POST') {    
    var body = ''; 

    request.on('data', function(data) {
      body += data; 
    }); 
     
    request.on('end', function() {
      archive.addUrlToList(JSON.parse(body).url, postComplete);
    }); 

  } else { //  GET
    archive.isUrlArchived(request.url, noFile, serveFile);
  }
};


