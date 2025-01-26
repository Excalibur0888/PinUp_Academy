class Catalog {
    constructor() {
        this.apiUrl = '/api';
        this.filters = {
            category: '',
            level: '',
            search: '',
            sort: 'popular'
        };
        
        this.initFilters();
        this.initSearch();
        this.initSort();
        this.loadCourses();
    }

    initFilters() {
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.loadCourses();
            });
        }

        // Level filter
        const levelFilter = document.getElementById('levelFilter');
        if (levelFilter) {
            levelFilter.addEventListener('change', (e) => {
                this.filters.level = e.target.value;
                this.loadCourses();
            });
        }
    }

    initSearch() {
        const searchInput = document.querySelector('.catalog-search input');
        if (searchInput) {
            let debounceTimer;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.filters.search = e.target.value;
                    this.loadCourses();
                }, 500);
            });
        }
    }

    initSort() {
        const sortSelect = document.querySelector('.catalog-sort select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.loadCourses();
            });
        }
    }

    async loadCourses() {
        try {
            const coursesList = document.getElementById('coursesList');
            if (!coursesList) return;

            coursesList.classList.add('loading');

            // Build query string
            const queryParams = new URLSearchParams(this.filters).toString();
            
            const response = await fetch(`${this.apiUrl}/courses?${queryParams}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка загрузки курсов');
            }

            this.renderCourses(data.courses);
            this.updateFiltersState(data.filters);

        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            const coursesList = document.getElementById('coursesList');
            if (coursesList) {
                coursesList.classList.remove('loading');
            }
        }
    }

    renderCourses(courses) {
        const coursesList = document.getElementById('coursesList');
        if (!coursesList) return;

        if (courses.length === 0) {
            coursesList.innerHTML = `
                <div class="courses-empty">
                    <div class="courses-empty__icon">🔍</div>
                    <h3 class="courses-empty__title">Курсы не найдены</h3>
                    <p class="courses-empty__text">Попробуйте изменить параметры поиска</p>
                </div>
            `;
            return;
        }

        coursesList.innerHTML = courses.map(course => `
            <div class="course-card" data-category="${course.category}" data-level="${course.level}">
                <img src="${course.image}" alt="${course.title}" class="course-card__image">
                <div class="course-card__content">
                    <span class="course-card__level">${course.level}</span>
                    <h3 class="course-card__title">${course.title}</h3>
                    <p class="course-card__description">${course.description}</p>
                    <div class="course-card__footer">
                        <span class="course-card__price">${this.formatPrice(course.price)} ₸</span>
                        <a href="/courses/${course.slug}" class="btn btn--primary">Подробнее</a>
                    </div>
                </div>
            </div>
        `).join('');

        // Initialize lazy loading for new images
        this.initLazyLoading();
    }

    updateFiltersState(filters) {
        // Update category options
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter && filters.categories) {
            const currentValue = categoryFilter.value;
            
            categoryFilter.innerHTML = `
                <option value="">Все категории</option>
                ${filters.categories.map(category => `
                    <option value="${category.slug}" ${currentValue === category.slug ? 'selected' : ''}>
                        ${category.name} (${category.count})
                    </option>
                `).join('')}
            `;
        }

        // Update level options
        const levelFilter = document.getElementById('levelFilter');
        if (levelFilter && filters.levels) {
            const currentValue = levelFilter.value;
            
            levelFilter.innerHTML = `
                <option value="">Все уровни</option>
                ${filters.levels.map(level => `
                    <option value="${level.slug}" ${currentValue === level.slug ? 'selected' : ''}>
                        ${level.name} (${level.count})
                    </option>
                `).join('')}
            `;
        }
    }

    initLazyLoading() {
        const lazyImages = document.querySelectorAll('.course-card__image[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ru-KZ').format(price);
    }
}

// Initialize catalog
const catalog = new Catalog(); 