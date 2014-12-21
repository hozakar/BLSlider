BLSliderObjects.Timer = function (self) {
    
    var timerHandle = false;
    
    this.open = function(params) {
        if(timerHandle) clearInterval(timerHandle);
        timerHandle = false;
        return(timerHandle = setInterval(function(){
            self.next();
        }, params.interval + params.duration));
    };
    
    this.close = function() {
        clearInterval(timerHandle);
        timerHandle = false;
        return true;
    };
};
