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
        trans: arguments[2] ? {} : setPrefix('-pre-transition : left ' + params.interval + 'ms ' + params.easing)
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
        trans: arguments[2] ? {} : setPrefix('-pre-transition : opacity ' + params.interval + 'ms ' + params.easing)
    };
    
    this.execute(slideId, preps);
};

BLSliderObjects.Move.prototype.scale = function(slideId, dir) {
    var params = this.params;
    
    var preps = {
        next: {
            before: setPrefix('opacity: 0; z-index: ' + (9 - dir) + '; -pre-transform : scale(' + ( (10 - (dir * 8)) / 10 ) + ')'),
            after: setPrefix('opacity: 1; -pre-transform: scale(1)')
        },
        current: {
            after: setPrefix('opacity: 0; -pre-transform: scale(' + ( (10 + (dir * 6)) / 10 ) + ')')
        },
        trans: setPrefix('-pre-transition : -pre-transform ' + params.interval + 'ms ' + params.easing + ', opacity ' + (params.interval / 1.25) + 'ms ' + params.easing)
    };
    
    this.execute(slideId, preps);
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

function shiftSlides($slides, timer, currentCSS, nextCSS, js) {
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
    
    setTimeout(function() {
        $slides.current.remove();
        $slides.next.attr('class', 'BLSlider-current-slide').css(setPrefix('-pre-transition : none'));
    }, timer);
}
