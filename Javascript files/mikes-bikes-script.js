//defining all the necessary variables
let carts = document.querySelectorAll('.add-cart');
let promoCode;
let promoPrice;
let shipping;
let shippingPrice;
let promo = $('promo-value').text();
let promoNum = +promo;
let shippingAmount = $('shipping-value').text();
let shippingNum = +shippingAmount;
let total;
let newTotal = +total;


//defining the products as objects in an array
let products = [{
        name: 'Aethos',
        tag: 'bike1',
        price: 180000,
        inCart: 0
    },
    {
        name: 'Tarmac',
        tag: 'bike2',
        price: 100000,
        inCart: 0
    },
    {
        name: 'Tarmac SL7',
        tag: 'bike3',
        price: 80000,
        inCart: 0
    },
    {
        name: 'Diverge',
        tag: 'bike4',
        price: 70000,
        inCart: 0
    },
    {
        name: 'Diverge Comp',
        tag: 'bike5',
        price: 50000,
        inCart: 0
    },
    {
        name: 'Allez Sprint',
        tag: 'bike6',
        price: 30000,
        inCart: 0
    },
    {
        name: 'Roubaix',
        tag: 'bike7',
        price: 800000,
        inCart: 0
    },
    {
        name: 'Epic Evo',
        tag: 'bike8',
        price: 100000,
        inCart: 0
    },
    {
        name: 'Chisel',
        tag: 'bike9',
        price: 45000,
        inCart: 0
    },
    {
        name: 'Rockhopper',
        tag: 'bike10',
        price: 23000,
        inCart: 0
    },
]

// a loop to work out how many times the add to cart button has been presed
for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
}

//a function to add the number of items in the cart to local storage and to the cart link in the nav bar
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}


function cartNumbers(product) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}

//setting the cart items in local storage
function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    if (cartItems != null) {
        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }
    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

// working out the total cost in local storage
function totalCost(product) {

    let cartCost = localStorage.getItem('totalCost');

    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price);
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

// a function setup to display the products in the cart
function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector(".products");
    let cartCost = localStorage.getItem('totalCost');
    cartCost = JSON.parse(cartCost);

    //placing the image, name, price, qauntity and total in the cart
    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
           <div class="product"> 
                <img src ="images/${item.tag}.jpg">
                <span>${item.name}</span>
           </div>    
           <div class="price">R${item.price}</div>
           <div class="quantities">
           <span>${item.inCart}</span>
           </div>
           <div class="total">
               R${item.inCart * item.price}
           </div>
           `;
        });

        //working out the vat to be added later
        let vat = (cartCost) / 100 * 15

        // a jQuery function to verify the promo codes(USE 1000off AS 'DEMO' PROMOCODE)
        $('.promo-code-cta').click(function () {
            promoCode = $('#promo-code').val();
            if (promoCode == '1000off' || promoCode == '1000OFF') {
                if (!promoPrice) {
                    promoPrice = 1000;
                } else if (promoCode) {
                    promoPrice = promoPrice * 1;
                }
            } else if (promoCode != '') {
                alert("Invalid Promo Code");
                promoPrice = 0;
            }
            if (promoPrice) {
                $('.summary-promo').removeClass('hide');
                $('.promo-value').text(promoPrice);
            }
        });

        // a jQuery function to validate and assign an amount to the shipping
        $('.shipping-cta').click(function () {
            shipping = $('#shipping').val();
            if (shipping == 'shipping') {
                if (!shippingPrice) {
                    shippingPrice = 250;
                } else if (shipping) {
                    shippingPrice = shippingPrice * 1;
                }
            } else if (shipping == 'select') {
                alert("Please select a shipping method");
                shippingPrice = 0;
            } else if (shipping == 'collection') {
                alert("You  will be notified once your order is ready for collection");
                shippingPrice = 0;
            }
            if (shippingPrice) {
                $('.summary-shipping').removeClass('hide');
                $('.shipping-value').text(shippingPrice);
            }

        });

        // making a new "total" from which the promo will be deducted and the shipping will be added
        total = $('.final-value').text(cartCost + vat);

        // a jQuery function to work out the new total after promo and shipping has been applied
        $('.submit-cta').click(function () {
            promoCode = $('#promo-code').val();
            shipping = $('#shipping').val();
            if (promoCode == '1000off' || promoCode == '1000OFF') {
                newTotal = $('.final-value').text(cartCost + vat - 1000);
            }
            if (shipping == 'shipping') {
                newTotal = $('.final-value').text(cartCost + vat + 250);
            }
            if (promoCode == '1000off' || promoCode == '100OFF' && shipping == 'collection') {
                newTotal = $('.final-value').text(cartCost + vat - 1000);
            }
            if (promoCode == '1000off' && shipping == 'shipping') {
                newTotal = $('.final-value').text(cartCost + vat - 1000 + 250);
            }

        });

        // the "Basket total" is inserted into the html
        productContainer.innerHTML += `
            <div class="basketTotalContainer">
            <h4 class="basketTotalTitle">
                Basket Total
                <span class="vat">incl. VAT</span>
            </h4> 
            
            <h4 class="basketTotal">
                R${cartCost + vat}.00
            </h4> 
            </div>    
        `

    }

    //a function that creates an alert which displays the basket total when the 'add to cart' buttons are pressed
    for (let i = 0; i < carts.length; i++) {
        carts[i].addEventListener('click', () => {
                let cartCost = localStorage.getItem('totalCost');
                cartCost = JSON.parse(cartCost);
                let vat = (cartCost) / 100 * 15
                let answer = confirm("your total including VAT is: R" + (cartCost + vat) +
                    ". Click OK to view your cart. Click cancel to continue shopping")
                if (answer)
                    window.location = "Cart.html";
            }

        )
    }

    // a jQuery function that creates an alert to confirm a customers order when the checkout button is clicked. it also uses "Math" methods to generate a different refernce number for each order
    $('.checkout-cta').click(function () {
        alert("thank you for your order, your reference number is: " + Math.floor(Math.random() * 10000));
    });


    // a jQuery toggle function that hides/shows the brands on the home page, the buttons text also changes each time it is clicked. this is a function with chained effects as it toggles the images and changes the button.
    $('.show-brands-cta').click(function () {
        $('.brands').toggle();
        $('.show-brands-cta').html($('.show-brands-cta').html() == 'Hide Brands' ? 'Show Brands' : 'Hide Brands')
    });

    //a jQuery function that animates a drop down menu in an accordian style
    $(document).ready(function () {
        $("#accordion > li > div").mouseenter(function () {

            if (false == $(this).next().is(':visible')) {
                $('#accordion ul').slideUp(400);
            }
            $(this).next().slideToggle(400);
        });
    });

}

//calling the necessary functions
onLoadCartNumbers();
displayCart();