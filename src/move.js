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