var cheerio = require('cheerio');
var request = require('request');

ufn_arms = function(msg, arms_name, Discord) {
    request("https://p1togaming.tistory.com/category/%EB%AC%B4%20%EA%B8%B0?page=1", function(error, response, html){
        if (error) {throw error};
        var url = new Array();
        var $ = cheerio.load(html);
        
        if (arms_name == "긴자루도끼") {
            arms_name = "긴 자루 도끼";
        }

        for (var i = 0; i < $("div.pagination-numbox").children("a").length; i++) {
            url[i] = "https://p1togaming.tistory.com/category/%EB%AC%B4%20%EA%B8%B0?page="+Number(i+1);
        }
        
        for (i in url) {
            request(url[i], function(error, response, html){
                if (error) {throw error};
                $ = cheerio.load(html);
                var url2 = "";

                for (var i = 0; i < $("li.list-item").children("a").length; i++) {
                    if ($("li.list-item").children("a").eq(i).children("h3").text().search(arms_name) > -1) {
                        if (arms_name == "창" && $("li.list-item").children("a").eq(i).children("h3").text().search("장창") >  -1) {
                            continue;
                        }

                        url2 = "https://p1togaming.tistory.com"+$("li.list-item").children("a").eq(i).attr("href");
                        break;
                    }
                }

                if (!gfn_isNull(url2)) {
                    console.log(url2);

                    request(url2, function(error, response, html) {
                        if (error) {throw error};
                        $ = cheerio.load(html);
                        var Text_Value = "";

                        $(".contents_style h2, .contents_style p").addClass("contVal");
                        $(".contVal").append("\n");

                        for (var i = 0; i <= $(".contVal").length; i++) {
                            Text_Value += $(".contVal").eq(i).text();
                        }

                        Text_Value += "더 자세한 내용 보기 : " + url2;

                        var board = {
                              Title : arms_name
                            , String_value : Text_Value
                            , Color : "WHITE"
                        }

                        gfn_Send_Msg(msg, Discord, board); 

                    });
                    return;
                } 
            });
        }
    });
}

module.exports = {
      name : "장비"
    , description : "장비 호출"
    , User_job(msg, arms_name, Discord) {
        ufn_arms(msg, arms_name, Discord);
    }
}
