BLSlider
=========================


### BL Slider ###
>v0.1.0

### Usage
```html
<link rel="stylesheet" href="dist/blslider.css" />

<script src="jquery.min.js"></script>
<script src="dist/blslider.js"></script>

<script>
    $('.slider').BLSlider({
        // Parameters
    });
</script>
```

### Parameters
* interval: Interval in millisecons, (Default: 800)
* duration: Duration in millisecons, (Default: 8000)
* delay: Delay before moving to new slide in milli seconds, (Default: 0)
* animation: Animation type (slide (Default), fade, scale, news)
* easing: Easing for slide transition. Any valid CSS transition-timing-function. (Default: cubic-bezier(.5,1.1,.5,1.1))
* autoPlay: (Default: true)
* pauseOnHover: (Default: true)
* navigation: Show or hide previous and ext buttons (Default: true)
* pagination: Show or hide pagination buttons (Default: true)

### Callbacks
* onBeforeMove: function(currentSlide) {}
* onAfterMove: function(currentSlide) {}
* onBeforeInit: function(sliderElement) {}
* onAfterInit: function(sliderElement) {}
* onBeforeKill: function(sliderElement) {}
* onAfterKill: function(sliderElement) {}

### Functions
```script
/*
 * Moves to next slide
 * Returns an array of slide ids
 * for every effected slide object
 */
$('.slider).BLSNext();


/*
 * Moves to previous slide
 * Returns an array of slide ids
 * for every effected slide object
 */
$('.slider).BLSPrev();

/*
 * Moves to a given slide
 * Returns an array of slide ids
 * for every effected slide object
 */
$('.slider).BLSMoveTo();

/*
 * Starts the slider(s)
 * Returns true if successful
 */
$('.slider).BLSPlay();

/*
 * Stops the slider(s)
 * Returns true if successful
 */
$('.slider).BLSStop();

/*
 * Terminates the slider(s)
 * Returns true if successful
 */
$('.slider).BLSKill();

```


### Dependencies
* [jQuery](http://jquery.com/)
* Images are taken from [unsplash.com](http://unsplash.com)

License
------------
CC0 1.0 Universal Licence

Dependecies have their own licence information. Please view them before use.
