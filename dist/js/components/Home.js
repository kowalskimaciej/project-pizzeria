import { templates } from '../settings.js';

class Home {
  constructor(element, data) {
    const thisHome = this;

    thisHome.data = data;

    // thisHome.render(element);
    thisHome.render2(element);
  }

  render(wrapper) {
    const thisHome = this;

    thisHome.dom = {};

    this.dom.wrapper = wrapper;

    console.log(thisHome.data[0].image);
    const image = thisHome.data[0].image;

    const generatedHTML = templates.homeWidget(image);

    console.log(generatedHTML);

    thisHome.dom.wrapper.innerHTML = generatedHTML;
  }

  render2(wrapper) {
    const thisHome = this;

    thisHome.dom = {};

    console.log('thisHome.dom', thisHome.dom);

    this.dom.wrapper = wrapper;

    console.log('this.dom.wrapper', this.dom.wrapper);

    const tplHelloSource = document.querySelector('#template-home-widget').innerHTML;

    console.log('tplHelloSource', tplHelloSource);

    const tplHello = Handlebars.compile(tplHelloSource);

    console.log('tplHello', tplHello);

    const dataHello = thisHome.data;

    console.log('dataHello', dataHello);

    let generatedHTML = tplHello(dataHello);

    console.log('generatedHTML', generatedHTML);

    thisHome.dom.wrapper.innerHTML = generatedHTML;
  }
}

export default Home;