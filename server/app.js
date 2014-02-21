'use strict'

var fs = require('fs');
var path = require('path');
var express = require('express');
var _ = require('underscore');
var moment = require('moment');
var inflect = require('inflect');
var async = require('async');

module.exports = function ( httpServerOptions ) {
  var app = express();

  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/../client/public'));
  app.use('/build', express.static(__dirname + '/../client/build'));

  app.get('/', getHome);

  app.get('/api/post/:file', getPost);
  app.get('/api/posts', getPosts);

  app.listen(3000);
  console.log('Listening on port 3000');
};

var repoPath = '/Users/matt/work/fanplayr/repos/fanplayr.github.io';

function getPost ( req, res ) {
  if ( req.params.file ) {
    var file = path.basename(req.params.file);
    var abs = path.resolve(repoPath, file);
    fs.readFile(path.resolve(repoPath, '_posts', file), 'utf8', function ( err, content ) {
      if ( !err ) {
        res.json({
          content: content
        });
      } else {
        res.json({
          error: true,
          message: err
        });
      }
    });
  } else {
    res.status(401);
  }
}

function getPosts ( req, res ) {
  async.parallel([
    function ( done ) {
      readPosts('_posts', done, function ( post ) {
        post.isPublished = true;
      });
    },
    function ( done ) {
      readPosts('_drafts', done, function ( post ) {
        post.isPublished = false;
      });
    }
  ], function ( err, results ) {
    if ( !err ) {
      res.json({
        posts: _.flatten(results)
      });
    } else {
      res.json({
        error: true,
        message: err
      });
    }
  });
}

function readPosts ( dir, doneCallback, postCallback ) {
  var postsDir = path.resolve(repoPath, dir);
  fs.exists(postsDir, function ( exists ) {
    if ( exists ) {
      fs.readdir(postsDir, function ( err, files ) {
        if ( !err ) {
          var posts = _.map(files, function ( file ) {
            var post = parsePostFilename(file);
            if ( post && postCallback ) {
              postCallback(post);
            }
            return post;
          });
          doneCallback(null, posts);
        } else {
          doneCallback(err);
        }
      });
    } else {
      doneCallback(null, []);
    }
  });
}

function parsePostFilename ( file ) {
  var match = file.match(/^(\d{4}-\d{2}-\d{2})-(.*?).(markdown|mk|html|txt)$/i);
  if ( match ) {
    var date = moment(match[1]);
    return {
      date: date,
      title: inflect.titleize(match[2]),
      file: file
    };
  }
  return null;
}
//
//function dashesToTitle ( text ) {
//  return text.replace(/([^\-])/g, function ( line, word ) {
//    return word.substr(0, 1).toUpperCase() + word.substr
//  }).replace(/-/g, ' ');
//}

function httpAuth ( username, password ) {
  if ( username && password ) {
    return express.basicAuth(function ( user, pass ) {
      return (username === user && password === pass);
    });
  } else {
    return function ( req, res, next ) {
      next();
    }
  }
}

function getHome ( req, res ) {
  res.render('home.ejs', {
    title: 'Home'
  });
}
