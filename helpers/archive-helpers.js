var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) { 
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function (err, data) {
    if (err) { 
      throw err;
    }

    return callback(data.split("\n"));
  });
};

exports.isUrlInList = function(siteName, callback) {
  this.readListOfUrls(function(arr) {
    return callback(arr.indexOf(siteName) > -1);
  })
};

exports.addUrlToList = function(siteName, callback) {
  fs.appendFile(exports.paths.list, siteName + "\n", callback)
};

exports.isUrlArchived = function(siteName, callbackFalse, callbackTrue) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (siteName === '/' || files.indexOf(siteName.slice(1)) > -1) {
      callbackTrue();
    } else {
      callbackFalse();
    } 
  });
};

exports.downloadUrls = function(urlsArray) {
  var siteName = '';

  var getSite = function(siteName) {
    var writeSite = function(response) {
      var str = '';

      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        fs.appendFile(exports.paths.archivedSites + "/" + siteName, str)
      });
    } 

    http.request({host: siteName}, writeSite).end();
  }

  for (var i = 0; i < urlsArray.length; i++) {
    getSite(urlsArray[i]); 
  };
};
