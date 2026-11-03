/**
 * case-study-modal.js
 * Interactive Glassmorphic Case Study Drawer Modal for Ayaan Shahbaz's Portfolio.
 * Works seamlessly on index.html, automation-library.html, and any subpage.
 *
 * Features:
 * - Dynamic modal injection (zero duplicated HTML)
 * - Lenis smooth-scroll pause / resume integration
 * - Deep-linkable URL hash support (#case-study=<slug>) & auto-open on load
 * - Clipboard share link with tactile "Copied!" feedback
 * - Next / Previous project carousel navigation
 * - Full keyboard accessibility (Escape to close, Left/Right arrows to cycle)
 * - Sleek Linear/Apple-inspired dark glassmorphism & 'Outfit' typography
 */

(function () {
    // State
    let currentStudyIndex = -1;
    let modalEl = null;
    let backdropEl = null;
    let drawerEl = null;
    let contentEl = null;
    let isTransitioning = false;

    // Initialize modal on DOM ready
    function init() {
        if (typeof CASE_STUDIES === 'undefined') {
            console.warn('CASE_STUDIES data not found. Ensure case-studies-data.js is loaded prior to case-study-modal.js.');
            return;
        }

        buildModalDOM();
        bindGlobalTriggers();
        checkInitialHash();

        window.addEventListener('hashchange', checkInitialHash);
        window.addEventListener('keydown', handleKeyDown);
    }

    // Create modal shell in DOM
    function buildModalDOM() {
        if (document.getElementById('caseStudyModal')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'caseStudyModal';
        wrapper.className = 'csm-modal';
        wrapper.setAttribute('aria-hidden', 'true');
        wrapper.setAttribute('role', 'dialog');
        wrapper.setAttribute('aria-modal', 'true');

        wrapper.innerHTML = `
            <div class="csm-backdrop" id="csmBackdrop"></div>
            <div class="csm-drawer" id="csmDrawer" tabindex="-1" data-lenis-prevent>
                <!-- Sticky Header -->
                <header class="csm-header">
                    <div class="csm-header-left">
                        <span class="csm-index-badge" id="csmHeaderIndex">01</span>
                        <div class="csm-header-titles">
                            <span class="csm-category" id="csmHeaderCategory">Category</span>
                            <span class="csm-type-pill" id="csmHeaderType">Project Type</span>
                        </div>
                    </div>
                    <div class="csm-header-actions">
                        <button class="csm-action-btn csm-copy-btn" id="csmCopyBtn" type="button" title="Copy link to this case study">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span class="csm-copy-text">Share</span>
                        </button>
                        <button class="csm-action-btn csm-close-btn" id="csmCloseBtn" type="button" aria-label="Close modal" title="Close (Esc)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </header>

                <!-- Scrollable Body Content -->
                <div class="csm-body" id="csmBody" data-lenis-prevent>
                    <!-- Injected dynamically via renderCaseStudy() -->
                </div>

                <!-- Footer Navigation -->
                <footer class="csm-footer">
                    <button class="csm-nav-btn csm-prev-btn" id="csmPrevBtn" type="button">
                        <span class="csm-nav-arrow">←</span>
                        <div class="csm-nav-meta">
                            <span class="csm-nav-label">Previous Project</span>
                            <span class="csm-nav-title" id="csmPrevTitle">Previous</span>
                        </div>
                    </button>
                    <div class="csm-footer-counter" id="csmFooterCounter">01 / 13</div>
                    <button class="csm-nav-btn csm-next-btn" id="csmNextBtn" type="button">
                        <div class="csm-nav-meta text-right">
                            <span class="csm-nav-label">Next Project</span>
                            <span class="csm-nav-title" id="csmNextTitle">Next</span>
                        </div>
                        <span class="csm-nav-arrow">→</span>
                    </button>
                </footer>
            </div>
        `;

        document.body.appendChild(wrapper);

        modalEl = wrapper;
        backdropEl = document.getElementById('csmBackdrop');
        drawerEl = document.getElementById('csmDrawer');
        contentEl = document.getElementById('csmBody');

        backdropEl.addEventListener('click', closeModal);
        document.getElementById('csmCloseBtn').addEventListener('click', closeModal);
        document.getElementById('csmCopyBtn').addEventListener('click', copyDirectLink);
        document.getElementById('csmPrevBtn').addEventListener('click', () => navigateProject(-1));
        document.getElementById('csmNextBtn').addEventListener('click', () => navigateProject(1));
    }

    // Attach click listeners to all data-case-study triggers on the page
    function bindGlobalTriggers() {
        document.addEventListener('click', function (e) {
            const trigger = e.target.closest('[data-case-study]');
            if (trigger) {
                e.preventDefault();
                const slug = trigger.getAttribute('data-case-study');
                openCaseStudy(slug);
            }
        });

        document.addEventListener('keydown', function (e) {
            if ((e.key === 'Enter' || e.key === ' ') && !modalEl.classList.contains('active')) {
                const trigger = e.target.closest('[data-case-study]');
                if (trigger) {
                    e.preventDefault();
                    const slug = trigger.getAttribute('data-case-study');
                    openCaseStudy(slug);
                }
            }
        });
    }

    // Open by slug or index
    function openCaseStudy(slugOrId) {
        if (!slugOrId) return;
        const index = CASE_STUDIES.findIndex(
            cs => cs.id.toLowerCase() === slugOrId.toLowerCase() || cs.slug.toLowerCase() === slugOrId.toLowerCase()
        );
        if (index === -1) return;

        currentStudyIndex = index;
        renderCaseStudy(CASE_STUDIES[index]);

        // Stop Lenis if active
        if (window.lenis && typeof window.lenis.stop === 'function') {
            window.lenis.stop();
        }

        // Lock body scrolling
        document.body.classList.add('csm-open');

        // Reveal modal
        modalEl.classList.add('active');
        modalEl.setAttribute('aria-hidden', 'false');

        // Update URL hash without jumping
        const newHash = `#case-study=${CASE_STUDIES[index].slug}`;
        if (window.location.hash !== newHash) {
            history.replaceState(null, '', newHash);
        }

        // Reset scroll position of drawer body
        contentEl.scrollTop = 0;
        drawerEl.focus();

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    // Close modal
    function closeModal() {
        if (!modalEl || !modalEl.classList.contains('active')) return;

        modalEl.classList.remove('active');
        modalEl.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('csm-open');

        // Resume Lenis if active
        if (window.lenis && typeof window.lenis.start === 'function') {
            window.lenis.start();
        }

        // Clean URL hash if it was a case-study hash
        if (window.location.hash.startsWith('#case-study')) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }

    // Navigate to next or previous case study
    function navigateProject(direction) {
        if (currentStudyIndex === -1) return;
        let nextIndex = currentStudyIndex + direction;
        if (nextIndex < 0) nextIndex = CASE_STUDIES.length - 1;
        if (nextIndex >= CASE_STUDIES.length) nextIndex = 0;

        openCaseStudy(CASE_STUDIES[nextIndex].slug);
    }

    // Render study contents into drawer
    function renderCaseStudy(study) {
        // Sticky Header elements
        document.getElementById('csmHeaderIndex').textContent = study.index || '01';
        document.getElementById('csmHeaderCategory').textContent = study.category || 'Engineering';

        const typePill = document.getElementById('csmHeaderType');
        if (study.isConfidential) {
            typePill.textContent = '🔒 Confidential Client Engagement';
            typePill.className = 'csm-type-pill confidential';
        } else {
            typePill.textContent = study.projectType || 'Independent Product';
            typePill.className = 'csm-type-pill product';
        }

        // Footer prev/next titles
        const prevIndex = (currentStudyIndex - 1 + CASE_STUDIES.length) % CASE_STUDIES.length;
        const nextIndex = (currentStudyIndex + 1) % CASE_STUDIES.length;
        document.getElementById('csmPrevTitle').textContent = CASE_STUDIES[prevIndex].title;
        document.getElementById('csmNextTitle').textContent = CASE_STUDIES[nextIndex].title;
        document.getElementById('csmFooterCounter').textContent = `${study.index} / ${String(CASE_STUDIES.length).padStart(2, '0')}`;

        // Build Metrics Strip HTML
        let metricsHTML = '';
        if (study.metrics && study.metrics.length > 0) {
            const items = study.metrics.map(m => `
                <div class="csm-metric-card">
                    <span class="csm-metric-val">${escapeHTML(m.value)}</span>
                    <span class="csm-metric-lbl">${escapeHTML(m.label)}</span>
                    ${m.sub ? `<span class="csm-metric-sub">${escapeHTML(m.sub)}</span>` : ''}
                </div>
            `).join('');
            metricsHTML = `<div class="csm-metrics-grid">${items}</div>`;
        }

        // Build Tech Stack Pills HTML
        const techPills = (study.techStack || []).map(t => `
            <span class="csm-tech-pill">${escapeHTML(t)}</span>
        `).join('');

        // Build Solutions Bullet List HTML
        const solutionItems = (study.theSolution || []).map(sol => `
            <li class="csm-list-item">
                <span class="csm-check-bullet">✓</span>
                <span class="csm-list-text">${escapeHTML(sol)}</span>
            </li>
        `).join('');

        // Build Multi-Step Architecture Workflow HTML
        let architectureHTML = '';
        if (study.architecture && study.architecture.length > 0) {
            const archSteps = study.architecture.map(step => `
                <div class="csm-arch-step">
                    <div class="csm-arch-num">${escapeHTML(step.step)}</div>
                    <div class="csm-arch-content">
                        <h4 class="csm-arch-title">${escapeHTML(step.title)}</h4>
                        <p class="csm-arch-desc">${escapeHTML(step.desc)}</p>
                    </div>
                </div>
            `).join('');
            architectureHTML = `
                <section class="csm-section csm-arch-section">
                    <div class="csm-section-header">
                        <span class="csm-sec-eyebrow">WORKFLOW & PIPELINE</span>
                        <h3 class="csm-sec-title">Technical Architecture</h3>
                    </div>
                    <div class="csm-arch-flow">${archSteps}</div>
                </section>
            `;
        }

        // Build Engineering Challenges HTML
        let challengesHTML = '';
        if (study.engineeringChallenges && study.engineeringChallenges.length > 0) {
            const challengeCards = study.engineeringChallenges.map((ch, idx) => `
                <div class="csm-challenge-card">
                    <div class="csm-ch-header">
                        <span class="csm-ch-tag">Challenge 0${idx + 1}</span>
                        <h4 class="csm-ch-title">${escapeHTML(ch.title)}</h4>
                    </div>
                    <p class="csm-ch-desc">${escapeHTML(ch.desc)}</p>
                </div>
            `).join('');
            challengesHTML = `
                <section class="csm-section">
                    <div class="csm-section-header">
                        <span class="csm-sec-eyebrow">OBSTACLES & RESOLUTIONS</span>
                        <h3 class="csm-sec-title">Engineering Challenges</h3>
                    </div>
                    <div class="csm-challenges-grid">${challengeCards}</div>
                </section>
            `;
        }

        // Confidentiality Notice Card
        let noticeHTML = '';
        if (study.isConfidential && study.confidentialityNotice) {
            noticeHTML = `
                <div class="csm-notice-card">
                    <div class="csm-notice-icon">🔒</div>
                    <div class="csm-notice-body">
                        <h5 class="csm-notice-title">Confidentiality & Attribution Notice</h5>
                        <p class="csm-notice-text">${escapeHTML(study.confidentialityNotice)}</p>
                    </div>
                </div>
            `;
        }

        // Image container with contain/cover support
        const imgClass = study.imageContain ? 'csm-hero-img contain' : 'csm-hero-img';

        contentEl.innerHTML = `
            <!-- Hero Header -->
            <div class="csm-hero-block">
                <span class="csm-eyebrow text-blue">${escapeHTML(study.category)}</span>
                <h1 class="csm-main-title">${escapeHTML(study.title)}</h1>
                <p class="csm-subtitle">${escapeHTML(study.subtitle || study.overview)}</p>

                <!-- Tech Badges -->
                <div class="csm-tech-wrap">
                    ${techPills}
                </div>
            </div>

            <!-- Visual Showcase -->
            <div class="csm-visual-wrap">
                <img src="${study.image}" alt="${escapeHTML(study.imageAlt || study.title)}" class="${imgClass}" loading="eager">
                <div class="csm-visual-overlay"></div>
            </div>

            <!-- Key Metrics Strip -->
            ${metricsHTML}

            <!-- Executive Summary & Problem vs Solution -->
            <div class="csm-grid-two-col">
                <div class="csm-card csm-card-problem">
                    <div class="csm-card-header">
                        <span class="csm-card-icon">⚠️</span>
                        <h3 class="csm-card-title">The Problem</h3>
                    </div>
                    <p class="csm-card-text">${escapeHTML(study.theProblem)}</p>
                </div>

                <div class="csm-card csm-card-solution">
                    <div class="csm-card-header">
                        <span class="csm-card-icon">⚡</span>
                        <h3 class="csm-card-title">The Engineered Solution</h3>
                    </div>
                    <ul class="csm-card-list">
                        ${solutionItems}
                    </ul>
                </div>
            </div>

            <!-- Technical Architecture -->
            ${architectureHTML}

            <!-- Engineering Challenges -->
            ${challengesHTML}

            <!-- Quantified Outcome Card -->
            <section class="csm-outcome-card">
                <div class="csm-outcome-header">
                    <span class="csm-sec-eyebrow">BUSINESS & TECHNICAL IMPACT</span>
                    <h3 class="csm-outcome-title">Measurable Outcome</h3>
                </div>
                <p class="csm-outcome-desc">${escapeHTML(study.outcome)}</p>
            </section>

            <!-- Confidentiality Notice -->
            ${noticeHTML}
        `;
    }

    // Copy link helper
    function copyDirectLink() {
        if (currentStudyIndex === -1) return;
        const slug = CASE_STUDIES[currentStudyIndex].slug;
        const origin = window.location.origin;
        const directUrl = `${origin}/#case-study=${slug}`;

        const copyBtn = document.getElementById('csmCopyBtn');
        const textSpan = copyBtn.querySelector('.csm-copy-text');

        const onSuccess = () => {
            copyBtn.classList.add('copied');
            textSpan.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                textSpan.textContent = 'Share';
            }, 2200);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(directUrl).then(onSuccess).catch(() => {
                fallbackCopy(directUrl, onSuccess);
            });
        } else {
            fallbackCopy(directUrl, onSuccess);
        }
    }

    function fallbackCopy(text, cb) {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        try {
            document.execCommand('copy');
            if (cb) cb();
        } catch (err) {
            console.error('Copy failed', err);
        }
        document.body.removeChild(temp);
    }

    // Keyboard handlers
    function handleKeyDown(e) {
        if (!modalEl || !modalEl.classList.contains('active')) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigateProject(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateProject(1);
        }
    }

    // Check hash on page load
    function checkInitialHash() {
        const hash = window.location.hash || '';
        if (hash.startsWith('#case-study=')) {
            const slug = hash.replace('#case-study=', '').trim();
            openCaseStudy(slug);
        } else if (hash.startsWith('#case-study/')) {
            const slug = hash.replace('#case-study/', '').trim();
            openCaseStudy(slug);
        }
    }

    // Basic HTML escaping
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Export global controller
    window.CaseStudyModal = {
        open: openCaseStudy,
        close: closeModal,
        getStudy: function (id) {
            return typeof getCaseStudy === 'function' ? getCaseStudy(id) : null;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
