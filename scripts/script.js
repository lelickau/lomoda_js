const headerCityButton = document.querySelector('.header__city-button');

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

headerCityButton.addEventListener('click', (e) => {
    const city = prompt('Укадите ваш город');
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
})

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

subheaderCart.addEventListener('click', modalOpen);

cardOverlay.addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        modalClose();
    }

    // или
    /* if (target.classList.contains('cart__btn-close') || target.classList.contains('cart-overlay')) {
        modalClose();
    } */
})

document.addEventListener('keydown', (e) => {
    if(e.code == "Escape") modalClose();
})
