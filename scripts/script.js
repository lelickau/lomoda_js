const headerCityButton = document.querySelector('.header__city-button');
let hash = location.hash.substring(1);
if (hash === 'men') document.querySelector('.goods__title').textContent = 'Мужчинам';
if (hash === 'women') document.querySelector('.goods__title').textContent = 'Женщинам';
if (hash === 'kids') document.querySelector('.goods__title').textContent = 'Детям';
headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

// scroll block
const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth;
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

const rememberCity = (e) => {
    const city = prompt('Укадите ваш город');
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
}

const enebleScroll = () => {
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY,
    })
}

//modal
const subheaderCart = document.querySelector('.subheader__cart');
const cardOverlay = document.querySelector('.cart-overlay');

const modalOpen = (e) => {
    disableScroll();
    cardOverlay.classList.add('cart-overlay-open');
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
        throw new Error(`Данные не получены, ошибка ${data.status}, ${data.statusText}`)
    }
}

const getGoods = (cb, hash) => {
    getData()
    .then(data => {
        if(hash) {
            cb(data.filter(item => item.category === hash))
        } else {
            cb(data)
        }
        
    })
    .catch(err => {
        console.error(err)
    })
}

try {
    const goodsList = document.querySelector('.goods__list');

    if (!goodsList) {
        throw `not a good page`;
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
        `
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
        if (hash === 'men') document.querySelector('.goods__title').textContent = 'Мужчинам';
        if (hash === 'women') document.querySelector('.goods__title').textContent = 'Женщинам';
        if (hash === 'kids') document.querySelector('.goods__title').textContent = 'Детям';

        getGoods(renderGoodsList, hash);
    })

    getGoods(renderGoodsList, hash);
} catch (error) {
    console.log(error)
}


// events
headerCityButton.addEventListener('click', rememberCity); // city

subheaderCart.addEventListener('click', modalOpen); // open modal
cardOverlay.addEventListener('click', closeModalIfTargetTrue); // close modal 
document.addEventListener('keydown', closeModalESC); // close modal esc

