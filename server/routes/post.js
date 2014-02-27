var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var inflect = require('inflect');
var yaml = require('js-yaml');
var git = require('gitty');

var repoPath = '/Users/matt/work/fanplayr/repos/fanplayr.github.io';

var repo = git(repoPath);

// exports.posts = function ( req, res ) {
//   res.json([
//     { name: 'Matt' },
//     { name: 'Decca' },
//   ]);
// };

module.exports = function ( app ) {
  app.locals.title = "Jekyl UI";

  app.get('/posts', function ( req, res ) {
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
      var view = {};
      if ( !err ) {
        view.posts = _.flatten(results);
      } else {
        view.posts = [];
      }
      res.render('posts', view);
    });
  });

  app.get('/api/posts', getPosts);
  app.get('/api/post/:file', getPost);
  app.put('/api/post/:file', updatePost);
};

function updatePost ( req, res ) {
  res.json({});
}


function getPost ( req, res ) {
  var file = path.basename(req.params.file);
  var abs = path.resolve(repoPath, file);
  fs.readFile(path.resolve(repoPath, '_posts', file), 'utf8', function ( err, content ) {
    if ( !err ) {
      var post = separateFrontMatter(content);
      res.json({
        post: post
      });
    } else {
      res.json({
        error: true,
        message: err
      });
    }
  });
}

function separateFrontMatter ( content ) {
  var front = {};
  content = content.replace(/^\s*---([\s\S]+)---[\n\s]*/, function ( line, match ) {
    front = yaml.safeLoad(match);
    return '';
  });
  return {
    front: front,
    content: content
  };
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
    res.json({
      posts: _.flatten(results)
    });
  });
}

function readPosts ( dir, doneCallback, postCallback ) {
  var postsDir = path.resolve(repoPath, dir);
  fs.exists(postsDir, function ( exists ) {
    if ( exists ) {
      fs.readdir(postsDir, function ( err, files ) {
        if ( !err ) {
          var posts = _.map(files, function ( file ) {
            var post = parsePostFilename(file, dir);
            if ( post && postCallback ) {
              postCallback(post);
            }
            return post;
          });
          posts = _.filter(posts, function ( post ) {
            return !!post;
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

function parsePostFilename ( file, dir ) {
  var match = file.match(/^(\d{4}-\d{2}-\d{2})-(.*?).(markdown|mk|html|txt)$/i);
  if ( match ) {
    var date = moment(match[1]);
    return {
      date: date,
      title: inflect.titleize(match[2]),
      file: file,
      dir: dir
    };
  } else {
    console.log('didnt match', file);
  }
  return null;
}
