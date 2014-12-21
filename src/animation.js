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

BLSliderObjects.news = function(el, dir, params) {
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