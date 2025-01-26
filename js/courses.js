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
        price: {
            current: '34 900 ₸',
            old: '39 900 ₸'
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
        price: {
            current: '29 900 ₸',
            old: null
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
        price: {
            current: '19 900 ₸',
            old: '24 900 ₸'
        }
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
        }
    }
};

class CourseCatalog {
    constructor() {
        this.courses = Object.values(coursesData);
        this.filteredCourses = [...this.courses];
        this.initializeFilters();
        this.renderCourses();
    }

    initializeFilters() {
        // Инициализация поиска
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => this.filterCourses());

        // Инициализация фильтров
        const categoryFilter = document.getElementById('categoryFilter');
        const levelFilter = document.getElementById('levelFilter');
        const sortFilter = document.getElementById('sortFilter');

        categoryFilter.addEventListener('change', () => this.filterCourses());
        levelFilter.addEventListener('change', () => this.filterCourses());
        sortFilter.addEventListener('change', () => this.filterCourses());
    }

    filterCourses() {
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        const categoryValue = document.getElementById('categoryFilter').value;
        const levelValue = document.getElementById('levelFilter').value;
        const sortValue = document.getElementById('sortFilter').value;

        // Применяем фильтры
        this.filteredCourses = this.courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery) ||
                                course.description.toLowerCase().includes(searchQuery);
            const matchesCategory = !categoryValue || course.badge === categoryValue;
            const matchesLevel = !levelValue || course.level === levelValue;

            return matchesSearch && matchesCategory && matchesLevel;
        });

        // Применяем сортировку
        this.sortCourses(sortValue);

        // Отображаем отфильтрованные курсы
        this.renderCourses();
    }

    sortCourses(sortType) {
        switch (sortType) {
            case 'price-asc':
                this.filteredCourses.sort((a, b) => {
                    return this.extractPrice(a.price.current) - this.extractPrice(b.price.current);
                });
                break;
            case 'price-desc':
                this.filteredCourses.sort((a, b) => {
                    return this.extractPrice(b.price.current) - this.extractPrice(a.price.current);
                });
                break;
            case 'popular':
                this.filteredCourses.sort((a, b) => {
                    return this.extractStudents(b.students) - this.extractStudents(a.students);
                });
                break;
        }
    }

    extractPrice(priceString) {
        return parseInt(priceString.replace(/[^\d]/g, ''));
    }

    extractStudents(studentsString) {
        return parseInt(studentsString.match(/\d+/)[0]);
    }

    renderCourses() {
        const coursesGrid = document.getElementById('coursesGrid');
        coursesGrid.innerHTML = this.filteredCourses.map(course => this.createCourseCard(course)).join('');
    }

    createCourseCard(course) {
        return `
            <div class="course-card">
                ${course.price.old ? `<div class="course-card__badge">Скидка</div>` : ''}
                <img src="${course.image}" alt="${course.title}" class="course-card__image">
                <div class="course-card__content">
                    <div class="course-card__category">${course.badge}</div>
                    <h3 class="course-card__title">${course.title}</h3>
                    <p class="course-card__description">${course.description}</p>
                    <div class="course-card__meta">
                        <div class="course-card__stats">
                            <span class="course-card__stat">
                                <i class="icon">⏱️</i> ${course.duration}
                            </span>
                            <span class="course-card__stat">
                                <i class="icon">👥</i> ${course.students}
                            </span>
                        </div>
                        <div class="course-card__price">
                            <span class="course-card__price-current">${course.price.current}</span>
                            ${course.price.old ? `<span class="course-card__price-old">${course.price.old}</span>` : ''}
                        </div>
                    </div>
                    <a href="course.html?id=${course.id}" class="btn btn--primary btn--full">Подробнее</a>
                </div>
            </div>
        `;
    }
}

// Инициализация каталога при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new CourseCatalog();
}); 