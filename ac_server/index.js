var redis = require("redis"), redisClient = redis.createClient('6379', '127.0.0.1');
var path = require('path');
const express = require('express')
var app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));

app.use("/styles",  express.static(__dirname + '/public/stylesheets'));
app.use("/scripts", express.static(__dirname + '/public/javascripts'));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/autocomplete', (request, response) => {
  console.log('Autocomplete query recieved: ' + request.query);
  var param = request.query.term;
  redisClient.zrank('autoCompleteIndex', param,
    function(err, reply)
    {
          if (err !== null){
            console.log("error: " + err);
          }
          else
          {
            console.log("zrank returned: " + reply);
            redisClient.zrange('autoCompleteIndex', reply, reply + 50,
              function(err, reply)
              {
                if (err !== null){
                  console.log("error: " + err);
                }
                else
                {
                  console.log("zrange returned: " + reply);
                  console.log("zrange length of items: " + reply.length);
                  response.writeHead(200, {'Content-Type': 'application/json'});
                  var replies = [];
                  for(var i = 0; i< reply.length; i++)
                  {
                    var productStr = reply[i];
                    var minLen = Math.min(productStr.length, param.length);
                    if(productStr.substring(0,minLen) != param.substring(0,minLen))
                      break;
                    if(productStr[productStr.length-1] == "*")
                      replies.push(productStr.substring(0,productStr.length-1));
                  }
                  //replies = replies.sort();
                  //var str = callback + '( ' + JSON.stringify(replies) + ')';
                  var str = JSON.stringify(replies);
                  console.log("sending response: " + str);
                  response.end(str);
                }
              });
          }
    });
  //response.send('Autocomplete request recieved with param: ' + param)
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

// var redis = require("redis"), client = redis.createClient();
// var http = require('http');
//
// var parseQueryString = function( queryString ) {
//     var params = {}, queries, temp, i, l;
//     queries = queryString.split("&");
//     for ( i = 0, l = queries.length; i < l; i++ ) {
//         temp = queries[i].split('=');
//         params[temp[0]] = temp[1];
//     }
//     return params;
// };
//
// http.createServer(function (req, res) {
//   var q = parseQueryString(req.url.substring(req.url.indexOf('?') + 1));
//   if (typeof(q["q"]) != 'undefined'){
//       var query = decodeURIComponent(decodeURI(q["q"])).toLowerCase();
//       var callback = q["callback"];
//       console.log("query: " + query);
//       client.zrangebylex('icd9', '[' + query, '[' + query + '\xff',
//         function(err, reply){
//         if (err !== null){
//           console.log("error: " + err);
//         } else {
//           res.writeHead(200, {'Content-Type': 'text/plain'});
//           var replies = [];
//           for(var i = 0; i< reply.length; i++)
//             replies.push(reply[i].split("$")[1]);
//           replies = replies.sort();
//           var str = callback + '( ' + JSON.stringify(replies) + ')';
//           res.end(str);
//         }
//       });
//   }
// }).listen(1337, '127.0.0.1');
