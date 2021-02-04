const http = require("http");

const PORT = 7000;

function saveWorkers(key, value) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:${PORT}/set?key=${key}&value=${value}`, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk.toString();
      });
      res.on("end", () => {        
        resolve(data);
      });
      res.on("error", (err) => {
        reject(err);
      });
    });
    req.end();
  });
}

function getWorkers(key) {
    return new Promise((resolve, reject) => {
      const req = http.request(`http://localhost:${PORT}/get?key=${key}`, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk.toString();
        });
        res.on("end", () => {        
          resolve(data);
        });
        res.on("error", (err) => {
          reject(err);
        });
      });
      req.end();
    });
}

function delWorkers(key) {
    return new Promise((resolve, reject) => {
      const req = http.request(`http://localhost:${PORT}/del?key=${key}`, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk.toString();
        });
        res.on("end", () => {        
          resolve(data);
        });
        res.on("error", (err) => {
          reject(err);
        });
      });
      req.end();
    });
}

module.exports = {
    saveWorkers,
    getWorkers,
    delWorkers
}