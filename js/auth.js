// Функции для работы с localStorage
const AUTH_KEY = 'pinup_auth';
const USERS_KEY = 'pinup_users';
const CART_KEY = 'pinup_cart_';
const FAVORITES_KEY = 'favorites';

// Глобальные функции для проверки авторизации
window.canAddToCart = function() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

window.canAddToFavorites = function() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

window.canAccessCart = function() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

// Делаем функцию logout глобально доступной
window.logout = function() {
    const user = getCurrentUser();
    if (user) {
        // Очищаем все данные пользователя
        clearUserCart(user.id);
        clearUserFavorites(user.id);
        localStorage.removeItem(AUTH_KEY);
    }
    window.location.href = 'login.html';
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
}

function setCurrentUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

// Функции для работы с корзиной
function getUserCart(userId) {
    return JSON.parse(localStorage.getItem(CART_KEY + userId) || '[]');
}

function saveUserCart(userId, cart) {
    localStorage.setItem(CART_KEY + userId, JSON.stringify(cart));
}

function clearUserCart(userId) {
    localStorage.removeItem(CART_KEY + userId);
}

// Функции для работы с избранным
function getUserFavorites(userId) {
    const favorites = localStorage.getItem(`favorites_${userId}`);
    const parsedFavorites = favorites ? JSON.parse(favorites) : [];
    return parsedFavorites;
}

function saveUserFavorites(userId, favorites) {
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
}

function clearUserFavorites(userId) {
    localStorage.removeItem(FAVORITES_KEY + '_' + userId);
}

// Проверка авторизации
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Перенаправление на страницу входа
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Обработка формы регистрации
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = registerForm.querySelector('input[name="name"]')?.value;
            const email = registerForm.querySelector('input[name="email"]')?.value;
            const password = registerForm.querySelector('input[name="password"]')?.value;
            const confirmPassword = registerForm.querySelector('input[name="password_confirm"]')?.value;

            if (!name || !email || !password || !confirmPassword) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            if (password !== confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }

            const users = getUsers();
            
            if (users.some(user => user.email === email)) {
                alert('Пользователь с таким email уже существует');
                return;
            }

            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            saveUsers(users);
            setCurrentUser(newUser);
            window.location.href = 'account.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[name="email"]')?.value;
            const password = loginForm.querySelector('input[name="password"]')?.value;

            if (!email || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                setCurrentUser(user);
                window.location.href = 'account.html';
            } else {
                alert('Неверный email или пароль');
            }
        });
    }
});

// Проверка авторизации на защищенных страницах
function checkAuth() {
    const protectedPages = ['account.html', 'cart.html'];
    const currentPath = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPath) && !isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

// Обработка кнопок, требующих авторизации
function handleAuthButtons() {
    // Обработка кнопок корзины
    const addToCartButtons = document.querySelectorAll('.product__add-to-cart, .product-card__btn');
    addToCartButtons.forEach(button => {
        const originalClick = button.onclick; // Сохраняем оригинальный обработчик
        button.onclick = function(e) {
            if (!canAddToCart()) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };
    });

    // Обработка кнопок избранного
    const favoriteButtons = document.querySelectorAll('.product__favorite, .product-card__favorite');
    favoriteButtons.forEach(button => {
        const originalClick = button.onclick; // Сохраняем оригинальный обработчик
        button.onclick = function(e) {
            if (!canAddToFavorites()) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };
    });

    // Обработка ссылок на корзину
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    cartLinks.forEach(link => {
        link.onclick = function(e) {
            if (!canAccessCart()) {
                e.preventDefault();
                return false;
            }
        };
    });

    // Удаляем все остальные обработчики событий с этих кнопок, если пользователь не авторизован
    if (!isAuthenticated()) {
        addToCartButtons.forEach(button => {
            button.classList.remove('added');
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            newButton.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                redirectToLogin();
                return false;
            };
        });

        favoriteButtons.forEach(button => {
            button.classList.remove('active');
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            newButton.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                redirectToLogin();
                return false;
            };
        });
    }
}

// Обновление UI в зависимости от статуса авторизации
function updateAuthUI() {
    const user = getCurrentUser();
    const authLinks = document.querySelectorAll('.auth-links');

    authLinks.forEach(container => {
        if (user) {
            container.innerHTML = `
                <span class="user-name">${user.name}</span>
                <button onclick="logout()" class="btn-link">Выйти</button>
            `;
        } else {
            container.innerHTML = `
                <a href="login.html">Войти</a>
                <a href="register.html">Регистрация</a>
            `;
        }
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    handleAuthButtons();
    updateAuthUI();
});

class Auth {
    constructor() {
        this.init();
    }

    init() {
        this.initForms();
    }

    initForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = loginForm.querySelector('input[type="email"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;

                if (!email || !password) {
                    showToast('Пожалуйста, заполните все поля', 'error');
                    return;
                }

                // В реальном приложении здесь был бы запрос к API
                showToast('Вход выполнен успешно!', 'success');
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1000);
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = registerForm.querySelector('input[type="email"]').value;
                const password = registerForm.querySelector('input[type="password"]').value;
                const confirmPassword = registerForm.querySelector('input[name="confirm-password"]').value;

                if (!email || !password || !confirmPassword) {
                    showToast('Пожалуйста, заполните все поля', 'error');
                    return;
                }

                if (password !== confirmPassword) {
                    showToast('Пароли не совпадают', 'error');
                    return;
                }

                // В реальном приложении здесь был бы запрос к API
                showToast('Регистрация выполнена успешно!', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            });
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Auth();
}); 