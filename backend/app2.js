var http = require('http');
var fs = require('fs');

http.createServer(function(req, res){

    if(req.url ==='/'){
        fs.createReadStream(__dirname+'/index.htm').pipe(res);
    }

    if(req.url === '/api'){
        res.writeHead(200,{'Content-type': 'application/json'});
        var obj = {
            firstname: 'John',
            lastname: 'Doe'
        };
        res.end(JSON.stringify(obj));
    }
    res.writeHead(404);
    res.end();



}).listen(1337,'127.0.0.1');



