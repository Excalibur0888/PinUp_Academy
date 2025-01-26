class Account {
    constructor() {
        this.apiUrl = '/api';
        this.user = JSON.parse(localStorage.getItem('user'));
        this.token = localStorage.getItem('token');
        
        if (!this.token) {
            window.location.href = 'login.html';
            return;
        }

        this.initDashboard();
        this.initProfileSettings();
        this.initLogout();
    }

    async initDashboard() {
        try {
            // Load user's courses
            const response = await fetch(`${this.apiUrl}/user/courses`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка загрузки курсов');
            }

            this.renderCourses(data.courses);
            this.updateProgress(data.progress);

        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    renderCourses(courses) {
        const activeCoursesList = document.querySelector('.active-courses .courses-grid');
        const completedCoursesList = document.querySelector('.completed-courses .courses-grid');

        if (!activeCoursesList || !completedCoursesList) return;

        // Разделяем курсы на активные и завершенные
        const activeCourses = courses.filter(course => course.progress < 100);
        const completedCourses = courses.filter(course => course.progress === 100);

        // Отображаем активные курсы
        activeCoursesList.innerHTML = activeCourses.map(course => `
            <div class="course-progress-card">
                <div class="course-progress-card__header">
                    <img src="${course.image}" alt="${course.title}" class="course-progress-card__image">
                    <div class="course-progress-card__progress">
                        <div class="progress-bar">
                            <div class="progress-bar__fill" style="width: ${course.progress}%"></div>
                        </div>
                        <span class="progress-text">${course.progress}% пройдено</span>
                    </div>
                </div>
                <div class="course-progress-card__content">
                    <h3 class="course-progress-card__title">${course.title}</h3>
                    <p class="course-progress-card__info">Следующий урок: ${course.nextLesson}</p>
                    <a href="/course/${course.slug}" class="btn btn--primary">Продолжить обучение</a>
                </div>
            </div>
        `).join('') || '<p class="courses-empty">У вас пока нет активных курсов</p>';

        // Отображаем завершенные курсы
        completedCoursesList.innerHTML = completedCourses.map(course => `
            <div class="course-progress-card completed">
                <div class="course-progress-card__header">
                    <img src="${course.image}" alt="${course.title}" class="course-progress-card__image">
                    <div class="course-progress-card__progress">
                        <div class="progress-bar">
                            <div class="progress-bar__fill" style="width: 100%"></div>
                        </div>
                        <span class="progress-text">Курс пройден</span>
                    </div>
                </div>
                <div class="course-progress-card__content">
                    <h3 class="course-progress-card__title">${course.title}</h3>
                    <p class="course-progress-card__info">Сертификат получен</p>
                    <a href="/certificates/${course.certificateId}" class="btn btn--secondary">Посмотреть сертификат</a>
                </div>
            </div>
        `).join('') || '<p class="courses-empty">У вас пока нет завершенных курсов</p>';
    }

    updateProgress(progress) {
        const statsContainer = document.querySelector('.dashboard-stats');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="dashboard-stat">
                <span class="dashboard-stat__value">${progress.activeCourses}</span>
                <span class="dashboard-stat__label">Активных курса</span>
            </div>
            <div class="dashboard-stat">
                <span class="dashboard-stat__value">${progress.totalProgress}%</span>
                <span class="dashboard-stat__label">Общий прогресс</span>
            </div>
            <div class="dashboard-stat">
                <span class="dashboard-stat__value">${progress.completedTasks}</span>
                <span class="dashboard-stat__label">Выполненных заданий</span>
            </div>
        `;
    }

    initProfileSettings() {
        const profileForm = document.getElementById('profileForm');
        if (!profileForm) return;

        // Заполняем форму текущими данными
        Object.keys(this.user).forEach(key => {
            const input = profileForm.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = this.user[key];
            }
        });

        // Обработка отправки формы
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                const formData = new FormData(profileForm);
                const button = profileForm.querySelector('button[type="submit"]');
                button.classList.add('btn--loading');

                const response = await fetch(`${this.apiUrl}/user/profile`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: formData
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Ошибка обновления профиля');
                }

                this.user = data.user;
                localStorage.setItem('user', JSON.stringify(this.user));
                showToast('Профиль успешно обновлен', 'success');

            } catch (error) {
                showToast(error.message, 'error');
            } finally {
                button.classList.remove('btn--loading');
            }
        });

        // Обработка загрузки аватара
        const avatarInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');
        
        if (avatarInput && avatarPreview) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        avatarPreview.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    initLogout() {
        const logoutButton = document.querySelector('.logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
                try {
                    await fetch(`${this.apiUrl}/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                } catch (error) {
                    console.error('Ошибка при выходе:', error);
                } finally {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                }
            });
        }
    }
}

// Initialize account
const account = new Account(); 