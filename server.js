const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Placeholder talk data
const talks = [
    {
        id: 'talk1',
        title: 'Introduction to WebAssembly',
        speakers: ['Alice Smith'],
        category: ['Web Development', 'Performance'],
        description: 'A deep dive into WebAssembly fundamentals and use cases.',
        duration: 60 // minutes
    },
    {
        id: 'talk2',
        title: 'State Management in React with Zustand',
        speakers: ['Bob Johnson', 'Carol White'],
        category: ['Frontend', 'React'],
        description: 'Exploring an alternative to Redux for efficient state management.',
        duration: 60
    },
    {
        id: 'talk3',
        title: 'Building Scalable Microservices with Node.js',
        speakers: ['David Green'],
        category: ['Backend', 'Node.js', 'Architecture'],
        description: 'Best practices for designing and implementing microservices.',
        duration: 60
    },
    {
        id: 'talk4',
        title: 'Containerization with Docker and Kubernetes',
        speakers: ['Eve Black'],
        category: ['DevOps', 'Cloud'],
        description: 'From Dockerizing applications to orchestrating with Kubernetes.',
        duration: 60
    },
    {
        id: 'talk5',
        title: 'Machine Learning in the Browser with TensorFlow.js',
        speakers: ['Frank Blue'],
        category: ['AI/ML', 'Frontend'],
        description: 'Running AI models directly in the web browser.',
        duration: 60
    },
    {
        id: 'talk6',
        title: 'Advanced CSS Techniques for Modern UIs',
        speakers: ['Grace Red'],
        category: ['Frontend', 'UI/UX'],
        description: 'Discovering cutting-edge CSS features for stunning user interfaces.',
        duration: 60
    }
];

const eventConfig = {
    talkDuration: 60, // minutes
    transitionTime: 10, // minutes
    lunchBreakDuration: 60, // minutes
    startTime: '10:00 AM', // Event start time
    numTalks: talks.length
};

/**
 * Calculates the full event schedule based on event configuration and talks data.
 * @returns {Array} An array of schedule items (talks and breaks) with calculated start and end times.
 */
function generateSchedule() {
    const schedule = [];
    let currentTime = parseTime(eventConfig.startTime); // Date object for time calculations

    let talkIndex = 0;
    while (talkIndex < eventConfig.numTalks) {
        // Add talk
        const talk = { ...talks[talkIndex] };
        talk.startTime = formatTime(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + eventConfig.talkDuration);
        talk.endTime = formatTime(currentTime);
        schedule.push(talk);

        talkIndex++;

        // Add transition if not the last talk
        if (talkIndex < eventConfig.numTalks) {
            currentTime.setMinutes(currentTime.getMinutes() + eventConfig.transitionTime);
        }

        // Insert lunch break after the second talk
        if (talkIndex === 2) {
            const lunchBreak = {
                id: 'lunch',
                title: 'Lunch Break',
                speakers: [],
                category: ['Break'],
                description: 'Enjoy a delicious lunch!',
                duration: eventConfig.lunchBreakDuration
            };
            lunchBreak.startTime = formatTime(currentTime);
            currentTime.setMinutes(currentTime.getMinutes() + eventConfig.lunchBreakDuration);
            lunchBreak.endTime = formatTime(currentTime);
            schedule.push(lunchBreak);
            
            // Add transition after lunch break
            currentTime.setMinutes(currentTime.getMinutes() + eventConfig.transitionTime);
        }
    }

    return schedule;
}

/**
 * Parses a time string (e.g., "10:00 AM") into a Date object.
 * @param {string} timeString
 * @returns {Date}
 */
function parseTime(timeString) {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) { // Midnight
        hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

/**
 * Formats a Date object into a time string (e.g., "1:00 PM").
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // The hour '0' should be '12'

    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes} ${period}`;
}

const fullSchedule = generateSchedule();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to get talks
app.get('/api/talks', (req, res) => {
    const categoryFilter = req.query.category;

    if (categoryFilter) {
        const filteredTalks = fullSchedule.filter(item =>
            item.category && item.category.some(cat => cat.toLowerCase().includes(categoryFilter.toLowerCase()))
        );
        return res.json(filteredTalks);
    }

    res.json(fullSchedule);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
