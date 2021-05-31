/*!
* Start Bootstrap - Landing Page v6.0.0 (https://startbootstrap.com/theme/landing-page)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-landing-page/blob/master/LICENSE)
*/
'use strict';

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartDOM = document.querySelector('.cart');
const addToCartButtonsDOM = document.querySelectorAll('[data-action="ADD_TO_CART"]');

if (cart.length > 0) {
    cart.forEach(product => {
        insertItemToDOM(product);
        countCartTotal();

        addToCartButtonsDOM.forEach(addToCartButtonDOM => {
            const productDOM = addToCartButtonDOM.parentNode;

            if (productDOM.querySelector('.product__name').innerText === product.name) {
                handleActionButtons(addToCartButtonDOM, product);
            }
        });
    });
}

addToCartButtonsDOM.forEach(addToCartButtonDOM => {
    addToCartButtonDOM.addEventListener('click', () => {
        const productDOM = addToCartButtonDOM.parentNode;
        const product = {
            name: productDOM.querySelector('.product__name').innerText,
            price: productDOM.querySelector('.product__price').innerText,
            quantity: 1
        };

        const isInCart = cart.filter(cartItem => cartItem.name === product.name).length > 0;
        // console.log(cart)
        if (!isInCart) {
            insertItemToDOM(product);
            cart.push(product);
            saveCart();
            handleActionButtons(addToCartButtonDOM, product);
        }
    });
});

// Function to Insert Item to DOM
function insertItemToDOM(product) {
    cartDOM.insertAdjacentHTML(
        'beforeend',
        `
    <div id="myForm" class="cart__item d-flex justify-content-between mb-4 my-2">
      <h3 class="cart__item__name" name="name">${product.name}</h3>
      <h3 class="cart__item__price" name="price">${product.price}</h3>
      <button class="btn btn-danger btn-sm" data-action="REMOVE_ITEM">&#10005;</button>
    </div>
  `
    );

    addCartFooter();
}

// Funtion to Handle Buttons in the cart
function handleActionButtons(addToCartButtonDOM, product) {
    addToCartButtonDOM.innerText = 'Ostukorvis';
    addToCartButtonDOM.disabled = true;

    const cartItemsDOM = cartDOM.querySelectorAll('.cart__item');
    cartItemsDOM.forEach(cartItemDOM => {
        if (cartItemDOM.querySelector('.cart__item__name').innerText === product.name) {
            cartItemDOM.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', () => removeItem(product, cartItemDOM, addToCartButtonDOM));
        }
    });
}

// Function to remove item from cart
function removeItem(product, cartItemDOM, addToCartButtonDOM) {
    console.log(cart)
    cartItemDOM.classList.add('cart__item--removed');
    setTimeout(() => cartItemDOM.remove(), 250);
    cart = cart.filter(cartItem => cartItem.name !== product.name);
    saveCart();
    addToCartButtonDOM.innerText = 'Lisa ostukorvi';
    // console.log(addToCartButtonDOM)
    addToCartButtonDOM.disabled = false;

    if (cart.length < 1) {
        document.querySelector('.cart-footer').remove();
    }
}

// Function to add cart footer
function addCartFooter() {
    if (document.querySelector('.cart-footer') === null) {
        cartDOM.insertAdjacentHTML(
            'afterend',
            `
      <div class="cart-footer d-flex justify-content-between">
        <button class="btn btn-danger btn-sm" data-action="CLEAR_CART">Clear Cart</button>
        <button class="btn btn-primary btn-sm" data-action="CHECKOUT">Pay</button>
      </div>
    `
        );

        document.querySelector('[data-action="CLEAR_CART"]').addEventListener('click', () => clearCart());
        document.querySelector('[data-action="CHECKOUT"]').addEventListener('click', () => checkout());
    }
}

function clearCart() {
    document.querySelectorAll('.cart__item').forEach(cartItemDOM => {
        cartItemDOM.classList.add('cart__item--removed');
        setTimeout(() => cartItemDOM.remove(), 250);
    });

    cart = [];
    localStorage.removeItem('cart');
    countCartTotal();
    document.querySelector('.cart-footer').remove();

    addToCartButtonsDOM.forEach(addToCartButtonDOM => {
        addToCartButtonDOM.innerText = 'Lisa ostukorvi';
        addToCartButtonDOM.disabled = false;
    });
}

function checkout() {
    let FormHTML = `
    <form id="paypal-form" action="" method="post">
      <input type="hidden" name="cmd" value="_cart">
      <input type="hidden" name="upload" value="1">
      <input type="hidden" name="business">
    `;

    cart.forEach((cartItem, index) => {
        ++index;
        FormHTML += `
        <input type="hidden" name="item_name_${index}" value="${cartItem.name}">
        <input type="hidden" name="amount_${index}" value="${cartItem.price}">
        <input type="hidden" name="quantity_${index}" value="${cartItem.quantity}">
      `;
    });

    FormHTML += `
      <input>
    </form>
    <div class="overlay"></div>
  `;

    document.querySelector('body').insertAdjacentHTML('beforeend', FormHTML);
    document.getElementById('paypal-form').submit();
}

// Function to calculate total amount
function countCartTotal() {
    let cartTotal = 0;
    cart.forEach(cartItem => (cartTotal += cartItem.quantity * cartItem.price));
    document.querySelector('[data-action="CHECKOUT"]').innerText = `Checkout`;
}

// Function to save cart on changes
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    countCartTotal();
}


