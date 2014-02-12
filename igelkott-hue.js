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

  if (this.queue.indexOf(message.prefix.nick) === -1)
  {
    this.queue.push(message.prefix.nick);
    var obj = {
      command: 'PRIVMSG',
      parameters: [message.parameters[0], message.prefix.nick+": Yes! Det tycer jag också."]
    };

    this.igelkott.push(obj);
  }
  else
  {
    var obj = {
      command: 'PRIVMSG',
      parameters: [message.parameters[0], message.prefix.nick+": Du har redan hojtat högt redan."]
    };

    this.igelkott.push(obj);
  }

  if (this.queue.length > 9)
  {
    var obj = {
      command: 'PRIVMSG',
      parameters: [message.parameters[0], "Vi kör en moving on"]
    };

    this.igelkott.push(obj);
  }
};

exports.Plugin = Hue;
