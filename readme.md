BLSlider
=========================


### BL Slider ###
>v0.1.0

### Usage
```html
<link rel="stylesheet" href="blslider.css" />

<script src="jquery.min.js"></script>
<script src="blslider.js"></script>

<script>
    $('.slider').BLSlider({
        // Parameters
    });
</script>
```

### Parameters
* **interval**: Interval in millisecons, (*Default: 800*)
* **duration**: Duration in millisecons, (*Default: 8000*)
* **delay**: Delay before moving to new slide in milliseconds, (*Default: 0*)
* **animation**: Animation type (slide *default*, fade, scale)
* **easing**: Easing for slide transition. Any valid CSS transition-timing-function. (*Default: ease-in-out*)
* **autoPlay**: (*Default: true*)
* **pauseOnHover**: (*Default: true*)
* **showNavigation**: Show or hide **previous** and **next** buttons. (always, never, hover *default*)
* **showPagination**: Show or hide **pagination** buttons. (always, never, hover *default*)

### Callbacks
* **onBeforeMove**: function(currentSlide) {}
* **onAfterMove**: function(currentSlide) {}
* **onBeforeInit**: function(sliderElement) {}
* **onAfterInit**: function(sliderElement) {}
* **onBeforeKill**: function(sliderElement) {}
* **onAfterKill**: function(sliderElement) {}

### Functions
```javascript
/*
 * Moves to next slide
 * Returns an array of slide ids
 * for every effected slide object
 */
$('.slider').BLSNext();


/*
 * Moves to previous slide
 * Returns an array of slide ids
 * for every effected slide object
 */
$('.slider').BLSPrev();

/*
 * Moves to a given slide
 * Returns an array of slide ids
 * for every effected slide object
 */
$('.slider').BLSMoveTo(slideId);

/*
 * Starts the slider(s)
 * Returns true if successful
 */
$('.slider').BLSPlay();

/*
 * Stops the slider(s)
 * Returns true if successful
 */
$('.slider').BLSStop();

/*
 * Terminates the slider(s)
 * Returns true if successful
 */
$('.slider').BLSKill();

```


### Dependencies
* [jQuery](http://jquery.com/)
* Images are taken from [unsplash.com](http://unsplash.com)

License
------------
CC0 1.0 Universal Licence

Dependecies have their own licence information. Please view them before use.
