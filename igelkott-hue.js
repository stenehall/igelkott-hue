var http = require("http");

var Hue = function Hue() {
  this.listeners = {'trigger:movingon': this.movingon};

  this.name = 'hue';
  this.help = {
    "default": "",
  };

  this.queue = [];

  var interval = this.config.interval || 60000;

  setInterval(function(){
    this.queue.pop();
  }.bind(this), interval);
};

Hue.prototype.movingon = function movingon(message) {

  var obj;

  if (this.queue.indexOf(message.prefix.nick) === -1)
  {
    this.queue.push(message.prefix.nick);
    obj = {
      command: 'PRIVMSG',
      parameters: [message.parameters[0], message.prefix.nick+": Yes! Det tycker jag också."]
    };

    this.igelkott.push(obj);
  }
  else
  {
    obj = {
      command: 'PRIVMSG',
      parameters: [message.parameters[0], message.prefix.nick+": Du har redan hojtat högt."]
    };

    this.igelkott.push(obj);
  }

  if (this.queue.length > 9)
  {
    // To be added later
    //http.get({ hostname: 'localhost', port: 8080, path: '/?hue=101010' }); // @TODO: Might want to handle a response

    this.disco(); // Not sure how to test this right now. Could mock http request but not right now
    this.igelkott.emit('hue:disco');

    obj = {
      command: 'PRIVMSG',
      parameters: [message.parameters[0], "Vi kör en moving on"]
    };

    this.igelkott.push(obj);
  }

  this.igelkott.emit('hue:movingon');
};

/*
 * If we want to do disco lights
 */
 Hue.prototype.disco = function disco() {
  if(this.timer === undefined) {
    this.counter = 10;
    this.timer = setInterval(function() {
      // Lets do some disco.
      this.counter--;
      if (this.counter < 0)
      {
        clearInterval(this.timer);
        delete this.timer; // Need this to be able to to === undefined above
      }
    }.bind(this), 100);
  }
};


exports.Plugin = Hue;
