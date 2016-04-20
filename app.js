var http = require('http');
var serverConfig = require('./server/config/server-config');
var scraper = require('./server/helpers/scraper-articles');
var url = require('url');
var article = require('./server/models/article-model');

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;

    if (pathname == '/') {

        article.find({}, function(err, articles) {
            if (err) {
                throw err;
            }
var page = articles.reduce(function (response, item) {

                    var star = item.title;

                    stars = star.split(" ");

                    for(i = 0; i < stars.length; i++){
                        if(stars[i].indexOf("Гродн") == -1){

                        }
                        else{

                            var str1 = "";

                            for(j = 0; j < stars[i].length; j++){
                                str1 += "*";
                            }
                            stars[i] = str1;

                        }
                    }

                    var st="";

                    for(i = 0; i < stars.length; i++){
                        st += stars[i] + " ";
                    }

                    return response + '<h3>' + '<a href='+ item.id +'>' + st + '</a>' + '</h3>' + '<p>' + item.summary + '</p>';
                }, '');
           

            response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
            response.end(page);
        });
    }
    else {

        article.findOne({id: pathname.replace('/', '')}, function (error, item) {

            if(item != null) {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                response.end(item.description);
            }
            else {
                response.writeHead(404, {'Content-Type': 'text/html; charset=utf8'});
                response.end('Not found');
            }
        })

    }
});

setInterval(function() {
    scraper.update();
    console.log('Ищем новые статьи');
}, 10000);

server.listen({port: serverConfig.port});

console.log('Server runing on port ' + serverConfig.port);