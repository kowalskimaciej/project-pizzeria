import { templates } from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
  }

  render(wrapper) {
    const thisHome = this;

    thisHome.dom = {};

    this.dom.wrapper = wrapper;

    console.log('DUPA TEST');

    const generatedHTML = templates.homeWidget();
    thisHome.dom.wrapper.innerHTML = generatedHTML;
  }
}

export default Home;