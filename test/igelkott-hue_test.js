var assert = require('chai').assert,
Stream = require('stream')

Igelkott = require('igelkott'),
Hue = require('../igelkott-hue.js').Plugin;


describe('Talk', function() {

  var igelkott,
  config,
  s,
  server;

  beforeEach(function () {
    s = new Stream.PassThrough({objectMode: true});

    config = {
      "server": {
        "nick": "igelkott",
      },
      core:['privmsg'],
      'adapter': s, 'connect': function() { this.server.emit('connect'); }
    };

    igelkott = new Igelkott(config);
    igelkott.plugin.load('hue', {}, Hue);

  });

  it('Should count up the queue');
  it('Should not count up queue after first moving on from same user');
  it('Should remove one person from the queue every 30 seconds');


  it('Should respond with moving on after 10 movingons from unique users', function(done) {

    this.timeout(50000); // DB queries are slow

    s.on('data', function(data) {
      if(data == "PRIVMSG ##botbotbot :Vi kör en moving on\r\n")
      {
        done();
      }
    });

    igelkott.connect();
    s.write(":dsmith0!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith1!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith2!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith3!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith4!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith5!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith6!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith7!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith8!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith9!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");

  });

});
