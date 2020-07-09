# Image preloader

Displays preloader while loading images into browser memory, before loading image gallery.

## Install

todo

## Usage

```html
<!-- index.html -->
<button type="button" id="load-images">Load images</button>

<ul id="image-urls">
    <li><a href="http://example.com/image1.jpg">http://example.com/image1.jpg</a></li>
    <li><a href="http://example.com/image2.jpg">http://example.com/image2.jpg</a></li>
</ul>
```

```js
// script.js
import imagePreloader from '@arturdoruch/image-preloader';
import '@arturdoruch/image-preloader/styles/image-preloader.css';

// Set options.
imagePreloader.setOptions({

});

// Get element initializing loading image preloader and gallery.
const button = document.querySelector('button#load-images');

button.onclick = function () {
    // Get image urls to display in your image gallery. 
    let imageUrls = getImageUrls();

    imagePreloader.preload(imageUrls, function (images, loadedImages, notLoadedImages) {
        // Load image gallery.
        //loadGallery(images);

        // Hide preloader when gallery is set up.
        imagePreloader.hide();
        // or remove from the DOM document.
        //imagePreloader.remove();
    });
}

function getImageUrls() {
    const imageElements = document.querySelectorAll('#image-url-list a');
    let imageUrls = [];

    for (let element of imageElements) {
        imageUrls.push(element.href);
    }

    return imageUrls;
}
```

### Functions

 - `setOptions` - Sets preloader [options](#options).
 - `preload` - Displays preloader while loading images into browser memory.
 - `hide` - Hides preloader HTML element (`div#ad-image-preloader`).
 - `remove` - Removes preloader HTML element from the DOM document.
     
     
### Options

 - `loadingMessage` string (default: `Loading {total} images`)
 
   Loading images message. May contain `{total}` mark which is replacing with number of loaded images.
   
 - `loadingFailureMessage` string (default: ``)
  
   Loading images failure message. May contain `{total}` mark which is replacing with number of total not loaded images.  
   
 - `completeIdleTime` int (default: `400`)
 
   The time in microseconds to wait before calling functions after loading images.
   