document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Login State ---
    let loggedIn = false;
    const headerNav = document.querySelector('.header-nav');
    if (headerNav) {
        const loginToggle = document.createElement('a');
        loginToggle.href = '#';
        loginToggle.textContent = 'Toggle Login';
        loginToggle.style.marginLeft = '20px';
        loginToggle.style.color = '#ffc107'; // A distinct color for the demo toggle
        headerNav.appendChild(loginToggle);
        loginToggle.addEventListener('click', (e) => {
            e.preventDefault();
            loggedIn = !loggedIn;
            renderHeader();
        });
        renderHeader(); // Initial render
    }

    function renderHeader() {
        const existingControls = headerNav.querySelector('.user-controls');
        if (existingControls) existingControls.remove();

        const controls = document.createElement('div');
        controls.className = 'user-controls';
        controls.style.display = 'inline';

        if (loggedIn) {
            controls.innerHTML = `
                <a href="https://support-ads.unity.com/s/ContactUs" class="btn-submit">Submit a request</a>
                <div class="user-menu" style="display: inline-block; position: relative; margin-left: 15px; vertical-align: middle;">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3wks2s_c2k-J3f2T2lZ-D9z5G3g_y_8J5g&s" alt="User Icon" class="user-icon" style="height: 30px; cursor: pointer; border-radius: 50%;">
                    <div class="dropdown-content" style="display: none; position: absolute; right: 0; background-color: #fff; color: #333; min-width: 160px; box-shadow: 0 8px 16px rgba(0,0,0,0.2); z-index: 10; border-radius: 5px;">
                        <a href="https://support-ads.unity.com/s/cases" style="color: black; padding: 12px 16px; text-decoration: none; display: block;">My activities</a>
                        <a href="#" style="color: black; padding: 12px 16px; text-decoration: none; display: block;">My profile</a>
                        <a href="#" style="color: black; padding: 12px 16px; text-decoration: none; display: block;">Sign out</a>
                    </div>
                </div>
            `;
            headerNav.prepend(controls);
            const userMenu = headerNav.querySelector('.user-menu');
            const dropdown = headerNav.querySelector('.dropdown-content');
            userMenu.addEventListener('click', () => {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });
        } else {
            controls.innerHTML = `
                <a href="https://support-ads.unity.com/s/ContactUs" class="btn-submit">Submit a request</a>
                <a href="#">Sign in</a>
            `;
            headerNav.prepend(controls);
        }
    }

    // --- Live Search Functionality ---
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        let modal = document.querySelector('.search-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'search-modal';
            searchBar.parentElement.appendChild(modal);
            modal.style.cssText = 'position: absolute; background: white; width: 62%; left: 19%; border: 1px solid #ccc; border-top: none; box-shadow: 0 5px 10px rgba(0,0,0,0.1); z-index: 100; text-align: left; border-radius: 0 0 5px 5px;';
        }

        searchBar.addEventListener('keyup', (e) => {
            const query = e.target.value.toLowerCase();
            if (e.key === 'Enter') {
                const urlPath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
                window.location.href = `${urlPath}search-results.html?q=${encodeURIComponent(query)}`;
                return;
            }
            if (query.length < 3) {
                modal.style.display = 'none';
                return;
            }
            const results = articles.filter(a => a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query)).slice(0, 5);
            modal.innerHTML = '';
            if (results.length > 0) {
                results.forEach(r => {
                    const item = document.createElement('a');
                    const urlPath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
                    item.href = `${urlPath}article.html?id=${r.id}`;
                    item.textContent = r.title;
                    item.style.cssText = 'display: block; padding: 10px 15px; text-decoration: none; color: #333; border-bottom: 1px solid #f0f0f0;';
                    modal.appendChild(item);
                });
                modal.style.display = 'block';
            } else {
                modal.style.display = 'none';
            }
        });
         document.addEventListener('click', (e) => {
            if (searchBar && !searchBar.parentElement.contains(e.target)) {
                modal.style.display = 'none';
            }
        });
    }

    // --- Promoted Articles on Main Page ---
    const promotedContainer = document.querySelector('.promoted-articles-grid');
    if (promotedContainer) {
        const sortedArticles = [...articles].sort((a, b) => b.likes - a.likes);
        const articlesToShow = 12;
        promotedContainer.innerHTML = sortedArticles.slice(0, articlesToShow).map(article => `
            <a href="pages/article.html?id=${article.id}" class="promoted-card">
                ${article.title}
            </a>
        `).join('');
    }

    // --- Article Category Page (Expand/Collapse) ---
    const collapsibleSections = document.querySelectorAll('.collapsible-section');
    collapsibleSections.forEach(section => {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.section-content');
        const toggleBtn = header.querySelector('.toggle-btn');

        header.addEventListener('click', () => {
            const isExpanded = section.classList.toggle('expanded');
            content.style.display = isExpanded ? 'block' : 'none';
            toggleBtn.textContent = isExpanded ? '−' : '+';
        });
    });

    // --- Article Page Functionality ---
    const articleContent = document.querySelector('.main-article-content');
    if (articleContent) {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = parseInt(urlParams.get('id')) || 1;
        const article = articles.find(a => a.id === articleId);

        if (article) {
            document.title = `${article.title} - Unity Support`;
            document.querySelector('.article-header h1').textContent = article.title;
            document.querySelector('.article-header .article-meta').textContent = `Updated on ${article.updated}`;
            articleContent.innerHTML = `<p>${article.content.replace(/\n/g, '</p><p>')}</p>`;
            document.getElementById('helpful-count').textContent = article.likes;

            // Track recently viewed
            let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
            if (recentlyViewed.includes(articleId)) {
                recentlyViewed = recentlyViewed.filter(id => id !== articleId);
            }
            recentlyViewed.unshift(articleId);
            localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed.slice(0, 5)));
        }

        // Helpful buttons
        const yesBtn = document.getElementById('yes-btn');
        const noBtn = document.getElementById('no-btn');
        const helpfulCountSpan = document.getElementById('helpful-count');
        
        yesBtn.addEventListener('click', () => {
            let currentLikes = parseInt(helpfulCountSpan.textContent);
            helpfulCountSpan.textContent = currentLikes + 1;
            yesBtn.disabled = true;
            noBtn.disabled = true;
            yesBtn.style.backgroundColor = '#d4edda';
        });

        noBtn.addEventListener('click', () => {
            document.getElementById('feedback-modal').style.display = 'block';
            yesBtn.disabled = true;
            noBtn.disabled = true;
        });
    }
    
    // Recently Viewed Articles
    const recentlyViewedContainer = document.querySelector('.recently-viewed-list');
    if (recentlyViewedContainer) {
        let recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        if (recentlyViewedIds.length > 0) {
            const viewedArticles = recentlyViewedIds.map(id => articles.find(a => a.id === id)).filter(Boolean);
            recentlyViewedContainer.innerHTML = viewedArticles.map(a => `<li><a href="article.html?id=${a.id}">${a.title}</a></li>`).join('');
        } else {
            recentlyViewedContainer.innerHTML = '<li>No recently viewed articles.</li>';
        }
    }

    // Modal close logic
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        const closeBtn = modal.querySelector('.close-button');
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }
    
    // Cookie button
    const acceptCookies = document.getElementById('accept-cookies');
    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            document.querySelector('.cookie-button').style.display = 'none';
        });
    }
});```

---

### 3. `css/style.css` (Full Replacement)
*Replace the entire contents of this file in the `/css/` folder.*

```css
/* --- General Body & Typography --- */
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    margin: 0;
    background-color: #FFFFFF;
    color: #333;
    font-size: 16px;
    line-height: 1.6;
}

a {
    color: #007bff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

h1, h2, h3 {
    font-weight: 600;
    color: #111;
}

/* --- Header --- */
.header {
    background-color: #222;
    color: white;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #333;
}

.header .logo img {
    height: 35px;
    vertical-align: middle;
}

.header-nav a {
    color: white;
    margin-left: 20px;
    font-weight: 500;
}

.header-nav .btn-submit {
    border: 1px solid white;
    padding: 8px 15px;
    border-radius: 5px;
}

.header-nav .btn-submit:hover {
    background-color: white;
    color: #222;
    text-decoration: none;
}

/* --- Header User Menu --- */
.user-menu:hover .dropdown-content {
    display: block !important;
}

/* --- Hero Search Section (Main Page) --- */
.hero-section {
    background-color: #f0f2f4;
    text-align: center;
    padding: 60px 20px;
}

.hero-section h1 {
    font-size: 3em;
    margin-bottom: 20px;
    color: #000;
}

.search-bar {
    position: relative;
}

.search-bar input[type="text"] {
    width: 60%;
    padding: 15px 20px;
    font-size: 1.1em;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* --- Main Content Sections --- */
.main-container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
}

.section-title {
    text-align: center;
    font-size: 2em;
    margin-bottom: 40px;
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.category-card {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 25px;
    text-align: center;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.category-card:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transform: translateY(-5px);
}

.category-card a {
    font-size: 1.2em;
    font-weight: 600;
    color: #333;
}

/* --- Promoted Articles Grid --- */
.promoted-articles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
}

.promoted-card {
    display: block;
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    color: #333;
    text-decoration: none;
    transition: box-shadow 0.2s;
}
.promoted-card:hover {
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    text-decoration: none;
}


/* --- Article & Search Results Page Layout --- */
.page-container {
    display: flex;
    gap: 40px;
}

.sidebar {
    flex: 0 0 250px;
}

.main-content {
    flex: 1;
}

.breadcrumbs {
    margin-bottom: 20px;
    font-size: 0.9em;
    color: #666;
}

.breadcrumbs a {
    color: #007bff;
}

.sidebar h3 {
    font-size: 1.2em;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.sidebar ul {
    list-style: none;
    padding: 0;
}

.sidebar ul li a {
    display: block;
    padding: 8px 0;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
}

.sidebar ul li a:hover {
    color: #007bff;
    text-decoration: none;
}


/* --- Article Page Specifics --- */
.article-header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
}

.article-meta {
    font-size: 0.9em;
    color: #888;
    margin-bottom: 30px;
}

.article-content {
    border-top: 1px solid #eee;
    padding-top: 20px;
}

.helpful-section {
    margin-top: 40px;
    padding: 20px;
    text-align: center;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
}

.helpful-section p {
    margin: 0 0 15px 0;
}

.helpful-section button {
    padding: 10px 20px;
    margin: 0 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.2s;
}

.helpful-section button:hover {
    background-color: #f5f5f5;
}

.helpful-section button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

/* --- Article Category Page (Collapsible) --- */
.collapsible-section {
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    margin-bottom: 20px;
}
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    cursor: pointer;
    background-color: #f8f9fa;
}
.section-header h3 {
    margin: 0;
}
.toggle-btn {
    font-size: 2em;
    font-weight: bold;
    color: #007bff;
    line-height: 0;
}
.section-content {
    display: none; /* Hidden by default */
    padding: 0 20px 20px 20px;
}
.section-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.section-content li {
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}
.section-content li:last-child {
    border-bottom: none;
}
.see-all-link {
    display: block;
    margin-top: 15px;
    font-weight: bold;
}


/* --- Search Results & Article Lists --- */
.article-list-item {
    padding: 15px 0;
    border-bottom: 1px solid #eee;
}

.article-list-item h3 {
    margin: 0 0 5px 0;
}

.article-list-item h3 a {
    color: #111;
    font-size: 1.2em;
}

.article-list-item p {
    margin: 0 0 10px 0;
    color: #555;
}

.article-list-item .article-meta {
    font-size: 0.9em;
    color: #888;
}

.ai-answer-box {
    background-color: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 30px;
}

.ai-answer-box h3 {
    margin-top: 0;
}

/* --- Admin Page --- */
.admin-section {
    margin-bottom: 40px;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
}

.admin-table th, .admin-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.admin-table th {
    background-color: #f2f2f2;
    font-weight: 600;
}

.feedback-list li {
    background-color: #f9f9f9;
    border: 1px solid #eee;
    padding: 10px;
    margin-bottom: 10px;
    list-style: none;
}


/* --- Footer --- */
footer {
    text-align: center;
    padding: 2rem;
    margin-top: 40px;
    background-color: #f8f8f8;
    border-top: 1px solid #e0e0e0;
    color: #777;
}

/* --- Cookie Banner --- */
.cookie-button {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #222;
    color: #fff;
    padding: 15px;
    text-align: center;
    z-index: 1000;
}

.cookie-button p {
    margin: 0 20px 0 0;
    display: inline-block;
}
.cookie-button button {
    padding: 8px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

/* --- Feedback Modal --- */
.modal {
    display: none; position: fixed; z-index: 1001; left: 0; top: 0;
    width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5);
}
.modal-content {
    background-color: #fefefe; margin: 15% auto; padding: 20px;
    border: 1px solid #888; width: 80%; max-width: 500px; border-radius: 5px;
}
.close-button {
    color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;
}
.modal-content textarea {
    width: 100%; height: 100px; margin: 15px 0; padding: 10px; box-sizing: border-box; resize: vertical;
}
.modal-content button {
    padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;
}
