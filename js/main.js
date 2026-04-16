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
            const urlPath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
            controls.innerHTML = `
                <a href="https://support-ads.unity.com/s/ContactUs" class="btn-submit">Submit a request</a>
                <a href="${urlPath}my-requests.html" class="btn-submit">My Requests</a>
                <div class="user-menu" style="display: inline-block; position: relative; vertical-align: middle;">
                    <button class="user-icon" aria-expanded="false" aria-haspopup="true" aria-label="User menu" style="width: 30px; height: 30px; border-radius: 50%; background-color: #007bff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; border: none; padding: 0;">U</button>
                    <div class="dropdown-content" role="menu" style="display: none; position: absolute; right: 0; background-color: #fff; color: #333; min-width: 160px; box-shadow: 0 8px 16px rgba(0,0,0,0.2); z-index: 10; border-radius: 5px;">
                        <a href="#" id="sign-out-btn" role="menuitem" style="color: black; padding: 12px 16px; text-decoration: none; display: block;">Sign out</a>
                    </div>
                </div>
            `;
            headerNav.prepend(controls);
            const userMenuBtn = headerNav.querySelector('.user-icon');
            const dropdown = headerNav.querySelector('.dropdown-content');

            function toggleUserMenu() {
                const isOpen = dropdown.style.display === 'block';
                dropdown.style.display = isOpen ? 'none' : 'block';
                userMenuBtn.setAttribute('aria-expanded', String(!isOpen));
                if (!isOpen) {
                    const firstItem = dropdown.querySelector('a');
                    if (firstItem) firstItem.focus();
                }
            }

            userMenuBtn.addEventListener('click', toggleUserMenu);
            userMenuBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleUserMenu();
                } else if (e.key === 'Escape') {
                    dropdown.style.display = 'none';
                    userMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });

            dropdown.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dropdown.style.display = 'none';
                    userMenuBtn.setAttribute('aria-expanded', 'false');
                    userMenuBtn.focus();
                }
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.user-menu')) {
                    dropdown.style.display = 'none';
                    userMenuBtn.setAttribute('aria-expanded', 'false');
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
            const searchBarContainer = searchBar.closest('.search-bar') || searchBar.closest('.search-container');
            searchBarContainer.style.position = 'relative';
            searchBarContainer.appendChild(modal);

            const isInline = searchBarContainer.closest('.breadcrumbs');
            const isHeroContainer = searchBarContainer.classList && searchBarContainer.classList.contains('search-container');
            if (isInline) {
                modal.style.cssText = 'position: absolute; background: white; width: 100%; top: 100%; left: 0; border: 1px solid #ccc; border-top: none; box-shadow: 0 5px 10px rgba(0,0,0,0.1); z-index: 100; text-align: left; border-radius: 0 0 5px 5px; margin-top: 5px;';
            } else if (isHeroContainer) {
                modal.style.cssText = 'position: absolute; background: white; width: 100%; top: 100%; left: 0; border: 1px solid #ccc; border-top: none; box-shadow: 0 5px 10px rgba(0,0,0,0.1); z-index: 1001; text-align: left; border-radius: 0 0 8px 8px; margin-top: -1px;';
            } else {
                modal.style.cssText = 'position: absolute; background: white; width: 62%; left: 19%; border: 1px solid #ccc; border-top: none; box-shadow: 0 5px 10px rgba(0,0,0,0.1); z-index: 100; text-align: left; border-radius: 0 0 5px 5px;';
            }

            // Live region for announcing result count
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.id = 'search-live-region';
            searchBarContainer.appendChild(liveRegion);
        }

        searchBar.setAttribute('role', 'combobox');
        searchBar.setAttribute('aria-autocomplete', 'list');
        searchBar.setAttribute('aria-controls', 'search-suggestions');
        searchBar.setAttribute('aria-expanded', 'false');

        let activeIndex = -1;

        function updateSearchSuggestions(query) {
            if (query.length < 3) {
                modal.style.display = 'none';
                searchBar.setAttribute('aria-expanded', 'false');
                const liveRegion = document.getElementById('search-live-region');
                if (liveRegion) liveRegion.textContent = '';
                return;
            }
            const results = articles.filter(a => a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query)).slice(0, 5);
            modal.innerHTML = '';
            activeIndex = -1;
            if (results.length > 0) {
                results.forEach((r, idx) => {
                    const item = document.createElement('a');
                    const urlPath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
                    item.href = `${urlPath}article.html?id=${r.id}`;
                    item.setAttribute('role', 'option');
                    item.id = `search-option-${idx}`;
                    item.style.cssText = 'display: block; padding: 10px 15px; text-decoration: none; color: #333; border-bottom: 1px solid #f0f0f0;';

                    const titleDiv = document.createElement('div');
                    titleDiv.textContent = r.title;
                    titleDiv.style.cssText = 'font-weight: 500; margin-bottom: 3px;';

                    const locationDiv = document.createElement('div');
                    locationDiv.textContent = `${r.category} > ${r.section}`;
                    locationDiv.style.cssText = 'font-size: 0.85em; color: #888;';

                    item.appendChild(titleDiv);
                    item.appendChild(locationDiv);
                    modal.appendChild(item);
                });
                modal.style.display = 'block';
                searchBar.setAttribute('aria-expanded', 'true');
                const liveRegion = document.getElementById('search-live-region');
                if (liveRegion) liveRegion.textContent = `${results.length} suggestion${results.length !== 1 ? 's' : ''} available`;
            } else {
                modal.style.display = 'none';
                searchBar.setAttribute('aria-expanded', 'false');
                const liveRegion = document.getElementById('search-live-region');
                if (liveRegion) liveRegion.textContent = 'No suggestions found';
            }
        }

        searchBar.addEventListener('keyup', (e) => {
            if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) return;
            const query = e.target.value.toLowerCase();
            updateSearchSuggestions(query);
        });

        searchBar.addEventListener('keydown', (e) => {
            const items = modal.querySelectorAll('[role="option"]');
            if (e.key === 'Enter') {
                if (activeIndex >= 0 && items[activeIndex]) {
                    window.location.href = items[activeIndex].href;
                } else {
                    const query = e.target.value.toLowerCase();
                    const urlPath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
                    window.location.href = `${urlPath}search-results.html?q=${encodeURIComponent(query)}`;
                }
                return;
            }
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                searchBar.setAttribute('aria-expanded', 'false');
                searchBar.removeAttribute('aria-activedescendant');
                activeIndex = -1;
                return;
            }
            if (e.key === 'ArrowDown' && items.length > 0) {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % items.length;
                items.forEach(i => i.style.backgroundColor = '');
                items[activeIndex].style.backgroundColor = '#f0f0f0';
                searchBar.setAttribute('aria-activedescendant', items[activeIndex].id);
            }
            if (e.key === 'ArrowUp' && items.length > 0) {
                e.preventDefault();
                activeIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
                items.forEach(i => i.style.backgroundColor = '');
                items[activeIndex].style.backgroundColor = '#f0f0f0';
                searchBar.setAttribute('aria-activedescendant', items[activeIndex].id);
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
        const toggleButton = header.querySelector('.section-toggle');
        const toggleIcon = header.querySelector('.toggle-btn');

        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                const isExpanded = section.classList.toggle('expanded');
                content.style.display = isExpanded ? 'block' : 'none';
                toggleButton.setAttribute('aria-expanded', String(isExpanded));
                if (toggleIcon) toggleIcon.textContent = isExpanded ? '−' : '+';
            });
        } else {
            header.addEventListener('click', (e) => {
                if (e.target.closest('.section-link')) return;
                const isExpanded = section.classList.toggle('expanded');
                content.style.display = isExpanded ? 'block' : 'none';
                if (toggleIcon) toggleIcon.textContent = isExpanded ? '−' : '+';
            });
        }
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
            // Focus the first focusable element in the modal
            const closeBtn = feedbackModal.querySelector('.close-button');
            if (closeBtn) closeBtn.focus();
            feedbackModal._previousFocus = noBtn;
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

    // Modal close logic with focus management
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        function closeModal() {
            modal.style.display = 'none';
            if (modal._previousFocus) {
                modal._previousFocus.focus();
            }
        }

        const closeBtn = modal.querySelector('.close-button');
        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
                return;
            }
            // Focus trap
            if (e.key === 'Tab') {
                const focusable = modal.querySelectorAll('button, textarea, a[href], input, [tabindex]:not([tabindex="-1"])');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
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

    // --- Search results page (filters + dynamic list) ---
    if (document.body.classList.contains('page-search-results')) {
        const filtersRoot = document.getElementById('search-results-filters');
        const listRoot = document.getElementById('search-results-article-list');
        const headingEl = document.getElementById('search-results-heading');
        const searchInput = document.getElementById('search-results-input');

        function matchesQuery(article, q) {
            const s = (q || '').trim().toLowerCase();
            if (!s) return true;
            return article.title.toLowerCase().includes(s) || article.content.toLowerCase().includes(s);
        }

        function productsForDepartment(department) {
            if (department === 'Monetization') return [...SUPPORT_TAXONOMY.supplyProducts];
            if (department === 'User Acquisition') return [...SUPPORT_TAXONOMY.demandProducts];
            return [...SUPPORT_TAXONOMY.supplyProducts, ...SUPPORT_TAXONOMY.demandProducts];
        }

        function readState() {
            const params = new URLSearchParams(window.location.search);
            let q = (params.get('q') || '').trim();
            let department = params.get('department') || '';
            if (department === 'Supply') department = 'Monetization';
            if (department === 'Demand') department = 'User Acquisition';
            if (department && !SUPPORT_TAXONOMY.departments.includes(department)) {
                department = '';
            }
            let product = params.get('product') || '';
            const rawCats = params.getAll('category').filter(Boolean);
            const categories = rawCats.filter((c) => SUPPORT_TAXONOMY.supportCategories.includes(c));
            const allowedProducts = productsForDepartment(department);
            if (product && !allowedProducts.includes(product)) {
                product = '';
            }
            return { q, department, product, categories };
        }

        function writeState(state) {
            const params = new URLSearchParams();
            const qTrim = (state.q || '').trim();
            if (qTrim) params.set('q', qTrim);
            if (state.department) params.set('department', state.department);
            if (state.product) params.set('product', state.product);
            state.categories.forEach((c) => params.append('category', c));
            const path = window.location.pathname;
            const qs = params.toString();
            window.history.replaceState({}, '', qs ? `${path}?${qs}` : path);
        }

        function countBy(list, predicate) {
            return list.filter(predicate).length;
        }

        function renderFilters(state, textMatched) {
            const dept = state.department;
            const productOptions = productsForDepartment(dept);

            const deptRadios = SUPPORT_TAXONOMY.departments.map((d) => {
                const n = countBy(textMatched, (a) => a.department === d);
                const id = `filter-dept-${d.replace(/\s+/g, '-')}`;
                return `<label class="search-filter-option" for="${id}"><input type="radio" name="filter-department" id="${id}" value="${d.replace(/"/g, '&quot;')}" ${state.department === d ? 'checked' : ''}> ${d} <span class="search-filter-count">(${n})</span></label>`;
            }).join('');

            const anyDeptId = 'filter-dept-any';
            const productSelectOptions = ['<option value="">Any product</option>']
                .concat(
                    productOptions.map((p) => {
                        const pool = dept ? textMatched.filter((a) => a.department === dept) : textMatched;
                        const n = countBy(pool, (a) => a.product === p);
                        return `<option value="${p.replace(/"/g, '&quot;')}" ${state.product === p ? 'selected' : ''}>${p} (${n})</option>`;
                    })
                )
                .join('');

            const categoryChecks = SUPPORT_TAXONOMY.supportCategories.map((c) => {
                const id = `filter-cat-${c.replace(/[^a-zA-Z0-9]/g, '-')}`;
                const n = countBy(textMatched, (a) => a.supportCategory === c);
                const checked = state.categories.includes(c) ? 'checked' : '';
                return `<label class="search-filter-option" for="${id}"><input type="checkbox" name="filter-category" id="${id}" value="${c.replace(/"/g, '&quot;')}" ${checked}> ${c} <span class="search-filter-count">(${n})</span></label>`;
            }).join('');

            filtersRoot.innerHTML = `
                <h3>Filters</h3>
                <fieldset class="search-filter-fieldset">
                    <legend>Business Department</legend>
                    <div class="search-filter-stack">
                        <label class="search-filter-option" for="${anyDeptId}">
                            <input type="radio" name="filter-department" id="${anyDeptId}" value="" ${!state.department ? 'checked' : ''}> Any
                            <span class="search-filter-count">(${textMatched.length})</span>
                        </label>
                        ${deptRadios}
                    </div>
                </fieldset>
                <fieldset class="search-filter-fieldset">
                    <legend>Product</legend>
                    <label for="filter-product-select" class="sr-only">Product</label>
                    <select id="filter-product-select" class="search-filter-select">${productSelectOptions}</select>
                </fieldset>
                <fieldset class="search-filter-fieldset">
                    <legend>Category</legend>
                    <div class="search-filter-stack">${categoryChecks}</div>
                </fieldset>
                <button type="button" class="search-filter-clear" id="search-filter-clear">Clear filters</button>
            `;

            filtersRoot.querySelectorAll('input[name="filter-department"]').forEach((el) => {
                el.addEventListener('change', () => {
                    const next = readState();
                    next.q = searchInput ? searchInput.value : next.q;
                    next.department = filtersRoot.querySelector('input[name="filter-department"]:checked')?.value || '';
                    const allowed = productsForDepartment(next.department);
                    if (next.product && !allowed.includes(next.product)) next.product = '';
                    next.categories = Array.from(filtersRoot.querySelectorAll('input[name="filter-category"]:checked')).map((x) => x.value);
                    writeState(next);
                    refresh();
                });
            });

            const productSelect = document.getElementById('filter-product-select');
            productSelect.addEventListener('change', () => {
                const next = readState();
                next.q = searchInput ? searchInput.value : next.q;
                next.department = filtersRoot.querySelector('input[name="filter-department"]:checked')?.value || '';
                next.product = productSelect.value || '';
                next.categories = Array.from(filtersRoot.querySelectorAll('input[name="filter-category"]:checked')).map((x) => x.value);
                writeState(next);
                refresh();
            });

            filtersRoot.querySelectorAll('input[name="filter-category"]').forEach((el) => {
                el.addEventListener('change', () => {
                    const next = readState();
                    next.q = searchInput ? searchInput.value : next.q;
                    next.department = filtersRoot.querySelector('input[name="filter-department"]:checked')?.value || '';
                    next.product = document.getElementById('filter-product-select').value || '';
                    next.categories = Array.from(filtersRoot.querySelectorAll('input[name="filter-category"]:checked')).map((x) => x.value);
                    writeState(next);
                    refresh();
                });
            });

            document.getElementById('search-filter-clear').addEventListener('click', () => {
                const next = { q: searchInput ? searchInput.value : readState().q, department: '', product: '', categories: [] };
                writeState(next);
                refresh();
            });
        }

        function applyTaxonomyFilters(list, state) {
            let out = list;
            if (state.department) {
                out = out.filter((a) => a.department === state.department);
            }
            if (state.product) {
                out = out.filter((a) => a.product === state.product);
            }
            if (state.categories.length > 0) {
                out = out.filter((a) => state.categories.includes(a.supportCategory));
            }
            return out;
        }

        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        function snippet(text, q, maxLen) {
            const lower = text.toLowerCase();
            const idx = q ? lower.indexOf(q.toLowerCase()) : -1;
            let chunk = text;
            if (idx >= 0) {
                const start = Math.max(0, idx - 40);
                chunk = (start > 0 ? '…' : '') + text.slice(start, idx + maxLen);
            } else {
                chunk = text.slice(0, maxLen);
            }
            if (text.length > chunk.length) chunk += '…';
            return chunk;
        }

        function refresh() {
            const state = readState();
            if (searchInput && searchInput.value !== state.q) searchInput.value = state.q;

            const textMatched = articles.filter((a) => matchesQuery(a, state.q));
            renderFilters(state, textMatched);
            const filtered = applyTaxonomyFilters(textMatched, state);

            const qLabel = state.q.trim() ? `'${state.q}'` : 'all articles';
            headingEl.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for ${qLabel}`;

            if (filtered.length === 0) {
                listRoot.innerHTML = '<p class="search-results-empty">No articles match your search and filters.</p>';
                return;
            }

            listRoot.innerHTML = filtered
                .map((article) => {
                    const desc = snippet(article.content, state.q, 160);
                    const safeDesc = escapeHtml(desc);
                    const qTrim = (state.q || '').trim();
                    const boldQ = qTrim
                        ? safeDesc.replace(new RegExp(qTrim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), (m) => `<b>${m}</b>`)
                        : safeDesc;
                    return `
                <div class="article-list-item">
                    <h3><a href="article.html?id=${article.id}">${escapeHtml(article.title)}</a></h3>
                    <p>${boldQ}</p>
                    <div class="article-meta">Likes: ${article.likes} | Updated on ${escapeHtml(article.updated)}</div>
                </div>`;
                })
                .join('');
        }

        if (searchInput) {
            searchInput.value = readState().q;
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const next = readState();
                    next.q = searchInput.value.trim();
                    writeState(next);
                    refresh();
                }
            });
        }

        refresh();
    }
});
