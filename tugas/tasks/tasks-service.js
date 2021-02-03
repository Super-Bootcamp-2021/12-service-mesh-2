const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');

function taskStore(req, res) {
  // Menyimpan task dari http request ke database redis
	
}

function tasksRead() {
	// Mengambil data dari database redis dengan key:tasks
  
}

module.exports = {
  taskStore, 
	tasksRead,
};