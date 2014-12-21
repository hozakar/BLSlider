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

    it("and can call BLSNext method if not moving", function() {
        expect($('.slider').BLSNext()).toEqual([false]);
        setTimeout(function() {
            expect($('.slider').BLSNext()).toEqual([1]);
        }, 800);
    });

    it("and can call BLSPrev method if not moving", function() {
        expect($('.slider').BLSPrev()).toEqual([false]);
        setTimeout(function() {
            expect($('.slider').BLSPrev()).toEqual([0]);
        }, 800);
    });

    it("and can call BLSMoveTo method if not moving", function() {
        expect($('.slider').BLSMoveTo(2)).toEqual([false]);
        setTimeout(function() {
            expect($('.slider').BLSMoveTo(2)).toEqual([2]);
        }, 800);
    });

    it("and can call BLSPlay method", function() {
        expect($('.slider').BLSPlay()).toBe(true);
    });

    it("and can call BLSStop method", function() {
        expect($('.slider').BLSStop()).toBe(true);
    });

    it("and can call BLSKill method", function() {
        expect($('.slider').BLSKill()).toBe(true);
        expect($('.slider').data('BLSliderControllerId')).toBeNull();
        expect($('.slider').data('BLSliderSlides')).toBeNull();
        expect($('.slider').children().length).toBe(slideCount);
    });
});