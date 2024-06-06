import { settings, select } from '../settings';

class AmountWidget {
      constructor(element) {
        const thisWidget = this;
  
        console.log('AmountWidget:', thisWidget);
        console.log('Constructor arguments:', element);
  
        thisWidget.getElements(element);
  
        thisWidget.setValue(
          thisWidget.input.value
            ? thisWidget.input.value
            : settings.amountWidget.defaultValue
        );
  
        thisWidget.initActions();
      }
  
      getElements(element) {
        const thisWidget = this;
  
        thisWidget.element = element;
        thisWidget.input = thisWidget.element.querySelector(
          select.widgets.amount.input
        );
        thisWidget.linkDecrease = thisWidget.element.querySelector(
          select.widgets.amount.linkDecrease
        );
        thisWidget.linkIncrease = thisWidget.element.querySelector(
          select.widgets.amount.linkIncrease
        );
      }
  
      setValue(value) {
        const thisWidget = this;
  
        const newValue = parseInt(value);
        const isGreaterThanMin = settings.amountWidget.defaultMin <= newValue;
        const isLessThanMax = settings.amountWidget.defaultMax >= newValue;
  
        // TO DO: Add validation
  
        if (
          thisWidget.value !== newValue &&
          !isNaN(newValue) &&
          isGreaterThanMin &&
          isLessThanMax
        ) {
          thisWidget.value = newValue;
        }
  
        thisWidget.announce();
        thisWidget.input.value = thisWidget.value;
      }
  
      initActions() {
        const thisWidget = this;
  
        thisWidget.input.addEventListener('change', function (event) {
          event.preventDefault();
  
          thisWidget.setValue(thisWidget.input.value);
        });
  
        thisWidget.linkDecrease.addEventListener('click', function (event) {
          event.preventDefault();
  
          thisWidget.setValue(thisWidget.value - 1);
        });
  
        thisWidget.linkIncrease.addEventListener('click', function (event) {
          event.preventDefault();
  
          thisWidget.setValue(thisWidget.value + 1);
        });
      }
  
      announce() {
        const thisWidget = this;
  
        const event = new CustomEvent("updated", {
          bubbles: true,
        });
  
        thisWidget.element.dispatchEvent(event);
      }
}

export default AmountWidget;