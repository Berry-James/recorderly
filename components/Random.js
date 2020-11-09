const Random = {

    generateRandomHome: () => {

        const homeTitle = document.querySelector("#main-title");
        const mainImg = document.querySelector("#main-img-id");
        const mobileImg = document.querySelector("#mobile-img-id");

        let randomNumber = Math.floor(Math.random() * 3);
        if(randomNumber == 1) {
            homeTitle.innerHTML = 'Renovate your Record Collection';
            mainImg.setAttribute('src', './imgs/svg/turntable2.svg');
            mobileImg.setAttribute('src', './imgs/svg/turntable2.svg');            
        }
        if(randomNumber == 2) {
            homeTitle.innerHTML = 'Cultivate your Cassette Collection';
            mainImg.setAttribute('src', './imgs/svg/casette.svg');
            mobileImg.setAttribute('src', './imgs/svg/casette.svg');            
        }
        if(randomNumber == 0) {
            homeTitle.innerHTML = 'Curate your CD Collection'
            mainImg.setAttribute('src', './imgs/svg/cd.svg');
            mobileImg.setAttribute('src', './imgs/svg/cd.svg');            
            mainImg.classList.add('main-cd-spin');
            mobileImg.classList.add('main-cd-spin');
        }
    }

}

export { Random }