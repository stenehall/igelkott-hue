var assert = require('chai').assert,
nock = require('nock'),
Stream = require('stream'),

Igelkott = require('igelkott'),
Hue = require('../igelkott-hue.js').Plugin;


describe('Hue', function() {

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
    igelkott.plugin.load('hue', {interval: 5000, percentage: 0.1, host: 'localhost', port: 5000}, Hue);

  });

  it('Should count up the queue', function(done) {

    igelkott.on('hue:movingon', function(data) {
      assert.equal(igelkott.plugin.plugins.hue.queue.length, 1);
      done();
    });

    igelkott.connect();
    s.write(":dsmith0!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");

  });

  it('Should not count up queue after first moving on from same user', function(done) {
    var queueCount = 0;

    igelkott.on('hue:movingon', function(data) {
      if(queueCount > 0)
      {
        assert.equal(igelkott.plugin.plugins.hue.queue.length, 1);
        done();
      }
      queueCount++;
    });

    igelkott.connect();
    s.write(":dsmith0!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith0!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");

  });


  it('Should remove one person from the queue every 5 seconds', function(done) {
    this.timeout(25000); // We need to wait for it


    igelkott.connect();
    s.write(":dsmith0!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");
    s.write(":dsmith1!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");

    setTimeout(function() {
      assert.equal(igelkott.plugin.plugins.hue.queue.length, 1);
      done();
    }, 6000);

  });


  it('Should respond with moving on after 10 movingons from unique users', function(done) {

    igelkott.on('hue:disco', function() {
      done();
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


  it('Should do an up call with bri 100 on first movingon', function(done) {

    this.timeout(25000); // We need to wait for it

    var google = nock('http://localhost:5000')
    .get('/tommie.php?bri=100')
    .reply(200, "OK");

    igelkott.on('hue:response', function(data) {
      assert.equal(data.statusCode, 200);
      done();
    });

    igelkott.connect();
    s.write(":dsmith0!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :!movingon\r\n");

  });

  it("Should do an down call with bri 0 2 seconds after the first up call");

});
