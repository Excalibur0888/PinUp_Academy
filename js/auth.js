// Функции для работы с локальным хранилищем
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'user';
const TOKEN_KEY = 'token';

function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    try {
        const userJson = localStorage.getItem(CURRENT_USER_KEY);
        if (!userJson) {
            return null;
        }
        const user = JSON.parse(userJson);
        // Проверяем, что у пользователя есть все необходимые поля
        if (!user || !user.id || !user.email) {
            localStorage.removeItem(CURRENT_USER_KEY);
            return null;
        }
        return user;
    } catch (error) {
        localStorage.removeItem(CURRENT_USER_KEY);
        return null;
    }
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
}

// Функции для проверки авторизации
function isAuthenticated() {
    const user = getCurrentUser();
    return user !== null;
}

function redirectToLogin() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage !== 'login.html' && currentPage !== 'register.html') {
        window.location.href = 'login.html';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    
    // Проверяем авторизацию на защищенных страницах
    const protectedPages = ['account.html', 'cart.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isAuthenticated = getCurrentUser() !== null;
    if (protectedPages.includes(currentPage) && !isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Обновляем UI
    updateAuthUI();

    // Инициализируем формы
    initForms();
    
});

// Обновление UI в зависимости от статуса авторизации
function updateAuthUI() {
    const loginLinks = document.querySelectorAll('.login-link');
    const profileLinks = document.querySelectorAll('.profile-link');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        // Если пользователь авторизован
        loginLinks.forEach(link => link.style.display = 'none');
        profileLinks.forEach(link => {
            link.style.display = 'flex';
            link.href = 'account.html';
            if (link.textContent.trim() === 'Профиль') {
                link.textContent = user.name || 'Профиль';
            }
        });
    } else {
        // Если пользователь не авторизован
        loginLinks.forEach(link => link.style.display = 'flex');
        profileLinks.forEach(link => {
            link.style.display = 'none';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'login.html';
            });
        });
    }
}

// Инициализация форм
function initForms() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Обработка регистрации
async function handleRegister(e) {
    e.preventDefault();

    const nameInput = document.querySelector('#registerForm input[name="name"]');
    const emailInput = document.querySelector('#registerForm input[name="email"]');
    const passwordInput = document.querySelector('#registerForm input[name="password"]');
    const confirmPasswordInput = document.querySelector('#registerForm input[name="confirmPassword"]');
    const termsCheckbox = document.querySelector('#registerForm input[name="terms"]');

    // Проверяем наличие всех полей
    if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput || !termsCheckbox) {
        alert('Ошибка: не все поля формы найдены');
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Валидация полей
    if (!name || !email || !password || !confirmPassword) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    if (!termsCheckbox.checked) {
        alert('Необходимо принять условия использования');
        return;
    }

    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const users = getUsers();
    if (users.some(user => user.email === email)) {
        alert('Пользователь с таким email уже существует');
        return;
    }

    // Создаем нового пользователя
    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };

    // Генерируем простой токен (в реальном приложении это должно делаться на сервере)
    const token = btoa(email + ':' + Date.now());

    // Сохраняем пользователя и токен
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_KEY, token);

    // Перенаправляем на страницу аккаунта
    window.location.href = 'account.html';
}

// Обработка входа
async function handleLogin(e) {
    e.preventDefault();

    const emailInput = document.querySelector('#loginForm input[name="email"]');
    const passwordInput = document.querySelector('#loginForm input[name="password"]');

    // Проверяем наличие полей
    if (!emailInput || !passwordInput) {
        alert('Ошибка: не все поля формы найдены');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Валидация полей
    if (!email || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    // Проверяем учетные данные
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Неверный email или пароль');
        return;
    }

    // Генерируем простой токен (в реальном приложении это должно делаться на сервере)
    const token = btoa(email + ':' + Date.now());

    // Устанавливаем текущего пользователя и токен
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);

    // Перенаправляем на страницу аккаунта
    window.location.href = 'account.html';
}

// Выход из системы
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = 'index.html';
}

// Функции для проверки доступа к определенным действиям
function canAddToCart() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

function canAddToFavorites() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

function canAccessCart() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
} 