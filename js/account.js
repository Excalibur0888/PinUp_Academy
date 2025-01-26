// Импортируем данные курсов
const coursesData = {
    'digital-marketing': {
        id: 'digital-marketing',
        badge: 'Маркетинг',
        title: 'Digital-маркетинг PRO',
        description: 'Комплексный курс по digital-маркетингу: от стратегии до аналитики',
        level: 'Продвинутый',
        duration: '12 недель',
        students: '94 студента',
        image: 'img/digital-marketing.jpg',
        progress: {
            completed: 8,
            total: 36,
            percentage: 22
        }
    },
    'web-design': {
        id: 'web-design',
        badge: 'Дизайн',
        title: 'Основы веб-дизайна',
        description: 'Создавайте современные веб-сайты и приложения с нуля',
        level: 'Начальный',
        duration: '10 недель',
        students: '142 студента',
        image: 'img/web-design.jpg',
        progress: {
            completed: 4,
            total: 30,
            percentage: 13
        }
    },
    'finance-basics': {
        id: 'finance-basics',
        badge: 'Финансы',
        title: 'Финансовая грамотность',
        description: 'Научитесь управлять личными финансами и создавать пассивный доход',
        level: 'Начальный',
        duration: '8 недель',
        students: '156 студентов',
        image: 'img/finance-basics.jpg',
        progress: {
            completed: 24,
            total: 24,
            percentage: 100
        }
    }
};

class Account {
    constructor() {
    // Проверяем авторизацию
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }

        this.user = user;
        this.initDashboard();
        this.initLogout();
        this.updateProfileInfo();
        this.initNavigation();
        this.initProfileSettings();
    }

    initDashboard() {
        // Получаем курсы пользователя
        const userCourses = this.getUserCourses();
        
        // Обновляем статистику
        this.updateStatistics(userCourses);
        
        // Отображаем курсы
        this.renderCourses(userCourses);
    }

    getUserCourses() {
        // Получаем курсы в обработке для текущего пользователя
        const pendingCourses = JSON.parse(localStorage.getItem(`pending_courses_${this.user.email}`)) || [];
        
        return {
            active: ['digital-marketing', 'web-design'],
            completed: ['finance-basics'],
            pending: pendingCourses
        };
    }

    updateStatistics(userCourses) {
        const activeCourses = userCourses.active.length;
        const pendingCourses = userCourses.pending.length;
        let totalProgress = 0;
        let completedTasks = 0;

        // Подсчитываем общий прогресс и выполненные задания
        [...userCourses.active, ...userCourses.completed].forEach(courseId => {
            const course = coursesData[courseId];
            if (course) {
                totalProgress += course.progress.percentage;
                completedTasks += course.progress.completed;
            }
        });

        // Вычисляем средний прогресс
        const averageProgress = Math.round(totalProgress / (userCourses.active.length + userCourses.completed.length));

        // Обновляем статистику на странице
        document.querySelector('.stat-card:nth-child(1) .stat-card__value').textContent = activeCourses;
        document.querySelector('.stat-card:nth-child(2) .stat-card__value').textContent = `${averageProgress}%`;
        document.querySelector('.stat-card:nth-child(3) .stat-card__value').textContent = completedTasks;
    }

    renderCourses(userCourses) {
        // Отображаем активные курсы
        const activeCoursesList = userCourses.active
            .map(courseId => coursesData[courseId])
            .map(course => this.createCourseCard(course, 'active'))
            .join('');

        // Отображаем курсы в обработке
        const pendingCoursesList = userCourses.pending
            .map(course => this.createCourseCard(course, 'pending'))
            .join('');

        // Отображаем завершенные курсы
        const completedCoursesList = userCourses.completed
            .map(courseId => coursesData[courseId])
            .map(course => this.createCourseCard(course, 'completed'))
            .join('');

        // Обновляем содержимое на странице
        const activeCoursesContainer = document.querySelector('.course-progress-grid');
        const pendingCoursesContainer = document.querySelector('.course-progress-grid--pending');
        const completedCoursesContainer = document.querySelector('.course-progress-grid:last-child');

        if (activeCoursesContainer) {
            activeCoursesContainer.innerHTML = activeCoursesList || '<p class="courses-empty">Нет активных курсов</p>';
        }

        if (pendingCoursesContainer) {
            pendingCoursesContainer.innerHTML = pendingCoursesList || '<p class="courses-empty">Нет курсов в обработке</p>';
        }

        if (completedCoursesContainer) {
            completedCoursesContainer.innerHTML = completedCoursesList || '<p class="courses-empty">Нет завершенных курсов</p>';
        }
    }

    createCourseCard(course, status) {
        if (status === 'pending') {
            return `
                <div class="course-progress-card course-progress-card--pending">
                    <img src="${course.image}" alt="${course.title}" class="course-progress-card__image">
                    <div class="course-progress-card__content">
                        <h3 class="course-progress-card__title">${course.title}</h3>
                        <p class="course-progress-card__info">
                            <i class="icon">⏳</i>
                            Заявка на рассмотрении
                        </p>
                        <div class="course-progress-card__actions">
                            <button class="btn btn--outline btn--full" disabled>Ожидайте подтверждения</button>
                            <button class="btn btn--danger btn--full" onclick="window.account.cancelEnrollment('${course.id}')">Отменить заявку</button>
                        </div>
                    </div>
                </div>
            `;
        }

        if (status === 'completed') {
            return `
                <div class="course-progress-card completed">
                    <img src="${course.image}" alt="${course.title}" class="course-progress-card__image">
                    <div class="course-progress-card__content">
                        <h3 class="course-progress-card__title">${course.title}</h3>
                        <p class="course-progress-card__info">Курс завершен</p>
                        <div class="progress-bar">
                            <div class="progress-bar__fill" style="width: 100%"></div>
                            </div>
                        <a href="#certificates" class="btn btn--outline btn--full">Скачать сертификат</a>
                    </div>
                </div>
            `;
        }

        return `
            <div class="course-progress-card">
                <img src="${course.image}" alt="${course.title}" class="course-progress-card__image">
                <div class="course-progress-card__content">
                    <h3 class="course-progress-card__title">${course.title}</h3>
                    <p class="course-progress-card__info">
                        Прогресс: ${course.progress.completed}/${course.progress.total} уроков
                    </p>
                    <div class="progress-bar">
                        <div class="progress-bar__fill" style="width: ${course.progress.percentage}%"></div>
                    </div>
                    <a href="course.html?id=${course.id}" class="btn btn--primary btn--full">Продолжить обучение</a>
                </div>
                    </div>
                `;
    }

    initProfileSettings() {
        const profileForm = document.querySelector('.profile-form');
        const avatarUploadBtn = document.querySelector('.avatar-upload .btn--outline');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        // Обработка загрузки аватара
        avatarUploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Сохраняем аватар в localStorage
                    this.user.avatar = e.target.result;
                    localStorage.setItem('user', JSON.stringify(this.user));
                    
                    // Обновляем все аватары на странице
                    const avatars = document.querySelectorAll('.user-profile__avatar');
                    avatars.forEach(avatar => {
                        if (this.user.avatar) {
                            avatar.innerHTML = `<image href="${this.user.avatar}" width="120" height="120"/>`;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        });

        // Обработка формы настроек
        if (profileForm) {
            // Заполняем форму текущими данными
            const nameInput = document.getElementById('userName');
            const emailInput = document.getElementById('userEmail');
            const phoneInput = document.getElementById('userPhone');
            
            if (this.user.name) nameInput.value = this.user.name;
            if (this.user.email) emailInput.value = this.user.email;
            if (this.user.phone) phoneInput.value = this.user.phone;

            // Маска для телефона
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = '+7 ' + value;
                    if (value.length > 3) {
                        value = value.slice(0, 3) + ' (' + value.slice(3);
                    }
                    if (value.length > 8) {
                        value = value.slice(0, 8) + ') ' + value.slice(8);
                    }
                    if (value.length > 13) {
                        value = value.slice(0, 13) + '-' + value.slice(13);
                    }
                    if (value.length > 16) {
                        value = value.slice(0, 16) + '-' + value.slice(16);
                    }
                }
                e.target.value = value.slice(0, 19);
            });

            // Обработка отправки формы
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Обновляем данные пользователя
                this.user.name = nameInput.value;
                this.user.email = emailInput.value;
                this.user.phone = phoneInput.value;

                // Сохраняем настройки уведомлений
                const notifications = Array.from(document.querySelectorAll('.checkbox input[type="checkbox"]'))
                    .map(checkbox => ({
                        type: checkbox.nextElementSibling.textContent.trim(),
                        enabled: checkbox.checked
                    }));
                this.user.notifications = notifications;

                // Сохраняем в localStorage
                localStorage.setItem('user', JSON.stringify(this.user));

                // Обновляем отображение в профиле
                this.updateProfileInfo();

                // Показываем уведомление
                this.showNotification('Настройки успешно сохранены');
            });
        }
    }

    showNotification(message) {
        // Удаляем предыдущее уведомление, если оно есть
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification notification--success';
        notification.innerHTML = `
            <div class="notification__icon">✓</div>
            <div class="notification__content">
                <div class="notification__message">${message}</div>
            </div>
        `;
        
        // Добавляем стили
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '16px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '12px';
        notification.style.zIndex = '1000';
        notification.style.transform = 'translateY(-100%)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateY(-100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    updateProfileInfo() {
        // Обновляем информацию в сайдбаре
        const nameElement = document.querySelector('.user-profile__name');
        const emailElement = document.querySelector('.user-profile__email');
        const avatars = document.querySelectorAll('.user-profile__avatar');

        if (nameElement && this.user.name) {
            nameElement.textContent = this.user.name;
        }

        if (emailElement && this.user.email) {
            emailElement.textContent = this.user.email;
        }

        // Обновляем аватар если он есть
        if (this.user.avatar) {
            avatars.forEach(avatar => {
                avatar.innerHTML = `<image href="${this.user.avatar}" width="120" height="120"/>`;
            });
        }
    }

    initLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            });
        }
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.dashboard__nav-link');
        const sections = document.querySelectorAll('.dashboard__section');

        // Обработка хэша URL при загрузке страницы
        const handleHash = () => {
            const hash = window.location.hash || '#courses';
            const targetSection = document.querySelector(hash);
            
            sections.forEach(section => {
                if (section === targetSection) {
                    section.style.display = 'block';
                    // Используем requestAnimationFrame для плавного появления
                    requestAnimationFrame(() => {
                        section.style.opacity = '1';
                    });
                } else {
                    section.style.opacity = '0';
                    section.style.display = 'none';
                }
            });

            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === hash);
            });

            // Плавно прокручиваем к началу страницы
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        // Обработка кликов по навигации
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const hash = link.getAttribute('href');
                const currentSection = document.querySelector('.dashboard__section[style*="display: block"]');
                const targetSection = document.querySelector(hash);
                
                if (currentSection) {
                    currentSection.style.opacity = '0';
                    
                    // Ждем завершения анимации исчезновения
                    setTimeout(() => {
                        currentSection.style.display = 'none';
                        targetSection.style.display = 'block';
                        
                        // Используем requestAnimationFrame для плавного появления
                        requestAnimationFrame(() => {
                            targetSection.style.opacity = '1';
                        });
                        
                        window.location.hash = hash;
                    }, 300);
                }
                
                // Обновляем активную ссылку
                navLinks.forEach(navLink => {
                    navLink.classList.toggle('active', navLink === link);
                });
                
                // Плавно прокручиваем к началу страницы
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });

        // Обработка изменения хэша
        window.addEventListener('hashchange', handleHash);

        // Инициализация при загрузке страницы
        handleHash();
    }

    cancelEnrollment(courseId) {
        // Получаем текущие курсы в обработке для пользователя
        const pendingCourses = JSON.parse(localStorage.getItem(`pending_courses_${this.user.email}`)) || [];
        
        // Удаляем курс из списка
        const updatedPendingCourses = pendingCourses.filter(course => course.id !== courseId);
        
        // Обновляем localStorage
        localStorage.setItem(`pending_courses_${this.user.email}`, JSON.stringify(updatedPendingCourses));
        
        // Обновляем отображение курсов
        const userCourses = this.getUserCourses();
        this.updateStatistics(userCourses);
        this.renderCourses(userCourses);
        
        // Показываем уведомление
        this.showNotification('Заявка на курс отменена');
    }
}

// В конце файла, перед инициализацией
// Делаем экземпляр класса доступным глобально для обработки кликов
window.account = null;

document.addEventListener('DOMContentLoaded', () => {
    window.account = new Account();
}); 