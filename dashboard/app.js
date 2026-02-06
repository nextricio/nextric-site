document.addEventListener('DOMContentLoaded', () => {
    // Current date
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.innerText = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
    }

    const storedKey = localStorage.getItem('squad_auth_key');
    if (storedKey === 'ghp_WnjF') {
        showDashboard();
    }

    const squadKeyInput = document.getElementById('squad-key');
    if (squadKeyInput) {
        squadKeyInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkAuth();
        });
    }
});

async function loadFeed() {
    const pulse = document.getElementById('pulse-dot');
    if (pulse) pulse.classList.add('animate-ping');
    
    try {
        // Fetch feed.json
        const feedRes = await fetch('feed.json?t=' + Date.now(), { cache: 'no-store' });
        const feedData = await feedRes.json();
        
        // Fetch WORKING.md
        const workingRes = await fetch('../memory/WORKING.md?t=' + Date.now(), { cache: 'no-store' });
        const workingText = await workingRes.text();
        
        renderFeed(feedData);
        syncWorkingData(workingText);
        
        if (pulse) setTimeout(() => pulse.classList.remove('animate-ping'), 1000);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderFeed(data) {
    const feed = document.getElementById('activity-feed');
    if (feed) {
        feed.innerHTML = data.slice(0, 10).map(item => `
            <div class="feed-item">
                <p class="text-xs font-bold text-gray-400 mb-1">${item.timestamp} | ${item.agent}</p>
                <p class="serif text-xl leading-snug">${item.content}</p>
            </div>
        `).join('');
    }

    const intel = document.getElementById('active-intelligence');
    if (intel) {
        const items = data.filter(i => i.content.includes('OPTIMIZING') || i.content.includes('TECHNICAL')).slice(0, 3);
        intel.innerHTML = items.map(i => `
            <div class="card p-4 rounded border-l-4 border-black">
                <p class="text-[10px] uppercase font-bold mb-1">${i.agent}</p>
                <p class="text-sm font-medium leading-relaxed">${i.content}</p>
            </div>
        `).join('') || '<p class="text-xs text-center text-gray-400">Steady state...</p>';
    }
}

function syncWorkingData(markdown) {
    // Basic Header-based Parsing
    const extractSection = (tag) => {
        const regex = new RegExp(`### ${tag}([\\s\\S]*?)(?=###|##|$)`, 'i');
        const match = markdown.match(regex);
        if (!match) return [];
        return match[1].trim().split('\n')
            .filter(l => l.trim().startsWith('- ['))
            .map(l => l.replace(/- \[[x ]\] /i, '').trim());
    };

    const inbox = extractSection('Inbox');
    const inprogress = extractSection('In Progress');
    const done = extractSection('Done');

    const inject = (id, tasks, style = "") => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = tasks.map(t => `<div class="card p-4 rounded text-sm font-medium ${style}">${t}</div>`).join('') || '<p class="text-xs italic text-gray-400">Empty</p>';
    };

    inject('inbox-tasks', inbox);
    inject('inprogress-tasks', inprogress, "border-l-4 border-blue-600 font-bold");
    inject('done-tasks', done, "text-gray-400 line-through");

    // Roster Parsing
    const rosterMatch = markdown.match(/## Roster([\s\S]*?)(?=##|$)/);
    if (rosterMatch) {
        const list = document.getElementById('squad-list');
        if (list) {
            list.innerHTML = rosterMatch[1].trim().split('\n').map(line => {
                const name = line.match(/\*\*([^*]+)\*\*/)?.[1];
                if (!name) return '';
                const active = line.includes('[ACTIVE]');
                const emoji = name === 'Echo' ? '🌊' : (name === 'Friday' ? '🛠️' : (name === 'Wanda' ? '🔮' : (name === 'Fury' ? '🦅' : '👁️')));
                return `
                    <div class="card p-5 rounded">
                        <div class="flex justify-between items-start mb-3">
                            <span class="text-3xl">${emoji}</span>
                            <span class="status-badge ${active ? 'status-active' : 'status-idle'}">${active ? 'Active' : 'Idle'}</span>
                        </div>
                        <h4 class="text-xl font-bold">${name}</h4>
                        <p class="text-xs font-bold uppercase text-gray-500 tracking-tighter">${line.split(':')[1]?.trim() || ''}</p>
                    </div>
                `;
            }).join('');
        }
    }
}

function showDashboard() {
    document.getElementById('auth-overlay')?.classList.add('hidden');
    document.getElementById('dashboard-content')?.classList.remove('opacity-0');
    loadFeed();
    setInterval(loadFeed, 15000);
}

function checkAuth() {
    const key = document.getElementById('squad-key')?.value;
    if (key === 'ghp_WnjF') {
        localStorage.setItem('squad_auth_key', key);
        showDashboard();
    }
}
