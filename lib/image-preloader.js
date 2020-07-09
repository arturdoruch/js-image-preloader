/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

let _options = {
    loadingMessage: 'Loading {total} images',
    loadingFailureMessage: '{total} failures',
    completeIdleTime: 500,
};

/**
 * Sets preloader options.
 *
 * @param {{}} options
 * @param {string} [options.loadingMessage = 'Loading {total} images']
 *                 The loading message. May contain "{total}" mark which is replacing with number of total images to load.
 * @param {string} [options.loadingFailureMessage = '{total} failures']
 *                 The loading images failure message. May contain a "{total}" mark which is replacing with
 *                 number of total not loaded images.
 * @param {int}    [options.completeIdleTime = 400] The time in microseconds to wait before calling functions after loading images.
 */
function setOptions(options) {
    Object.assign(_options, options);
}

/**
 * Displays preloader while loading images into browser memory.
 *
 * @param {[]} imageUrls The urls of paths of loaded images.
 * @param {function} completeHandler A loading images handler called after loading is complete.
 *                                   Receives three arguments, arrays with "Image" objects for:
 *                                    - loaded and not loaded (due in loading error) images.
 *                                    - loaded images.
 *                                    - not loaded (due in loading error) images.
 */
function preload(imageUrls, completeHandler) {
    if (typeof completeHandler !== 'function') {
        throw new TypeError(`The "completeHandler" argument must be a function, but got ${typeof completeHandler}.`);
    }

    template.initialize(imageUrls.length);

    let totalImages = imageUrls.length,
        images = [],
        loadedImages = [],
        notLoadedImages = [];

    function onLoaded(e) {
        let image = e.target;

        if (e.type === 'load') {
            loadedImages.push(image);
            progressBar.update(loadedImages.length, totalImages);
        } else {
            notLoadedImages.push(image);
            template.setLoadingFailureMessage(notLoadedImages.length, image.src);
        }

        if (loadedImages.length + notLoadedImages.length === totalImages) {
            setTimeout(function () {
                completeHandler.call(window, images, loadedImages, notLoadedImages);
            }, _options.completeIdleTime);
        }
    }

    for (let imageUrl of imageUrls) {
        const image = new Image();
        images.push(image);

        image.src = imageUrl;
        image.onload = onLoaded;
        image.onerror = onLoaded;
    }
}

/**
 * Hides preloader HTML element.
 */
function hide() {
    template.setLoadingStatus(false);
    template.removeLoadingFailureElement();
    progressBar.reset();
}

/**
 * Removes preloader HTML element from the DOM document.
 */
function remove() {
    template.remove();
}

const template = {
    elementsIdPrefix: 'ad-image-preloader',

    initialize(totalImages) {
        if (!this.template) {
            this.create();
        }

        this.setLoadingMessage(totalImages);
        this.setLoadingStatus(true);
        progressBar.reset();
    },

    setLoadingStatus(state) {
        if (this.template) {
            this.template.classList.toggle('loading', state);
        }
    },

    setLoadingMessage(totalImages) {
        this.loadingMessage.textContent = _options.loadingMessage.replace('{total}', totalImages);
    },

    setLoadingFailureMessage(totalFailures, imageUrl) {
        this.appendLoadingFailureElement();
        this.loadingFailureMessage.innerHTML = _options.loadingFailureMessage.replace('{total}', totalFailures);
        console.warn(`Image preloader: Failure of loading image "${imageUrl}".`);
    },

    /**
     * @private
     */
    create() {
        this.template = createElement('div', {id: this.elementsIdPrefix});
        let overlay = createElement('div', {id: this.elementsIdPrefix + '__overlay'});
        let container = createElement('div', {id: this.elementsIdPrefix + '__container'});
        let progress = createElement('div', {class: 'progress'});
        progress.appendChild(progressBar.setElement());
        this.loadingMessage = createElement('p', {class: 'loading-message'});

        container.appendChild(this.loadingMessage);
        container.appendChild(progress);

        document.body.appendChild(this.template);
        this.template.appendChild(overlay);
        this.template.appendChild(container);

        setTimeout(function () {
            overlay.onclick = hide;
        }, 1000);
    },

    /**
     * @private
     */
    appendLoadingFailureElement() {
        if (!this.loadingFailureMessage) {
            this.loadingFailureMessage = createElement('p', {class: 'loading-failure-message'});
            this.loadingMessage.parentNode.insertBefore(this.loadingFailureMessage, this.loadingMessage.nextSibling);
        }
    },

    /**
     * @private
     */
    removeLoadingFailureElement() {
        if (this.loadingFailureMessage) {
            this.loadingMessage.parentNode.removeChild(this.loadingFailureMessage);
            this.loadingFailureMessage = null;
        }
    },

    /**
     * Removes preloader from DOM document.
     */
    remove() {
        if (this.template) {
            document.body.removeChild(this.template);
            this.template = null;
            this.loadingFailureMessage = null;
        }
    }
};

const progressBar = {
    element: null,

    setElement() {
        return this.element = createElement('div', {
            'class': 'progress-bar',
            'role': 'progressbar',
            'aria-valuenow': 0,
            'aria-valuemin': 0,
            'aria-valuemax': 100
        })
    },

    reset() {
        this.update(0, 1);
    },

    /**
     * @param {int} loadedImages
     * @param {int} totalImages
     */
    update(loadedImages, totalImages) {
        let percent = parseInt((loadedImages / totalImages) * 100);
        this.element.innerHTML = percent + '%';
        this.element.style.width = percent + '%';
        this.element.setAttribute('aria-valuenow', percent);
    }
}

/**
 * @param {string} tagName
 * @param {{}} [attributes]
 * @param {string} [text]
 *
 * @return {HTMLElement}
 */
function createElement(tagName, attributes = {}, text = '') {
    let element = document.createElement(tagName);

    for (let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }

    element.textContent = text;

    return element;
}

export default {
    setOptions,
    preload,
    hide,
    remove
};
