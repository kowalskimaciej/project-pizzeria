import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';


class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);

    const thisWidget = this;

    this.getElements(element);

    thisWidget.initActions();

  }

  getElements() {
    const thisWidget = this;
  
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.input.value = settings.amountWidget.defaultValue;
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);

  }

  isValid(value) {
    return !isNaN(value) 
    && value >= settings.amountWidget.defaultMin
    && value <= settings.amountWidget.defaultMax;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    const customEvent = new CustomEvent('change', {
      bubbles: true,
      cancelable: true,
      composed: false,
    });

    thisWidget.dom.input.addEventListener('change', function(event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.dom.input.value);
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(event) {
      event.preventDefault();

      const currentValue = thisWidget.value;

      thisWidget.setValue(thisWidget.value - 1);

      if (currentValue !== thisWidget.value) {
        thisWidget.dom.input.dispatchEvent(customEvent);
      }
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(event) {
      event.preventDefault();

      const currentValue = thisWidget.value;

      thisWidget.setValue(thisWidget.value + 1);
      
      if (currentValue !== thisWidget.value) {
        thisWidget.dom.input.dispatchEvent(customEvent);
      }
    });
  }
}

export default AmountWidget;