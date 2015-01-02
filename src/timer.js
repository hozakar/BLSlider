BLSliderObjects.Timer = function (el, params) {
    this.timerHandle = false;
    this.el = el;
    this.params = params;
};

BLSliderObjects.Timer.prototype.open = function() {
    if(this.timerHandle) clearInterval(this.timerHandle);
    this.timerHandle = false;
    var el = this.el;
    this.timerHandle = setInterval(function(){
        $(el).BLSNext();
    }, this.params.interval + this.params.duration);
};

BLSliderObjects.Timer.prototype.close = function() {
    clearInterval(this.timerHandle);
    this.timerHandle = false;
};
