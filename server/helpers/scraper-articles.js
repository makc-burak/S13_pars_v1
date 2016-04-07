{
    var request = require('request');
    var cheerio = require('cheerio');
    var article = require('../models/article-model');
    var url = "http://www.s13.ru";
} //Модули

function getFullArticles(link, title, summary, id) {

    request.get(link, function (error, response, page) {

        if (response.statusCode == 200 && !error) {

                var $ = cheerio.load(page);

                var description = $('.item').children('.itemtext').children('p');

                var new_article = new article({
                    id: id,
                    title: title,
                    summary: summary,
                    description: description,
                    link: link
                });

                new_article.save(function (error, entry) {
                    if (error) console.log(error);
                    console.log(entry.id + ' добавлено');
                });
        }
    });
}

var update = function () {
    request.get(url, function (error, response, page) {

        if (response != null && response.statusCode == 200 && !error) {
            var $ = cheerio.load(page);

            items = $('div[id*="post"]');

            $(items).each(function (index, item) {

                var id = $(this).attr('id');

                article.findOne({id: id}, function (error, flage) {

                    if (error) return console.error(error);

                    if (flage == null) {
                        var title = $(item).children('.itemhead').children('h3').text();
                        var link = $(item).children('.itemhead').children('h3').children('a[rel="bookmark"]').attr('href');
                        var summary = $(item).children('.itemtext').children('p').text();

                        getFullArticles(link, title, summary, id);

                    }
                });
            });

        }
        else {
            console.log('Нет доступа к сайту');
        }
    });
}

module.exports.update = update;