describe("BLSlider constructs", function() {
    var slider, slideCount;
    
    beforeAll(function() {
        $.ajax({
            async: false,
            dataType: 'html',
            url: 'specs/BLSliderConstructorTests.html',
            success: function(data) {
                $('body').append($(data));
            }
        });
        slideCount = $('.slider').children().length;
        slider = $('.slider').BLSlider();
    });
    
    it("and returns the DOM object", function() {
        expect($('.slider').length).toBeGreaterThan(0);
        expect(slider).toEqual($('.slider'));
    });

    it("and the returned object has the expected public methods", function() {
        expect($('.slider').BLSNext).toBeDefined();
        expect($('.slider').BLSPrev).toBeDefined();
        expect($('.slider').BLSMoveTo).toBeDefined();
        expect($('.slider').BLSPlay).toBeDefined();
        expect($('.slider').BLSStop).toBeDefined();
        expect($('.slider').BLSKill).toBeDefined();
    });

    it("and the slides are defined", function() {
        expect($('.slider').data('BLSliderSlides').length).toEqual(slideCount);
    });

    it("and can call BLSKill method", function() {
        $('.slider').BLSKill();
        expect($('.slider').data('BLSliderControllerId')).toBeNull();
        expect($('.slider').data('BLSliderSlides')).toBeNull();
        expect($('.slider').children().length).toBe(slideCount);
    });
});