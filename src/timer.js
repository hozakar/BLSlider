BLSliderObjects.Timer = function (self) {
    this.timerHandle = false;
    this.self = self;
};

BLSliderObjects.Timer.prototype.open = function(params) {
    if(this.timerHandle) clearInterval(this.timerHandle);
    this.timerHandle = false;
    var control = this.self;
    return(this.timerHandle = setInterval(function(){
        control.next();
    }, params.interval + params.duration));
};

BLSliderObjects.Timer.prototype.close = function() {
    clearInterval(this.timerHandle);
    this.timerHandle = false;
    return true;
};
