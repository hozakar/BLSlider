var controllers = [];

var securityDelay = 100;

var BLSlider = function (el, params) {
    var id = controllers.length,
        currentSlide = 0,
        moving = false;
    
    params.onBeforeInit($(el));

    var prepDOM = new BLSliderObjects.PrepDOM(el, params);
    var move = new BLSliderObjects.Move(el, params);
    var timer = new BLSliderObjects.Timer(el, params);

    this.slides = prepDOM.getSlides();
    
    this.next = function() {
        var slideId = (currentSlide + 1) % this.slides.length;
        this.moveTo(slideId, 1);
    };

    this.prev = function() {
        var slideId = (currentSlide  - 1 + this.slides.length) % this.slides.length;
        this.moveTo(slideId, -1);
    };

    this.moveTo = function(slideId, dir) {
        if(moving) return false;
        if(slideId === currentSlide && $(el).find('.BLSlider-current-slide').length) return;
        
        moving = true;
        params.onBeforeMove($(el).find('.BLSlider-current-slide').children());
        
        dir = dir || ( (slideId - currentSlide) / Math.max( 1, Math.abs(slideId - currentSlide) ) );

        move.to(slideId, dir);
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
        }, params.interval + params.delay + securityDelay);
    };

    this.play = function() {
        timer.open();
    };

    this.stop = function() {
        timer.close();
    };

    this.kill = function() {
        params.onBeforeKill($(el));
        
        prepDOM.kill(this.slides, id);

        params.onAfterKill($(el));
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
        easing: 'ease-in-out',
        autoPlay: true,
        pauseOnHover: true,
        showNavigation: 'hover',
        showPagination: 'hover',
        onBeforeMove: function() {},
        onAfterMove: function() {},
        onBeforeInit: function() {},
        onAfterInit: function() {},
        onBeforeKill: function() {},
        onAfterKill: function() {}
    };
    
    var values = $.extend(defaults, params);

    for(var i = 0, len = this.length; i < len; i++) {
        if(typeof $(this).data('BLSliderControllerId') !== 'number')
            controllers.push(new BLSlider(this[i], values));
    }
    
    return this;
};
/* End: Plug-in Init */

/* Plugin needs some easy to reach functionalities */
function validControllers(elements, command, slideId) {
    var controllersArray = [];
    for(var i = 0, len = elements.length; i < len; i++) {
        var id = $(elements[i]).data('BLSliderControllerId');
        if(id >= 0) {
            if(controllers[id]) controllersArray.push(controllers[id]);
        }
    }
    
    for(var i = 0, len = controllersArray.length; i < len; i++) {
        controllersArray[i][command](slideId);
    }
}

$.fn.BLSNext = function() {
    validControllers(this, 'next');
};

$.fn.BLSPrev = function() {
    validControllers(this, 'prev');
};

$.fn.BLSMoveTo = function(slideId) {
    if(typeof slideId === 'undefined') return;
    validControllers(this, 'moveTo', slideId);
};

$.fn.BLSPlay = function() {
    validControllers(this, 'play');
};

$.fn.BLSStop = function() {
    validControllers(this, 'stop');
};

$.fn.BLSKill = function() {
    validControllers(this, 'kill');
};
/* -o- */