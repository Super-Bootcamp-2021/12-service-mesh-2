const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');


function workerStore(req, res) {
	// Menyimpan data worker dari http request ke database redis
  
}

function workersRead(req, res) {
  // Mengambil data dari database redis dengan key:workers
	
}

module.exports = {
  workerStore, 
	workersRead,
};