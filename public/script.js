document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const categorySearchInput = document.getElementById('categorySearch');
    const searchButton = document.getElementById('searchButton');
    const resetButton = document.getElementById('resetButton');

    async function fetchSchedule(category = '') {
        let url = '/api/talks';
        if (category) {
            url += `?category=${encodeURIComponent(category)}`;
        }
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const schedule = await response.json();
            renderSchedule(schedule);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            scheduleContainer.innerHTML = '<p>Failed to load schedule. Please try again later.</p>';
        }
    }

    function renderSchedule(schedule) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule

        if (schedule.length === 0) {
            scheduleContainer.innerHTML = '<p>No talks found for the given criteria.</p>';
            return;
        }

        schedule.forEach(item => {
            const talkCard = document.createElement('div');
            talkCard.classList.add('talk-card');

            if (item.id === 'lunch') {
                talkCard.classList.add('break');
                talkCard.innerHTML = `
                    <h2>${item.title}</h2>
                    <span class="time">${item.startTime} - ${item.endTime}</span>
                    <p>${item.description}</p>
                `;
            } else {
                talkCard.innerHTML = `
                    <span class="time">${item.startTime} - ${item.endTime}</span>
                    <h2>${item.title}</h2>
                    <p class="speakers">Speakers: ${item.speakers.join(', ')}</p>
                    <p>${item.description}</p>
                    <p class="category">Category: ${item.category.join(', ')}</p>
                `;
            }
            scheduleContainer.appendChild(talkCard);
        });
    }

    // Event Listeners
    searchButton.addEventListener('click', () => {
        const category = categorySearchInput.value.trim();
        fetchSchedule(category);
    });

    resetButton.addEventListener('click', () => {
        categorySearchInput.value = '';
        fetchSchedule(); // Fetch all talks
    });

    // Initial load
    fetchSchedule();
});
