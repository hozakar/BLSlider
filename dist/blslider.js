/* 
 *  BLSlider v0.1.0
 *  https://github.com/hozakar/BLSlider
 *
 *  Copyright 2014, Hakan Ozakar <hozakar@gmail.com>
 *  http://beltslib.net
 *
 *  CC0 1.0 Universal Licence
 *  https://creativecommons.org/publicdomain/zero/1.0/
 */
(function ($) {
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

BLSliderObjects.Move = function(el, params) {
    this.el = el;
    this.params = params;
    this.animType = 'slide';
    this.js = false;

    if(msie < 10) this.js = true;

    if(typeof this[params.animation.toLowerCase()] !== "undefined")
        this.animType = params.animation.toLowerCase();
};

BLSliderObjects.Move.prototype.to = function(slideId, dir) {
    var el = this.el,
            animType = this.animType,
            params = this.params;
    
    var anim = this;
    if(checkCurrentSlide()) return;
    
    var slideAnim = $( $(el).data('BLSliderSlides')[slideId] ).data('animation') || this.animType;
    
    if(typeof this[slideAnim.toLowerCase()] !== "undefined")
        animType = slideAnim.toLowerCase();
    
    setTimeout(function() {
        anim[animType](slideId, dir);
    }, params.delay);

    function checkCurrentSlide() {
        var slide = $(el).data('BLSliderSlides')[slideId];
        var $currentSlide = $(el).find('.BLSlider-current-slide');

        if(!$currentSlide.length) {
            var $currentSlide = $('<div class="BLSlider-current-slide"></div>').appendTo($(el).children('.BLSliderContainer'));
            anim.animFuncs.setSlide($currentSlide);
            $currentSlide.append($(slide).clone());
            return true;

        }
        
        return false;
    }
};

BLSliderObjects.Move.prototype.execute = function(slideId, preps) {
    var el = this.el,
        params = this.params;
    
    if(typeof preps !== 'object') preps = {};
    preps = $.extend({
        next: {
            before: { left : 0 },
            after: { left: 0 }
        },
        current: {
            after: { left: 0 }
        },
        trans: {}
    }, preps);
    
    var $slides = this.animFuncs.getSlides(el, preps.next.before);
    $slides.next.append($(el).data('BLSliderSlides')[slideId]);
    
    if(!this.js) {
        $slides.current.css( preps.trans );
        $slides.next.css( preps.trans );
    }

    this.animFuncs.shiftSlides($slides, params.interval, preps.current.after, preps.next.after, this.js);
};
BLSliderObjects.Move.prototype.slide = function(slideId, dir) {
    var params = this.params;

    var preps = {
        next: {
            before: { left : (100 * dir) + '%' },
            after: { left: 0 }
        },
        current: {
            after: { left: (-100 * dir) + '%' }
        },
        trans: arguments[2] ? {} : this.animFuncs.setPrefix('-pre-transition : left ' + params.interval + 'ms ' + params.easing)
    };
    
    this.execute(slideId, preps);
};

BLSliderObjects.Move.prototype.fade = function(slideId, dir) {
    var params = this.params;
    
    var preps = {
        next: {
            before: { opacity: 0, zIndex: 9 - dir },
            after: { opacity: 1 }
        },
        current: {
            after: { opacity: 0 }
        },
        trans: arguments[2] ? {} : this.animFuncs.setPrefix('-pre-transition : opacity ' + params.interval + 'ms ' + params.easing)
    };
    
    this.execute(slideId, preps);
};

BLSliderObjects.Move.prototype.scale = function(slideId, dir) {
    var params = this.params;
    
    var preps = {
        next: {
            before: this.animFuncs.setPrefix('opacity: 0; z-index: ' + (9 - dir) + '; -pre-transform : scale(' + ( (10 - (dir * 8)) / 10 ) + ')'),
            after: this.animFuncs.setPrefix('opacity: 1; -pre-transform: scale(1)')
        },
        current: {
            after: this.animFuncs.setPrefix('opacity: 0; -pre-transform: scale(' + ( (10 + (dir * 6)) / 10 ) + ')')
        },
        trans: this.animFuncs.setPrefix('-pre-transition : -pre-transform ' + params.interval + 'ms ' + params.easing + ', opacity ' + (params.interval / 1.25) + 'ms ' + params.easing)
    };
    
    this.execute(slideId, preps);
};


BLSliderObjects.Move.prototype.animFuncs = {
    setPrefix: function(prop) {
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
    },
    shiftSlides: function($slides, timer, currentCSS, nextCSS, js) {
        if(js) {
            setTimeout(function(){
               $slides.current.animate(currentCSS, timer);
               $slides.next.animate(nextCSS, timer);
            }, securityDelay / 2);
        } else {
            setTimeout(function(){
               $slides.current.css(currentCSS);
               $slides.next.css(nextCSS);
            }, securityDelay / 2);
        }

        var self = this;
        setTimeout(function() {
            $slides.current.remove();
            $slides.next.attr('class', 'BLSlider-current-slide').css(self.setPrefix('-pre-transition : none'));
        }, timer);
    },
    setSlide: function($slide, css) {
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
    },
    getSlides: function(el, css) {
        var slides = {
            next : $('<div class="BLSlider-next-slide"></div>').appendTo($(el).children('.BLSliderContainer')),
            current : $(el).find('.BLSlider-current-slide')
        };

        this.setSlide(slides.current);
        this.setSlide(slides.next, css);

        return slides;
    }
};
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
BLSliderObjects.validControllers = function (elements, command, slideId) {
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
};

$.fn.BLSNext = function() {
    BLSliderObjects.validControllers(this, 'next');
};

$.fn.BLSPrev = function() {
    BLSliderObjects.validControllers(this, 'prev');
};

$.fn.BLSMoveTo = function(slideId) {
    if(typeof slideId === 'undefined') return;
    BLSliderObjects.validControllers(this, 'moveTo', slideId);
};

$.fn.BLSPlay = function() {
    BLSliderObjects.validControllers(this, 'play');
};

$.fn.BLSStop = function() {
    BLSliderObjects.validControllers(this, 'stop');
};

$.fn.BLSKill = function() {
    BLSliderObjects.validControllers(this, 'kill');
};
/* -o- */
}(jQuery));