/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import imagePreloader from './../lib/image-preloader';
import './../styles/image-preloader.css';

// Set options globally.
imagePreloader.setOptions({
    //completeIdleTime: 1000,
});

const button = document.querySelector('button#load-images');

button.onclick = function () {
    let imageUrls = getImageUrls();

    imagePreloader.preload(imageUrls, function (images, loadedImages, notLoadedImages) {
        // Load some image gallery.
        console.log(images);

        //imagePreloader.hide();
        // Optionally remove preloaded from the DOM document.
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
