document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Login State ---
    let loggedIn = false; // This variable controls the header buttons. false = show "Sign in"
    const headerNav = document.querySelector('.header-nav');
    if (headerNav) {
        // This toggle is for demonstration purposes so you can see both logged-in and logged-out states.
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
        renderHeader(); // Initial render on page load
    }

    function renderHeader() {
        const existingControls = headerNav.querySelector('.user-controls');
        if (existingControls) existingControls.remove();

        const controls = document.createElement('div');
        controls.className = 'user-controls';
        controls.style.display = 'inline';

        if (loggedIn) {
            // LOGGED-IN STATE: Shows user icon and menu
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
            // LOGGED-OUT STATE: Shows "Sign in" and "Submit a request" buttons
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
});
