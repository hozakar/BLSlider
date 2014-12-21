"use strict";

var BLSliderObjects = {};

var controllers = [];

var defaultDelay = 50;

var BLSlider = function (el, params) {
    var id = controllers.length,
        currentSlide = currentSlide || 0,
        moving = false;
    
    params.onBeforeInit($(el));
    
    var prepDOM = new BLSliderObjects.PrepDOM(el, params);
    var move = new BLSliderObjects.Move(el, params);
    var timer = new BLSliderObjects.Timer(this);

    this.slides = prepDOM.init();
    
    this.next = function() {
        var slideId = (currentSlide + 1) % this.slides.length;
        return this.moveTo(slideId, 1);
    };

    this.prev = function() {
        var slideId = (currentSlide  - 1 + this.slides.length) % this.slides.length;
        return this.moveTo(slideId, -1);
    };

    this.moveTo = function(slideId, dir) {
        if(moving) return false;
        if(slideId === currentSlide && $(el).find('.BLSlider-current-slide').length) return slideId;
        
        moving = true;
        params.onBeforeMove($(el).find('.BLSlider-current-slide').children());
        
        dir = dir || ( (slideId - currentSlide) / Math.max( 1, Math.abs(slideId - currentSlide) ) );

        move.init(slideId, dir);
        /*
         * If is on autoPlay we must reset the play timer
         */
        if(params.autoPlay) this.play();

        currentSlide = slideId;

        setTimeout(function(){
            moving = false;
            $(el).find('.BLSliderControlButton').removeClass('selected');
            $(el).find('.BLSliderControlButton:nth-child(' + (currentSlide + 1) + ')').addClass('selected');
            params.onAfterMove($(el).find('.BLSlider-current-slide').children());
        }, params.interval + params.delay + defaultDelay);
        return slideId;
    };

    this.play = function() {
        return timer.open(params);
    };

    this.stop = function() {
        return timer.close();
    };

    this.kill = function() {
        params.onBeforeKill($(el));
        
        var success = prepDOM.kill(this.slides, id);

        params.onAfterKill($(el));
        return success;
    };

    $(el).data('BLSliderControllerId', id);
    $(el).data('BLSliderSlides', this.slides);
    
    params.onAfterInit($(el));

    /*
     * Now that we have prepared all methods and properties
     * and finished initializing we can move to our current slide
     */
    this.moveTo(currentSlide);
};

/* Plug-in Init */
$.fn.BLSlider = function (params) {
    var defaults = {
        interval: 800,
        duration: 8000,
        delay: 0,
        animation: 'slide',
        easing: 'cubic-bezier(.5,1.1,.5,1.1)',
        autoPlay: true,
        pauseOnHover: true,
        navigation: true,
        pagination: true,
        onBeforeMove: function() {},
        onAfterMove: function() {},
        onBeforeInit: function() {},
        onAfterInit: function() {},
        onBeforeKill: function() {},
        onAfterKill: function() {}
    };
    
    var values = $.extend(defaults, params);

    for(var i = 0, len = this.length; i < len; i++) {
        controllers.push(new BLSlider(this[i], values));
    }
    
    return this;
};
/* End: Plug-in Init */

/* Plugin needs some public functions */
function validControllers(elements) {
    var controllersArray = [];
    for(var i = 0, len = elements.length; i < len; i++) {
        var id = $(elements[i]).data('BLSliderControllerId');
        if(id >= 0) {
            if(controllers[id]) controllersArray.push(controllers[id]);
        }
    }
    return controllersArray;
}

$.fn.BLSNext = function() {
    var cont = validControllers(this);
    var pointerArray = [];
    for(var i = 0, len = cont.length; i < len; i++) {
        pointerArray.push(cont[i].next());
    }
    return pointerArray;
};

$.fn.BLSPrev = function() {
    var cont = validControllers(this);
    var pointerArray = [];
    for(var i = 0, len = cont.length; i < len; i++) {
        pointerArray.push(cont[i].prev());
    }
    return pointerArray;
};

$.fn.BLSMoveTo = function(slideId) {
    slideId = parseInt(slideId) || 0;
    var pointerArray = [];
    var cont = validControllers(this);
    for(var i = 0, len = cont.length; i < len; i++) {
        pointerArray.push(cont[i].moveTo(slideId));
    }
    return pointerArray;
};

$.fn.BLSPlay = function() {
    var cont = validControllers(this);
    var success = true;
    for(var i = 0, len = cont.length; i < len; i++) {
        success = cont[i].play() ? (success && true) : false;
    }
    return success;
};

$.fn.BLSStop = function() {
    var cont = validControllers(this);
    var success = true;
    for(var i = 0, len = cont.length; i < len; i++) {
        success = cont[i].stop() ? (success && true) : false;
    }
    return success;
};

$.fn.BLSKill = function() {
    var cont = validControllers(this);
    var success = true;
    for(var i = 0, len = cont.length; i < len; i++) {
        success = cont[i].kill() ? (success && true) : false;
    }
    return success;
};
/* -o- */