import { select } from '../settings.js';

class Carousel {
  constructor(wrapper) {
    const thisCarousel = this;

    thisCarousel.dom = {};

    thisCarousel.dom.wrapper = wrapper;

    thisCarousel.initPlugin();
  }

  initPlugin() {
    const thisCarousel = this;

    thisCarousel.dom.carousel = thisCarousel.dom.wrapper.querySelector(select.home.carouselPlugin);

    // eslint-disable-next-line
    const flkty = new Flickity( thisCarousel.dom.carousel, {
      cellAlign: 'left',
      contain: true,
      prevNextButtons: false,
      wrapAround: true,
      autoPlay: 3000,
    });
  }
}

export default Carousel;