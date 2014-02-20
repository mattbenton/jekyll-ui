#!/usr/bin/env node

var optimist = require('optimist');
var app = require('../lib/app');

var args = optimist
  .alias('h', 'help')
  .alias('h', '?')
  .options('redis-port', {
    string: true,
    describe: 'The port to find redis on.'
  })
  .options('redis-host', {
    string: true,
    describe: 'The host to find redis on.'
  })
  .options('redis-socket', {
    string: true,
    describe: 'The unix-socket to find redis on.'
  })
  .options('redis-password', {
    string: true,
    describe: 'The redis password.'
  })
  .options('redis-db', {
    string: true,
    describe: 'The redis database.'
  })
  .options('http-auth-username', {
    alias: "http-u",
    string: true,
    describe: 'The http authorisation username.'
  })
  .options('http-auth-password', {
    alias: "http-p",
    string: true,
    describe: 'The http authorisation password.'
  })
  .options('port', {
    alias: 'p',
    string: true,
    describe: 'The port to run the server on.',
    default: 8081
  })
  .argv;

if ( args.help ) {
  optimist.showHelp();
  return process.exit(-1);
}

app();
