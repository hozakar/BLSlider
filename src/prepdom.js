"use strict";
var BLSliderObjects = {};

var msie = 999;

if(navigator.appName.indexOf('Internet Explorer') > -1) {
    msie = parseInt(navigator.appVersion.split('MSIE ')[1].split('.')[0]);
}

BLSliderObjects.PrepDOM = function (el, params) {
    this.el = el;
    this.params = params;
    
    /**
     * We must keep original style values before manipulating the DOM
     */
    $(el).data('style', el.getAttribute('style'));

    /**
     * Container object must be positioned
     */
    if (!$(el).css('position') || $(el).css('position') === 'static')
        $(el).css('position', 'relative');

    /**
     * Now we can store the children elements
     * in an array to send. After that we can
     * delete all the child nodes from our container
     */
    var slides = [];
    $(el).children().each(function() {
        slides.push($(this).clone()[0]);
    });
    this.slides = slides;

    $(el).html('<div class="BLSliderContainer"></div>');
    if(msie <= 8) {
        $(el).find('.BLSliderContainer').addClass('ie8');
    }
    $(el).find('.BLSliderContainer').css({
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    });

    this.createControls();
    this.startTracker();
};

BLSliderObjects.PrepDOM.prototype.getSlides = function() {
    return this.slides;
};

BLSliderObjects.PrepDOM.prototype.kill = function(slides, id) {
    var el = this.el;
    controllers[id].stop();
    /*
     * We must restore the original css values
     * so the container element can display
     * exactly the same before we manipulate the DOM
     */
    el.setAttribute('style', $(el).data('style') || '');

    /*
     * Now we can restore it back
     */
    $(el).html('');
    while(slides.length > 0) {
        $(slides.shift()).clone(true).appendTo(el);
    }
    controllers[id] = null;
    $(el).data('BLSliderControllerId', null);
    $(el).data('BLSliderSlides', null);
};

BLSliderObjects.PrepDOM.prototype.createControls = function() {
    var el = this.el;
    var params = this.params;
    
    var $container = $(el).children('.BLSliderContainer');

    if(params.autoPlay && params.pauseOnHover) {
        $container.hover(function() {
            $(el).BLSStop();
        }).mouseleave(function() {
            $(el).BLSPlay();
        });
    }

    if(params.showNavigation === 'never' && params.showPagination === 'never') return;

    if(params.showNavigation !== 'never') {
        $container.append(
            '<div class="BLSlider-prev" data-role="prev"></div>' + 
            '<div class="BLSlider-next" data-role="next"></div>'
        );
        if(params.showNavigation === 'always') {
            $('.BLSlider-prev, .BLSlider-next'). addClass('show-always');
        }
    }
    if(params.showPagination !== 'never') {
        $container.append('<div class="BLSlider-buttons"><ul class="BLSliderButtonList"></ul></div>');
        for(var i = 0, len = this.slides.length; i < len; i++) {
            $container.find('.BLSliderButtonList').append('<li class="BLSliderControlButton" data-slide-id="' + i + '" data-role="moveTo"></li>');
        }
        if(params.showPagination === 'always') {
            $('.BLSlider-buttons'). addClass('show-always');
        }
    }

    $container.on('click', function(e){
        var clickedTo = e.toElement || e.relatedTarget || e.target || false;
        if(!clickedTo) return false;

        switch($(clickedTo).data('role')) {
            case 'prev':
                $(el).BLSPrev();
                break;
            case 'next':
                $(el).BLSNext();
                break;
            case 'moveTo':
                var slideId = parseInt($(clickedTo).data('slide-id')) || 0;
                $(el).BLSMoveTo(slideId);
                break;
        }
    });
};

BLSliderObjects.PrepDOM.prototype.startTracker = function() {
    var el = this.el;
    
    var xDifStd = 50,
        tDifStd = 100,
        tracker;
    
    resetTracker();

    $(el).on('mousedown', trackStart).on('mouseup', trackStop).on('mousemove', trackMove)
        .on('touchstart', trackStart).on('touchend', trackStop).on('touchmove', trackMove);

    function evalTrackerData() {
        if(!tracker.start.x) return;
        
        var xDif = tracker.move.x - tracker.start.x;
        
        if(!xDif) return;
        
        var dir = xDif / Math.abs(xDif);
        xDif = Math.abs(xDif);
        
        var tDif = tracker.move.t - tracker.start.t;
        
        if(xDif > xDifStd) {
            if(dir > 0) {
                $(el).BLSPrev();
            } else {
                $(el).BLSNext();
            }
            resetTracker();
        }

        if(tDif > tDifStd) {
            resetTracker();
        }
    }
    
    function resetTracker() {
        tracker = {
            start: {},
            move: {}
        };
    }
    
    function trackStart(e) {
        var button = e.button === (msie <= 8 ? 1 : 0);

        if(!button) return;
        
        prevent(e);
        
        tracker.start = {
            x: e.clientX || e.originalEvent.changedTouches[0].pageX,
            t: msie <= 8 ? +new Date() : Date.now()
        };
    }
    
    function trackStop(e) {
        prevent(e);
        resetTracker();
    }

    function trackMove(e){
        if(! tracker.start.x) return;
        prevent(e);
        tracker.move = {
            x: e.clientX || e.originalEvent.changedTouches[0].pageX,
            t: msie <= 8 ? +new Date() : Date.now()
        };

        evalTrackerData();
    }
    
    function prevent(e) {
        if(e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
};