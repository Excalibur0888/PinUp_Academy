// Моковые данные курсов
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
        price: {
            current: '34 900 ₸',
            old: '39 900 ₸'
        },
        modules: [
            {
                title: 'Модуль 1: Основы digital-маркетинга',
                duration: '6 уроков',
                lessons: [
                    { title: 'Введение в digital-маркетинг', duration: '45 минут' },
                    { title: 'Анализ целевой аудитории', duration: '60 минут' },
                    { title: 'Создание digital-стратегии', duration: '90 минут' }
                ]
            },
            {
                title: 'Модуль 2: Каналы продвижения',
                duration: '8 уроков',
                lessons: [
                    { title: 'SEO-оптимизация', duration: '90 минут' },
                    { title: 'Контекстная реклама', duration: '120 минут' },
                    { title: 'SMM-продвижение', duration: '90 минут' }
                ]
            }
        ]
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
        price: {
            current: '29 900 ₸',
            old: null
        },
        modules: [
            {
                title: 'Модуль 1: Введение в веб-дизайн',
                duration: '4 урока',
                lessons: [
                    { title: 'Основы UI/UX дизайна', duration: '60 минут' },
                    { title: 'Работа с Figma', duration: '90 минут' },
                    { title: 'Принципы композиции', duration: '75 минут' }
                ]
            },
            {
                title: 'Модуль 2: Практика веб-дизайна',
                duration: '6 уроков',
                lessons: [
                    { title: 'Создание прототипа', duration: '120 минут' },
                    { title: 'Дизайн-система', duration: '90 минут' },
                    { title: 'Адаптивный дизайн', duration: '90 минут' }
                ]
            }
        ]
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
        price: {
            current: '19 900 ₸',
            old: '24 900 ₸'
        },
        modules: [
            {
                title: 'Модуль 1: Основы финансов',
                duration: '5 уроков',
                lessons: [
                    { title: 'Личный бюджет', duration: '60 минут' },
                    { title: 'Финансовое планирование', duration: '75 минут' },
                    { title: 'Управление долгами', duration: '60 минут' }
                ]
            },
            {
                title: 'Модуль 2: Инвестиции',
                duration: '7 уроков',
                lessons: [
                    { title: 'Основы инвестирования', duration: '90 минут' },
                    { title: 'Фондовый рынок', duration: '120 минут' },
                    { title: 'Пассивный доход', duration: '90 минут' }
                ]
            }
        ]
    },
    'productivity': {
        id: 'productivity',
        badge: 'Саморазвитие',
        title: 'Личная продуктивность',
        description: 'Освойте техники тайм-менеджмента и повысьте свою эффективность',
        level: 'Начальный',
        duration: '6 недель',
        students: '78 студентов',
        image: 'img/productivity.jpg',
        price: {
            current: '24 900 ₸',
            old: null
        },
        modules: [
            {
                title: 'Модуль 1: Основы тайм-менеджмента',
                duration: '5 уроков',
                lessons: [
                    { title: 'Планирование и приоритизация', duration: '60 минут' },
                    { title: 'Методы управления временем', duration: '75 минут' },
                    { title: 'Борьба с прокрастинацией', duration: '60 минут' }
                ]
            },
            {
                title: 'Модуль 2: Продвинутые техники',
                duration: '6 уроков',
                lessons: [
                    { title: 'Системы продуктивности', duration: '90 минут' },
                    { title: 'Энергетический менеджмент', duration: '75 минут' },
                    { title: 'Привычки успешных людей', duration: '90 минут' }
                ]
            }
        ]
    }
};

class Course {
    constructor() {
        this.courseId = this.getCourseIdFromUrl();
        this.courseData = coursesData[this.courseId];
        
        if (!this.courseData) {
            window.location.href = 'courses.html';
            return;
        }

        this.initCourse();
    }

    getCourseIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    initCourse() {
        this.updateMetaData();
        this.updateCourseInfo();
        this.renderModules();
        this.initEventListeners();
    }

    updateMetaData() {
        document.title = `${this.courseData.title} - PIN-UP Academy`;
    }

    updateCourseInfo() {
        // Обновляем основную информацию о курсе
        document.getElementById('courseBadge').textContent = this.courseData.badge;
        document.getElementById('courseTitle').textContent = this.courseData.title;
        document.getElementById('courseDescription').textContent = this.courseData.description;
        
        // Обновляем мета-информацию
        document.querySelector('#courseLevel span').textContent = this.courseData.level;
        document.querySelector('#courseDuration span').textContent = this.courseData.duration;
        document.querySelector('#courseStudents span').textContent = this.courseData.students;
        
        // Обновляем цену
        document.querySelector('#coursePrice .course-price__current').textContent = this.courseData.price.current;
        if (this.courseData.price.old) {
            document.querySelector('#coursePrice .course-price__old').textContent = this.courseData.price.old;
        }
        
        // Обновляем изображение
        const courseImage = document.getElementById('courseImage');
        courseImage.src = this.courseData.image;
        courseImage.alt = this.courseData.title;
    }

    renderModules() {
        const modulesContainer = document.getElementById('courseModules');
        
        const modulesHtml = this.courseData.modules.map((module, index) => `
            <div class="module">
                <div class="module-header">
                    <div class="module-header__title">
                        <span>${index + 1}</span>
                        ${module.title}
                    </div>
                    <div class="module-header__info">
                        <div class="module-header__lessons">
                            <i class="icon">📚</i>
                            ${module.duration}
                        </div>
                        <div class="module-header__duration">
                            <i class="icon">⏱️</i>
                            ${module.lessons.reduce((total, lesson) => {
                                const minutes = parseInt(lesson.duration);
                                return total + minutes;
                            }, 0)} минут
                        </div>
                    </div>
                </div>
                <div class="module-content">
                    <div class="lesson-list">
                        ${module.lessons.map(lesson => `
                            <div class="lesson-item">
                                <div class="lesson-item__icon">
                                    <i class="icon">📝</i>
                                </div>
                                <div class="lesson-item__content">
                                    <h4 class="lesson-item__title">${lesson.title}</h4>
                                    <div class="lesson-item__info">
                                        <div class="lesson-item__duration">
                                            <i class="icon">⏱️</i>
                                            ${lesson.duration}
                                        </div>
                                        <div class="lesson-item__status">
                                            <i class="icon">🔒</i>
                                            Закрыт
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        modulesContainer.innerHTML = modulesHtml;

        // Добавляем обработчики для открытия/закрытия модулей
        const moduleHeaders = document.querySelectorAll('.module-header');
        moduleHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                content.classList.toggle('active');
            });
        });
    }

    initEventListeners() {
        // Обработчик для кнопки записи на курс
        const enrollButton = document.getElementById('enrollButton');
        if (enrollButton) {
            enrollButton.addEventListener('click', () => {
                this.handleEnrollment();
            });
        }

        // Обработчик для кнопки просмотра промо
        const previewButton = document.getElementById('previewButton');
        if (previewButton) {
            previewButton.addEventListener('click', () => {
                // Здесь будет логика открытия промо-видео
                alert('Промо-видео будет доступно в ближайшее время!');
            });
        }
    }

    handleEnrollment() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Получаем текущие курсы в обработке для пользователя
        const pendingCourses = JSON.parse(localStorage.getItem(`pending_courses_${user.email}`)) || [];

        // Проверяем, не отправлена ли уже заявка на этот курс
        if (pendingCourses.some(course => course.id === this.courseId)) {
            this.showNotification('Вы уже отправили заявку на этот курс');
            return;
        }

        // Добавляем курс в список ожидающих подтверждения
        pendingCourses.push({
            id: this.courseId,
            title: this.courseData.title,
            image: this.courseData.image
        });

        // Сохраняем обновленный список курсов
        localStorage.setItem(`pending_courses_${user.email}`, JSON.stringify(pendingCourses));

        // Обновляем кнопку и показываем уведомление
        const enrollBtn = document.querySelector('#enrollButton');
        enrollBtn.disabled = true;
        enrollBtn.textContent = 'Заявка отправлена';
        
        this.showNotification('Заявка на курс успешно отправлена');
    }

    showNotification(message) {
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
}

// Инициализация страницы курса
document.addEventListener('DOMContentLoaded', () => {
    new Course();
}); 