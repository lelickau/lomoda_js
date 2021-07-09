const headerCityButton = document.querySelector('.header__city-button');
let hash = location.hash.substring(1);
const cardListGoods = document.querySelector('.cart__list-goods');

const renderCart = () => {
    cardListGoods.textContent = '';
    const cartItems = getLocalStorage();

    let totalPrice = 0; 

    cartItems.forEach((item, i) => {
        const {id, color, name, cost, brand, size} = item;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${++i}</td>
            <td>${brand} ${name}</td>
            ${color ? `<td>${color}</td>` : `<td>-</td>`}
            ${size ? `<td>${size}</td>` : `<td>-</td>`}
            <td>${cost} &#8381;</td>
            <td><button class="btn-delete" data-id="${id}">&times;</button></td>
        `;
        totalPrice += cost;

        cardListGoods.append(tr);
    });

    const cartTotalCost = document.querySelector('.cart__total-cost');
    cartTotalCost.textContent = `${totalPrice.toFixed(2)} ₽`;
}



const deleteItemeCart = (id) => {
    const cartItem = getLocalStorage();
    const newCartItem = cartItem.filter(item => item.id !== id);
    setLocalStorage(newCartItem);
}

cardListGoods.addEventListener('click', (e) => {
    if (e.target.matches('.btn-delete')) {
        deleteItemeCart(e.target.dataset.id);
        renderCart();
        const cardGoodBuy = document.querySelector('.card-good__buy');
        cardGoodBuy.classList.remove('delete');
        cardGoodBuy.textContent = 'Добавить в корзину';
    }
});

const getLocalStorage = () => JSON?.parse(localStorage.getItem('cart-lomoda')) || [];
const setLocalStorage = data => localStorage.setItem('cart-lomoda', JSON.stringify(data));

// scroll block
const disableScroll = () => {
    if (document.disableScroll) return;
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.disableScroll = true;
    document.body.dbScrollY = window.scrollY;
    document.body.style.cssText = `
        possition: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px;
    `;
}

const enebleScroll = () => {
    document.disableScroll = false;
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY,
    })
}

const updateLocation = () => {
    const isLocation = localStorage.getItem('lomoda-location');
    headerCityButton.textContent = isLocation && isLocation !== 'null' ? isLocation : 'Ваш город?';
}

const rememberCity = (e) => {
    const city = prompt('Укадите ваш город').trim();
    if (city !== null) {
        localStorage.setItem('lomoda-location', city);
    }

    updateLocation();
}
updateLocation();

//modal
const subheaderCart = document.querySelector('.subheader__cart');
const cardOverlay = document.querySelector('.cart-overlay');

const modalOpen = (e) => {
    disableScroll();
    cardOverlay.classList.add('cart-overlay-open');
    renderCart();
}

const modalClose = (e) => {
    enebleScroll();
    cardOverlay.classList.remove('cart-overlay-open');
}

const closeModalIfTargetTrue = (e) => {
    const target = e.target;
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        modalClose();
    }

    // или
    /* if (target.classList.contains('cart__btn-close') || target.classList.contains('cart-overlay')) {
        modalClose();
    } */
}

const closeModalESC = (e) => {
    if(e.code == "Escape") modalClose();
}

//server

const getData = async () => {
    const data = await fetch('db.json');
    if(data.ok) {
        return data.json()
    } else {
        throw new Error(`Данные не получены, ошибка ${data.status}, ${data.statusText}`);
    }
}

const getGoods = (cb, prop, hash) => {
    getData()
    .then(data => {
        if(hash) {
            cb(data.filter(item => item[prop] === hash))
        } else {
            cb(data)
        }
        
    })
    .catch(err => {
        console.error(err)
    })
}

//goods
try {
    const goodsList = document.querySelector('.goods__list');

    if (!goodsList) {
        throw `not a good page`;
    }

    const goodsTitle =  document.querySelector('.goods__title');

    const changeTitle = () => {
        const title = document.querySelector(`[href*='${location.hash}']`);
        goodsTitle.textContent = title.textContent;
    }

    const createCard = ({id, photo, name, cost, brand, sizes}) => {
        const li = document.createElement('li');
        li.classList.add('goods__item');
        li.innerHTML = `
            <article class="good">
                <a class="good__link-img" href="card-good.html#id${id}">
                    <img class="good__img" src="goods-image/${photo}" alt="${name}">
                </a>
                <div class="good__description">
                    <p class="good__price">${cost} &#8381;</p>
                    <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                    ${sizes ? 
                        `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` : 
                    ''}
                    <a class="good__link" href="card-good.html#id${id}">Подробнее</a>
                </div>
            </article>
        `;
        return li;
    }

    const renderGoodsList = (data) => {
        goodsList.textContent = '';

        data.forEach(item => {
            const card = createCard(item);
            goodsList.append(card);
        });
        
    }

    window.addEventListener('hashchange', (e) => {
        hash = location.hash.substring(1);
        changeTitle();
        getGoods(renderGoodsList, 'category', hash);
    });

    changeTitle();

    getGoods(renderGoodsList, 'category', hash);

} catch (error) {
    console.log(error)
}

//product
try {
    if(!document.querySelector('.card-good')) {
        throw 'not a card-good';
    }

    const cardGoodImage = document.querySelector('.card-good__image');
    const cardGoodBrand = document.querySelector('.card-good__brand');
    const cardGoodTitle = document.querySelector('.card-good__title');
    const cardGoodColor = document.querySelector('.card-good__color');
    const cardGoodPrice = document.querySelector('.card-good__price');
    const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
    const cardGoodColorList = document.querySelector('.card-good__color-list');
    const cardGoodSizes = document.querySelector('.card-good__sizes');
    const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
    const cardGoodBuy = document.querySelector('.card-good__buy');

    const generateList = (items) => items.reduce((html, item, i) => 
    html + `<li class="card-good__select-item data-id='${i}">${item}</li>`
    , '')

    const renderGoodCard = ([{id, color, photo, name, cost, brand, sizes}]) => {

        const data = {id, color, name, cost, brand}

        cardGoodImage.src = `goods-image/${photo}`;
        cardGoodImage.alt = `${name} ${brand}`;
        cardGoodBrand.textContent = brand;
        cardGoodTitle.textContent = name;
        cardGoodPrice.textContent = `${cost} ₽`;

        if (color) {
            cardGoodColor.textContent = color[0];
            cardGoodColor.dataset.id = 0;
            cardGoodColorList.innerHTML = generateList(color);
        } else {
            cardGoodColor.style.display = 'none';
        }
        if (sizes) {
            cardGoodSizes.textContent = sizes[0];
            cardGoodSizes.dataset.id = 0;
            cardGoodSizesList.innerHTML = generateList(sizes);
        } else {
            cardGoodSizes.style.display = 'none';
        }

        if (getLocalStorage().some(item => item.id === id)) {
            cardGoodBuy.classList.add('delete');
            cardGoodBuy.textContent = 'Удалить из корзины';
        }
        cardGoodBuy.addEventListener('click', () => {
            if (cardGoodBuy.classList.contains('delete')) {
                deleteItemeCart(id);
                cardGoodBuy.classList.remove('delete');
                cardGoodBuy.textContent = 'Добавить в корзину';
                return;
            }
            if (color) data.color = cardGoodColor.textContent;
            if (sizes) data.size = cardGoodSizes.textContent;

            cardGoodBuy.classList.add('delete');
            cardGoodBuy.textContent = 'Удалить из корзины';

            const cardData = getLocalStorage();
            cardData.push(data);
            setLocalStorage(cardData);
        });
    }

    cardGoodSelectWrapper.forEach(item => {
        item.addEventListener('click', e => {
            const target = e.target;
            if (target.closest('.card-good__select')) {
                target.classList.toggle('card-good__select__open');
            }
            if (target.closest('.card-good__select-item')) {
                const cardGoodSelect = item.querySelector('.card-good__select');
                cardGoodSelect.textContent = target.textContent;
                cardGoodSelect.dataset.id = target.dataset.id;
                cardGoodSelect.classList.remove('card-good__select__open');
            }
        })
    });

    getGoods(renderGoodCard, 'id', hash.substring(2));

} catch (error) {
    console.log(error);
}


// events
headerCityButton.addEventListener('click', rememberCity); // city

subheaderCart.addEventListener('click', modalOpen); // open modal
cardOverlay.addEventListener('click', closeModalIfTargetTrue); // close modal 
document.addEventListener('keydown', closeModalESC); // close modal esc

