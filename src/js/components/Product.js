import { select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
      constructor(id, data) {
        const thisProduct = this;
  
        thisProduct.id = id;
        thisProduct.data = data;
  
        thisProduct.renderInMenu();
        thisProduct.getElements();
        thisProduct.initAccordion();
        thisProduct.initOrderForm();
        thisProduct.initAmountWidget();
        thisProduct.processOrder();
      }
  
      renderInMenu() {
        const thisProduct = this;
  
        /*generate HTML based on template*/
        const generatedHTML = templates.menuProduct(thisProduct.data);
  
        /*create element using utils.createElementFromHTML*/
        thisProduct.element = utils.createDOMFromHTML(generatedHTML);
  
        /*find menu container*/
        const menuContainer = document.querySelector(select.containerOf.menu);
  
        /*add element to menu*/
        menuContainer.appendChild(thisProduct.element);
      }
  
      getElements() {//(REFERENCJE)
  
        const thisProduct = this;
  
        thisProduct.dom = {};
  
        thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
        thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
        thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);
        thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
        thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
        thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
        thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      }
  
      initAccordion() {
        const thisProduct = this;
  
        /* START: add event listener to clickable trigger on event click */
        thisProduct.dom.accordionTrigger.addEventListener('click',function (event) {
            /* prevent default action for event */
            event.preventDefault();
  
            /* find active product (product that has active class) */
            const activeProduct = document.querySelector('.product.active');
  
            /* if there is active product and it's not thisProduct.element, remove class active from it */
            if (activeProduct && activeProduct != thisProduct.element) {
              activeProduct.classList.remove(
                classNames.menuProduct.wrapperActive
              );
            }
  
            /* toggle active class on thisProduct.element */
            thisProduct.element.classList.toggle(
              classNames.menuProduct.wrapperActive
            );
          }
        );
      }
  
      initOrderForm() {
        const thisProduct = this;
        //console.log('initOrderForm:', thisProduct);
  
        thisProduct.dom.form.addEventListener('submit', function (event) {
          event.preventDefault();
          thisProduct.processOrder();
        });
  
        for (let input of thisProduct.dom.formInputs) {
          input.addEventListener('change', function () {
            thisProduct.processOrder();
          });
        }
  
        thisProduct.dom.cartButton.addEventListener('click', function (event) {
          event.preventDefault();
          thisProduct.processOrder();
          thisProduct.addToCart();
        });
      }
  
      processOrder() {
        const thisProduct = this;
  
        // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
        const formData = utils.serializeFormToObject(thisProduct.dom.form);
        console.log('formData', formData);
  
        // set price to default price
        let price = thisProduct.data.price;
  
        // for every category (param)...
        for (let paramId in thisProduct.data.params) {
          // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
          const param = thisProduct.data.params[paramId];
          console.log(paramId, param);
  
          // for every option in this category
          for (let optionId in param.options) {
            // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
            const option = param.options[optionId];
            console.log(optionId, option);
  
            const optionImage = thisProduct.dom.imageWrapper.querySelector(
              "." + paramId + "-" + optionId
            );
  
            // check if there is param with a name of paramId in formData and if it includes optionId
            if (formData[paramId] && formData[paramId].includes(optionId)) {
              // check if the option is not default
              if (!option.default) {
                // add option price to price variable
                price += option.price;
              }
              if (
                optionImage &&
                !optionImage.classList.contains(
                  classNames.menuProduct.imageVisible
                )
              ) {
                optionImage.classList.add(classNames.menuProduct.imageVisible);
              }
            } else {
              // check if the option is default
              if (option.default) {
                // reduce price variable
                price -= option.price;
              }
              if (
                optionImage &&
                optionImage.classList.contains(
                  classNames.menuProduct.imageVisible
                )
              ) {
                optionImage.classList.remove(classNames.menuProduct.imageVisible);
              }
            }
          }
        }
  
        // add calculated price as object property
  
        thisProduct.priceSingle = price;
  
        // multiply price by amount
        price *= thisProduct.amountWidget.value;
  
        // update calculated price in the HTML
        thisProduct.dom.priceElem.innerHTML = price;
      }
  
      initAmountWidget() {
        // METODA
        const thisProduct = this;
  
        thisProduct.amountWidget = new AmountWidget(
          thisProduct.dom.amountWidgetElem
        ); //INSTANCJA KLASY
        thisProduct.dom.amountWidgetElem.addEventListener('updated',function (event) {
            event.preventDefault();
  
            thisProduct.processOrder();
          }
        );
      }
  
      addToCart() {
        const thisProduct = this;
     
        //  app.cart.add(thisProduct.prepareCartProduct());
        const event = new CustomEvent('add-to-cart', {
          bubbles: true,
          detail: {
            product: thisProduct.prepareCartProduct(),
          },
        }
        );
        thisProduct.element.dispatchEvent(event);
      }
  
      prepareCartProduct() {
        const thisProduct = this;
  
        const productSummary = {};
  
        productSummary.id = thisProduct.id;
        productSummary.name = thisProduct.data.name;
        productSummary.amount = thisProduct.amountWidget.value;
        productSummary.priceSingle = thisProduct.priceSingle;
        productSummary.price =
          productSummary.priceSingle * thisProduct.amountWidget.value;
        productSummary.params = thisProduct.prepareCartProductParams();
  
        return productSummary;
      }
  
      prepareCartProductParams() {
        const thisProduct = this;
  
        const formData = utils.serializeFormToObject(thisProduct.dom.form);
        const params = {};
  
        // for very category (param)
        for (let paramId in thisProduct.data.params) {
          const param = thisProduct.data.params[paramId];
  
          // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
          params[paramId] = {
            label: param.label,
            options: {},
          };
  
          // for every option in this category
          for (let optionId in param.options) {
            const option = param.options[optionId];
            const optionSelected =
              formData[paramId] && formData[paramId].includes(optionId);
  
            if (optionSelected) {
              // option is selected!
              params[paramId].options[optionId] = option.label;
            }
          }
        }
  
        return params;
      }
}

export default Product;
