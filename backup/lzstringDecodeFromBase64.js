#! /usr/bin/env node
var lzString = require('lz-string');
var fs = require('fs');

var stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
var res = lzString.decompressFromBase64(stdinBuffer.toString());

if (res == null) {
  console.error("NULL data"); 
} 

console.log(res)
