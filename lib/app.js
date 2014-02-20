'use strict'

var fs = require('fs');
var path = require('path');
var express = require('express');

module.exports = function ( httpServerOptions ) {
  var app = express();

  app.set('view engine', 'ejs');
  app.use(httpAuth('matt', 'asdf'));

  app.get('/', getHome);

  app.listen(3000);
};

function httpAuth ( username, password ) {
  if ( username && password ) {
    return express.basicAuth(function ( user, pass ) {
      return (username === user && password === pass);
    });
  } else {
    return function ( req, res, next ) {
      next()
    }
  }
}

function getHome ( req, res ) {
  res.render('home.ejs', {
    title: 'Home'
  });
}