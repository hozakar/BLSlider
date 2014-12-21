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