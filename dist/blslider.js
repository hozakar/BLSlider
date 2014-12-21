/* 
**  BLSlider 0.1.0
**  https://github.com/hozakar/BLSlider
**
**  Copyright 2014, Hakan Ozakar <hozakar@gmail.com>
**  http://beltslib.net
**
**  CC0 1.0 Universal Licence
**  https://creativecommons.org/publicdomain/zero/1.0/
*/
(function ($) {
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
BLSliderObjects.PrepDOM = function (el, params) {
    
    this.init = function() {
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
        
        return slides;
    };
    
    this.kill = function(slides, id) {
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
    
    function createControls(slides) {
        var $container = $(el).children('.BLSliderContainer');

        if(params.autoPlay && params.pauseOnHover) {
            $container.hover(function() {
                $(el).BLSStop();
            }).mouseleave(function() {
                $(el).BLSPlay();
            });
        }
        
        if(!params.navigation && !params.pagination) return;
        
        if(params.navigation) {
            $container.append(
                '<div class="BLSlider-prev" data-role="prev"></div>' + 
                '<div class="BLSlider-next" data-role="next"></div>'
            );
        }
        if(params.pagination) {
            $container.append('<div class="BLSlider-buttons"><ul class="BLSliderButtonList"></ul></div>');
            for(var i = 0, len = slides.length; i < len; i++) {
                $container.find('.BLSliderButtonList').append('<li class="BLSliderControlButton" data-slide-id="' + i + '" data-role="moveTo"></li>');
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
        if(e.button !== 0) return;
        e.preventDefault();
        var start = {
            x: e.pageX || e.changedTouches[0].pageX,
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
            x: e.pageX || e.changedTouches[0].pageX,
            t: Date.now()
        };
        $(el).data('mouse-tracker-move', movement);
        evalTrackerData();
    }
};

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

BLSliderObjects.Move = function(el, params) {
    var availableAnimations = [
        'slide',
        'fade',
        'scale',
        'turn'
    ];
    
    this.init = function(slideId, dir) {
        var animType = 'slide';
        
        if(availableAnimations.indexOf(params.animation.toLowerCase()) !== -1)
            animType = params.animation.toLowerCase();
        
        if(checkCurrentSlide(el, slideId)) return;

        var anim = new BLSliderObjects[animType](el, dir, params);
        setTimeout(function() {
            anim.init(slideId);
        }, params.delay);
    };

    function checkCurrentSlide(el, slideId) {
        var slide = $(el).data('BLSliderSlides')[slideId];
        var $currentSlide = $(el).find('.BLSlider-current-slide');

        if(!$currentSlide.length) {
            var $currentSlide = $('<div class="BLSlider-current-slide"></div>').appendTo($(el).children('.BLSliderContainer'));
            setSlide($currentSlide);
            $currentSlide.append($(slide).clone());
            return true;

        }
        return false;
    }
};
BLSliderObjects.slide = function(el, dir, params) {
    this.init = function(slideId) {
        var $slides = getSlides(el, { left : (100 * dir) + '%' });

        $slides.next.append($(el).data('BLSliderSlides')[slideId]);
        
        var transition = setPrefix('-pre-transition : left ' + params.interval + 'ms ' + params.easing);

        $slides.current.css( transition );
        $slides.next.css( transition );

        var currentCSS = { left: (-100 * dir) + '%' },
            nextCSS = { left: 0 };
        shiftSlides($slides, params.interval, currentCSS, nextCSS);
    };
};

BLSliderObjects.fade = function(el, dir, params) {
    this.init = function(slideId) {
        var $slides = getSlides(el, { opacity: 0, zIndex: 9 - dir });

        $slides.next.append($(el).data('BLSliderSlides')[slideId]);
        
        var transition = setPrefix('-pre-transition : opacity ' + params.interval + 'ms ' + params.easing);
        $slides.current.css( transition );
        $slides.next.css( transition );

        var currentCSS = { opacity: 0 },
            nextCSS = { opacity: 1 };
        shiftSlides($slides, params.interval, currentCSS, nextCSS);
    };
};

BLSliderObjects.scale = function(el, dir, params) {
    this.init = function(slideId) {
        var transform = setPrefix('opacity: 0; z-index: ' + (9 - dir) + '; -pre-transform : scale(' + ( (10 - (dir * 8)) / 10 ) + ')');
        var $slides = getSlides(el, transform);

        $slides.next.append($(el).data('BLSliderSlides')[slideId]);

        var transition = setPrefix('-pre-transition : -pre-transform ' + params.interval + 'ms ' + params.easing + ', opacity ' + (params.interval / 1.25) + 'ms ' + params.easing);
        $slides.current.css( transition );
        $slides.next.css( transition );
        
        var currentCSS = setPrefix('opacity: 0; -pre-transform: scale(' + ( (10 + (dir * 6)) / 10 ) + ')'),
            nextCSS = setPrefix('opacity: 1; -pre-transform: scale(1)');
        shiftSlides($slides, params.interval, currentCSS, nextCSS);
    };
};

BLSliderObjects.turn = function(el, dir, params) {
    this.init = function(slideId) {
        var transform = setPrefix('opacity: 0; z-index: ' + (9 - dir) + '; -pre-transform: scale(.2) rotateZ(0deg)');
        var $slides = getSlides(el, transform);

        $slides.next.append($(el).data('BLSliderSlides')[slideId]);

        var transition = setPrefix('-pre-transition : -pre-transform ' + params.interval + 'ms ' + params.easing + ', opacity ' + (params.interval / 1.25) + 'ms ' + params.easing);
        $slides.current.css( transition );
        $slides.next.css( transition );
        
        var currentCSS = setPrefix('opacity: 0;'),
            nextCSS = setPrefix('opacity: 1; -pre-transform: scale(1) rotateZ(' + (0 + (dir * 360)) + 'deg)');
        shiftSlides($slides, params.interval, currentCSS, nextCSS);
    };
};

function setPrefix(prop) {
    var setProp = {};
    var prefixes = [ "-webkit-", "-moz-", "-ms-", "-o-", "" ];
    if(prop) {
        prop = prop.split(';');
        for(var i = 0, len = prop.length; i < len; i++) {
            if(prop[i]) {
                if(prop[i].indexOf('-pre-') > -1) {
                    for(var j = 0, len = prefixes.length; j < len; j++) {
                        var dummy = prop[i].replace(/-pre-/g, prefixes[j]);
                        addProp(dummy, setProp);
                    }
                } else {
                    addProp(prop[i], setProp);
                }
            }
        }
    }

    function addProp(prop, setProp) {
        prop = prop.split(':');
        if(prop.length === 2) {
            setProp[prop[0].split(' ').join('')] = prop[1];
        }
    }

    return setProp;
}

function setSlide($slide, css) {
    css = css || {};
    $slide.css(
        $.extend({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 9
        }, css)
    );
}

function getSlides(el, css) {
    var slides = {
        next : $('<div class="BLSlider-next-slide"></div>').appendTo($(el).children('.BLSliderContainer')),
        current : $(el).find('.BLSlider-current-slide')
    };
    
    setSlide(slides.current);
    setSlide(slides.next, css);

    return slides;
}

function shiftSlides($slides, timer, currentCSS, nextCSS) {
    setTimeout(function(){
       $slides.current.css(currentCSS);
       $slides.next.css(nextCSS);
    }, defaultDelay / 2);
    
    setTimeout(function() {
        $slides.current.remove();
        $slides.next.attr('class', 'BLSlider-current-slide').css(setPrefix('-pre-transition : none'));
    }, timer);
}
}(jQuery));