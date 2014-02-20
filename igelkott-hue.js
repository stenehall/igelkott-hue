var http = require("http");

var Hue = function Hue() {
  this.listeners = {'trigger:movingon': this.movingon, '353': this._353};

  this.name = 'hue';
  this.help = {
    "default": "Use <trigger>movingon to help make Tommies lamp disco.",
  };

  this.queue = [];
  this.interval = this.config.interval || 60000;
  this.limit = this.config.limit || 10;

  setInterval(function(){
    this.queue.shift();
  }.bind(this), this.interval);
};

Hue.prototype._353 = function _353(message) {
  var users = message.parameters[3].split(' ');
  this.userCount = users.length;
}


Hue.prototype.movingon = function movingon(message) {

  var obj;

  if (this.queue.indexOf(message.prefix.nick) === -1)
  {
    this.queue.push(message.prefix.nick);

    if (this.queue.length >= this.limit)
    {
      this.igelkott.log("Hue - Light it up for a minute");
      this.doCall(200);
      clearTimeout(this.timer);
      this.timer = setTimeout(function() {
        this.igelkott.log("Hue - Down again");
        this.doCall(0);
      }.bind(this), 60000);

      //this.disco();
      this.igelkott.emit('hue:disco');
    }
    else
    {
      this.igelkott.log("Hue - Light it up for a 2 seconds");
      this.doCall(100);
      this.timer = setTimeout(function() {
        this.igelkott.log("Hue - Down again");
        this.doCall(0);
      }.bind(this), 2000);
    }
    this.igelkott.log("Hue - Reqired lvl: "+this.limit+" Current lvl: "+this.queue.length);
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


Hue.prototype.doCall = function doCall(bri) {

  http.get({ hostname: this.config.host, port: this.config.port, path: '/tommie.php?bri='+bri}, function(data) {
    this.igelkott.emit('hue:response', data);
  }.bind(this)).on('error', function(e) {
    if (e === "ECONNREFUSED")
    {
      this.igelkott.log("Server not up at the moment");
    }
  });
};


exports.Plugin = Hue;