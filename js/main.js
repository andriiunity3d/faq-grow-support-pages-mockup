document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Login State ---
    // Check localStorage to persist login state across pages
    let loggedIn = localStorage.getItem('loggedIn') === 'true' || false;
    const headerNav = document.querySelector('.header-nav') || document.querySelector('.unity-nav');
    if (headerNav) {
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
            const urlPath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
            controls.innerHTML = `
                <a href="https://support-ads.unity.com/s/ContactUs" class="btn-submit" target="_blank" rel="noopener noreferrer">Submit a request<span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"> (opens in new tab)</span></a>
                <a href="${urlPath}my-requests.html" class="btn-submit">My Requests</a>
                <div class="user-menu" style="display: inline-block; position: relative; margin-left: 15px; vertical-align: middle;">
                    <button class="user-icon" aria-haspopup="true" aria-expanded="false" aria-label="User menu" style="width: 30px; height: 30px; border-radius: 50%; background-color: #007bff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; border: none;" aria-label="Open user menu">U</button>
                    <div class="dropdown-content" role="menu" style="display: none; position: absolute; right: 0; background-color: #fff; color: #333; min-width: 160px; box-shadow: 0 8px 16px rgba(0,0,0,0.2); z-index: 10; border-radius: 5px;">
                        <a href="#" id="sign-out-btn" role="menuitem" style="color: black; padding: 12px 16px; text-decoration: none; display: block;">Sign out</a>
                    </div>
                </div>
            `;
            headerNav.prepend(controls);
            const userMenu = headerNav.querySelector('.user-menu');
            const userIconBtn = headerNav.querySelector('.user-icon');
            const dropdown = headerNav.querySelector('.dropdown-content');
            userIconBtn.addEventListener('click', () => {
                const isOpen = dropdown.style.display === 'block';
                dropdown.style.display = isOpen ? 'none' : 'block';
                userIconBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
            });
            userIconBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dropdown.style.display = 'none';
                    userIconBtn.setAttribute('aria-expanded', 'false');
                    userIconBtn.focus();
                }
            });
            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target)) {
                    dropdown.style.display = 'none';
                    userIconBtn.setAttribute('aria-expanded', 'false');
                }
            });
            // Add sign out functionality
            const signOutBtn = headerNav.querySelector('#sign-out-btn');
            if (signOutBtn) {
                signOutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    loggedIn = false;
                    localStorage.setItem('loggedIn', 'false');
                    // If on My Requests page, redirect to home
                    if (window.location.pathname.includes('my-requests.html')) {
                        const homePath = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
                        window.location.href = homePath;
                    } else {
                        renderHeader();
                    }
                });
            }
        } else {
            // LOGGED-OUT STATE: Shows "Sign in" and "Submit a request" buttons
            controls.innerHTML = `
                <a href="https://support-ads.unity.com/s/ContactUs" class="btn-submit">Submit a request</a>
                <a href="#" id="sign-in-btn">Sign in</a>
            `;
            headerNav.prepend(controls);
            // Add toggle functionality to Sign In button
            const signInBtn = headerNav.querySelector('#sign-in-btn');
            if (signInBtn) {
                signInBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    loggedIn = !loggedIn;
                    localStorage.setItem('loggedIn', loggedIn.toString());
                    renderHeader();
                });
            }
        }
    }

    // --- Live Search Functionality ---
    const searchBar = document.querySelector('.search-bar input') || document.querySelector('.search-container .search-input');
    if (searchBar) {
        let modal = document.querySelector('.search-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'search-modal';
            modal.setAttribute('role', 'listbox');
            modal.setAttribute('aria-label', 'Search suggestions');
            modal.id = 'search-suggestions';
            searchBar.setAttribute('aria-autocomplete', 'list');
            searchBar.setAttribute('aria-controls', 'search-suggestions');
            searchBar.setAttribute('aria-expanded', 'false');
            const searchBarContainer = searchBar.closest('.search-bar') || searchBar.closest('.search-container');
            searchBarContainer.style.position = 'relative';
            searchBarContainer.appendChild(modal);
            // Check if search bar is in breadcrumbs (inline), hero (.search-container), or legacy hero
            const isInline = searchBarContainer.closest('.breadcrumbs');
            const isHeroContainer = searchBarContainer.classList && searchBarContainer.classList.contains('search-container');
            if (isInline) {
                modal.style.cssText = 'position: absolute; background: white; width: 100%; top: 100%; left: 0; border: 1px solid #ccc; border-top: none; box-shadow: 0 5px 10px rgba(0,0,0,0.1); z-index: 100; text-align: left; border-radius: 0 0 5px 5px; margin-top: 5px;';
            } else if (isHeroContainer) {
                modal.style.cssText = 'position: absolute; background: white; width: 100%; top: 100%; left: 0; border: 1px solid #ccc; border-top: none; box-shadow: 0 5px 10px rgba(0,0,0,0.1); z-index: 1001; text-align: left; border-radius: 0 0 8px 8px; margin-top: -1px;';
            } else {
                modal.style.cssText = 'position: absolute; background: white; width: 62%; left: 19%; border: 1px solid #ccc; border-top: none; box-shadow: 0 5px 10px rgba(0,0,0,0.1); z-index: 100; text-align: left; border-radius: 0 0 5px 5px;';
            }
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
                searchBar.setAttribute('aria-expanded', 'false');
                return;
            }
            const results = articles.filter(a => a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query)).slice(0, 5);
            modal.innerHTML = '';
            if (results.length > 0) {
                searchBar.setAttribute('aria-expanded', 'true');
                results.forEach(r => {
                    const item = document.createElement('a');
                    const urlPath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
                    item.href = `${urlPath}article.html?id=${r.id}`;
                    item.setAttribute('role', 'option');
                    item.style.cssText = 'display: block; padding: 10px 15px; text-decoration: none; color: #333; border-bottom: 1px solid #f0f0f0;';
                    
                    // Create container for title and location
                    const titleDiv = document.createElement('div');
                    titleDiv.textContent = r.title;
                    titleDiv.style.cssText = 'font-weight: 500; margin-bottom: 3px;';
                    
                    // Create location text (category > section)
                    const locationDiv = document.createElement('div');
                    locationDiv.textContent = `${r.category} > ${r.section}`;
                    locationDiv.style.cssText = 'font-size: 0.85em; color: #888;';
                    
                    item.appendChild(titleDiv);
                    item.appendChild(locationDiv);
                    modal.appendChild(item);
                });
                modal.style.display = 'block';
            } else {
                modal.style.display = 'none';
                searchBar.setAttribute('aria-expanded', 'false');
            }
        });
        const searchBarContainer = searchBar.closest('.search-bar') || searchBar.closest('.search-container');
        document.addEventListener('click', (e) => {
            if (searchBar && modal && searchBarContainer && !searchBarContainer.contains(e.target) && !modal.contains(e.target)) {
                modal.style.display = 'none';
                searchBar.setAttribute('aria-expanded', 'false');
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
        const sectionLink = header.querySelector('.section-link');

        // Toggle button is now a real <button> with aria-expanded and aria-controls
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = section.classList.toggle('expanded');
                content.style.display = isExpanded ? 'block' : 'none';
                toggleBtn.textContent = isExpanded ? '−' : '+';
                toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            });
        }

        // Also allow clicking anywhere on the header bar (except the link) to toggle
        header.addEventListener('click', (e) => {
            if (e.target.closest('.section-link') || e.target.closest('.toggle-btn')) {
                return;
            }
            const isExpanded = section.classList.toggle('expanded');
            content.style.display = isExpanded ? 'block' : 'none';
            if (toggleBtn) {
                toggleBtn.textContent = isExpanded ? '−' : '+';
                toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            }
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

            // Set "See more" button link
            const seeMoreBtn = document.getElementById('see-more-section-btn');
            if (seeMoreBtn) {
                seeMoreBtn.href = `section-articles.html?category=${encodeURIComponent(article.category)}&section=${encodeURIComponent(article.section)}`;
            }

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
            const feedbackModal = document.getElementById('feedback-modal');
            feedbackModal.style.display = 'block';
            yesBtn.disabled = true;
            noBtn.disabled = true;
            // Move focus into modal for screen readers (WCAG 2.4.3)
            const firstFocusable = feedbackModal.querySelector('button, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) firstFocusable.focus();
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
        let modalTrigger = null;

        function closeModal() {
            modal.style.display = 'none';
            // Restore focus to the element that opened the modal
            if (modalTrigger) modalTrigger.focus();
        }

        // Track which element opened the modal
        const noBtnEl = document.getElementById('no-btn');
        if (noBtnEl) {
            noBtnEl.addEventListener('click', () => { modalTrigger = noBtnEl; });
        }

        closeBtn.addEventListener('click', closeModal);

        // Close on backdrop click
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape key
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        // Trap focus inside modal
        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const focusable = modal.querySelectorAll('button, textarea, [tabindex]:not([tabindex="-1"])');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }
    
    // Cookie button
    const cookieButton = document.querySelector('.cookie-button');
    const acceptCookies = document.getElementById('accept-cookies');
    
    // Check if user has already accepted cookies
    if (cookieButton) {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (cookiesAccepted === 'true') {
            cookieButton.style.display = 'none';
        }
    }
    
    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            if (cookieButton) {
                cookieButton.style.display = 'none';
            }
        });
    }
});
