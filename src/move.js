BLSliderObjects.Move = function(el, params) {
    this.el = el;
    this.params = params;
    this.animType = 'slide';
    this.animPrefix = '';

    if(msie < 10) this.animPrefix = 'js';
    
    this.animType = this.animPrefix + this.animType;
    
    if(typeof this[this.animPrefix + params.animation.toLowerCase()] !== "undefined")
        this.animType = this.animPrefix + params.animation.toLowerCase();
};

BLSliderObjects.Move.prototype.to = function(slideId, dir) {
    var el = this.el,
            animType = this.animType,
            params = this.params;
    
    if(checkCurrentSlide()) return;
    
    var slideAnim = $( $(el).data('BLSliderSlides')[slideId] ).data('animation') || '';
    if(slideAnim) slideAnim = this.animPrefix + slideAnim;
    
    if(typeof this[slideAnim.toLowerCase()] !== "undefined")
        animType = slideAnim.toLowerCase();
    
    var anim = this;
    setTimeout(function() {
        anim[animType](slideId, dir);
    }, params.delay);

    function checkCurrentSlide() {
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
