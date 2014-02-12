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
      parameters: [message.parameters[0], message.prefix.nick+": Du har redan hojtat högt redan."]
    };

    this.igelkott.push(obj);
  }

  if (this.queue.length > 9)
  {
    // To be added later
    //http.get({ hostname: 'localhost', port: 8080, path: '/?hue=101010' }); // @TODO: Might want to handle a response

    obj = {
      command: 'PRIVMSG',
      parameters: [message.parameters[0], "Vi kör en moving on"]
    };

    this.igelkott.push(obj);
  }
};

exports.Plugin = Hue;
