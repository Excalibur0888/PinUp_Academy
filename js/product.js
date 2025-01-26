document.addEventListener('DOMContentLoaded', function() {
    // Получаем параметры товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const price = urlParams.get('price');
    const image = urlParams.get('image');
    
    // Функция обновления UI товара
    function updateProductUI() {
        if (!title || !price || !image) {
            console.error('Не все параметры товара переданы');
        return;
    }

        // Обновляем заголовок страницы
        document.title = `${title} - PIN-UP Academy`;

        // Обновляем основную информацию
        document.querySelector('.product__title').textContent = title;
        document.querySelector('.product__price').textContent = `${price} ₽`;

        // Обновляем изображение
        const productImage = document.querySelector('.product__slide img');
        productImage.src = image;
        productImage.alt = title;
            }


    // Обработчик добавления в корзину
    const addToCartButton = document.querySelector('.product__add-to-cart');
    addToCartButton.addEventListener('click', function() {
        if (!window.canAddToCart()) return;

        const productData = {
            title: title,
            price: `${price} ₽`,
            image: image,
            quantity: 1
        };

        const user = getCurrentUser();
        let cart = getUserCart(user.id);
        
        const existingItemIndex = cart.findIndex(item => 
        item.title === productData.title
        );

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(productData);
        }

        saveUserCart(user.id, cart);

        // Добавляем класс для анимации
        this.classList.add('added');
        
        // Меняем текст кнопки
        const btnText = this.querySelector('.btn-text');
        btnText.textContent = 'Добавлено';
        
        // Через 2 секунды возвращаем кнопку в исходное состояние
        setTimeout(() => {
            this.classList.remove('added');
            btnText.textContent = 'Добавить в корзину';
        }, 2000);
    });

    // Обработчик добавления в избранное
    const favoriteButton = document.querySelector('.product__favorite');
    favoriteButton.addEventListener('click', function() {
        if (!window.canAddToFavorites()) return;

        const productData = {
            title: title,
            price: `${price} ₽`,
            image: image
        };

        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const existingItemIndex = favorites.findIndex(item => item.title === productData.title);

        if (existingItemIndex !== -1) {
            favorites.splice(existingItemIndex, 1);
            this.classList.remove('active');
        } else {
            favorites.push(productData);
            this.classList.add('active');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        });

    // Проверяем, есть ли товар в избранном при загрузке страницы
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.some(item => item.title === title)) {
        favoriteButton.classList.add('active');
    }

    // Обработчики для кнопок корзины в секции рекомендуемых товаров
    const relatedProductButtons = document.querySelectorAll('.suggestions .suggestions__btn');
    relatedProductButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!window.canAddToCart()) return;

            const productCard = this.closest('.suggestions__item');
            const productData = {
                id: parseInt(productCard.dataset.productId),
                title: productCard.querySelector('.suggestions__title').textContent,
                price: productCard.querySelector('.suggestions__price').textContent,
                image: productCard.querySelector('img').src,
                quantity: 1
            };

            const user = getCurrentUser();
            let cart = getUserCart(user.id);
            
            const existingItemIndex = cart.findIndex(item => item.id === productData.id);

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(productData);
            }

            saveUserCart(user.id, cart);

            // Визуальное подтверждение
            this.textContent = 'Добавлено ✓';
            this.classList.add('added');
            
            setTimeout(() => {
                this.textContent = 'В корзину';
                this.classList.remove('added');
            }, 2000);
        });
    });

    // Инициализируем страницу
    updateProductUI();
}); 
