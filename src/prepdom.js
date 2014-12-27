"use strict";
var BLSliderObjects = {};

BLSliderObjects.PrepDOM = function (el, params) {
    this.el = el;
    
    /**
     * We must keep some original values before manipulating the DOM
     */
    $(el).data('width', el.style.width);
    $(el).data('height', el.style.height);
    $(el).data('position', el.style.position);
    $(el).data('overflow', el.style.overflow);

    /**
     * Container object must be positioned
     */
    if (!$(el).css('position') || $(el).css('position') == 'static')
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
    $(el).find('.BLSliderContainer').css({
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    });

    createControls(slides);

    resetTracker();

    trackMouse();

    trackTouch();
    
    function createControls(slides) {
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
            for(var i = 0, len = slides.length; i < len; i++) {
                $container.find('.BLSliderButtonList').append('<li class="BLSliderControlButton" data-slide-id="' + i + '" data-role="moveTo"></li>');
            }
            if(params.showPagination === 'always') {
                $('.BLSlider-buttons'). addClass('show-always');
            }
        }
        
        $container.click(function(e){
            e = e || event;
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
    }
    
    function trackMouse() {
        $(el).on('mousedown', trackStart).on('mouseup', trackStop).on('mousemove', trackMove);
    }

    function trackTouch() {
        $(el).on('touchstart', trackStart).on('touchend', trackStop).on('touchmove', trackMove);
    }

    function evalTrackerData() {
        var data = {
                start : $(el).data('mouse-tracker-start'),
                movement: $(el).data('mouse-tracker-move')
            };
        
        if(!data.start.x) return;
        
        var xDif = data.movement.x - data.start.x;
        
        if(!xDif) return;
        
        var dir = xDif / Math.abs(xDif);
        xDif = Math.abs(xDif);
        
        var tDif = data.movement.t - data.start.t;
        
        if(xDif > 50) {
            if(dir > 0) {
                $(el).BLSPrev();
            } else {
                $(el).BLSNext();
            }
            resetTracker();
        }

        if(tDif > 150) {
            resetTracker();
        }
    }
    
    function resetTracker() {
        $(el).data('mouse-tracker-start', {});
        $(el).data('mouse-tracker-move', {});
    }
    
    function trackStart(e) {
        e = e || event;
        if(e.button !== 0 && e.button !== undefined) return;
        if(e.button !== undefined) e.preventDefault();
        
        var start = {
            x: e.pageX || e.originalEvent.changedTouches[0].pageX,
            t: Date.now()
        };
        $(el).data('mouse-tracker-start', start);
    }
    
    function trackStop(e) {
        e = e || event;
        e.preventDefault();
        resetTracker();
    }

    function trackMove(e){
        e = e || event;
        if(! $(el).data('mouse-tracker-start')['x']) return;
        e.preventDefault();
        var movement = {
            x: e.pageX || e.originalEvent.changedTouches[0].pageX,
            t: Date.now()
        };
        $(el).data('mouse-tracker-move', movement);
        evalTrackerData();
    }
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
    $(el).css({
        position: $(el).data('position'),
        width: $(el).data('width'),
        height: $(el).data('height'),
        overflow: $(el).data('overflow')
    });

    /*
     * Now we can restore it back
     */
    $(el).html('');
    var slideCount = slides.length;
    while(slides.length > 0) {
        $(slides.shift()).clone(true).appendTo(el);
    }
    controllers[id] = null;
    $(el).data('BLSliderControllerId', null);
    $(el).data('BLSliderSlides', null);
    return (slideCount === $(el).children().length);
};
