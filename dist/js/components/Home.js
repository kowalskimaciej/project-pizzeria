import { select, templates } from '../settings.js';
import Carousel from './Carousel.js';

class Home {
  constructor(element, data) {
    const thisHome = this;

    thisHome.data = data;

    thisHome.render(element);
    thisHome.initWidgets();
  }

  render(wrapper) {
    const thisHome = this;

    thisHome.dom = {};

    this.dom.wrapper = wrapper;

    let generatedHTML = templates.homeWidget(thisHome.data);
    thisHome.dom.wrapper.innerHTML = generatedHTML;

    thisHome.dom.carouselWrapper = thisHome.dom.wrapper.querySelector(select.home.carousel);
  }

  initWidgets() {
    const thisHome = this;

    thisHome.carousel = new Carousel(thisHome.dom.carouselWrapper);
  }
}

export default Home;