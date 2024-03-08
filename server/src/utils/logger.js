const winston = require('winston');
const expressWinston = require('express-winston');

const logger = expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: false,
        colorize: false
      })
    ],
    meta: true,
    dynamicMeta: (req, res) => {
        const httpRequest = {};
        const meta = {};
    
        if (req) {
          meta.httpRequest = httpRequest;
          httpRequest.userAgent = req.get('User-Agent');
          httpRequest.protocol = `HTTP/${req.httpVersion}`;
          httpRequest.requestMethod = req.method;
          httpRequest.body = req.body;
          httpRequest.requestSize = req.socket.bytesRead;
        }
    
        if (res) {
          meta.httpRequest = httpRequest;
          httpRequest.status = res.statusCode;
        }
        return meta;
      },
    msg: "HTTP {{req.method}} {{req.url}} {{req.method}} {{res.responseTime}}ms",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; }
});

module.exports = logger;
