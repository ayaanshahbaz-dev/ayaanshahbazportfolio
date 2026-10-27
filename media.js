/**
 * media.js — Interactive Motion & Direct Video Playback Engine for /media
 * Handles Lenis smooth scrolling, GSAP ScrollTrigger reveals, dynamic card rendering,
 * direct HTML5 local MP4 video playback, 3D tilt physics, magnetic buttons, custom cursor,
 * and dynamic filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if MEDIA_DATA is loaded
    if (typeof MEDIA_DATA === 'undefined') {
        console.error('MEDIA_DATA not found. Ensure media-data.js is loaded prior to media.js.');
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Initialize Lenis Smooth Scroll
    let lenis = null;
    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    // 3. Register GSAP Plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 4. Render All Dynamic Content from MEDIA_DATA
    initContentRender();

    // 5. Initialize Interactive Systems & Animations
    initLiveTimecode();
    initScrollProgress();
    initCustomCursor();
    initMagneticElements();
    initCard3DTilt();
    initReelsFiltering();
    initHeroViewfinder();
    initBackToTop();

    // 6. Run GSAP Entrance & ScrollTrigger Animations
    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
        initGSAPAnimations();
    }

    // Re-render Lucide icons for all dynamically injected elements
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

/* ==========================================================================
   CARD RENDERING ENGINE (ONE UNIVERSAL FUNCTION)
   ========================================================================== */
/**
 * Renders a standard video card supporting direct local MP4 video playback
 * with technical specs (resolution, fps, size, duration) and original Instagram links.
 */
function renderVideoCard(video, index, options = {}) {
    const isVertical = video.orientation === 'vertical';
    const aspectClass = isVertical ? 'aspect-9-16' : 'aspect-16-9';
    const indexStr = String(index + 1).padStart(2, '0');
    const duration = video.duration || '0:30';
    const category = video.category || 'Reel';
    const client = video.client || '';
    const tags = video.tags || [];
    const isFeatured = Boolean(video.isFeatured);
    const hasVideoFile = Boolean(video.videoSrc && video.videoSrc.trim());

    // Thumbnail / Poster
    const hasThumb = Boolean(video.thumbnail && video.thumbnail.trim());

    return `
    <article class="media-video-card ${isFeatured ? 'featured-reel-card' : ''}" data-id="${video.id}" data-category="${category.toLowerCase()}" data-orientation="${video.orientation}">
        <div class="media-card-media-wrap ${aspectClass}" 
             data-video-src="${hasVideoFile ? video.videoSrc : ''}" 
             data-title="${encodeURIComponent(video.title)}"
             data-embed="${video.embedUrl || ''}"
             data-poster="${video.thumbnail || ''}"
             tabindex="0"
             role="button"
             aria-label="Play ${video.title}">
            
            ${hasThumb ? `<img src="${video.thumbnail}" alt="${video.title} Poster" class="media-card-thumb-img" loading="lazy" />` : ''}

            <!-- Styled Cinematic Placeholder Layer -->
            <div class="media-card-placeholder-bg ${hasThumb ? 'has-thumbnail' : ''}">
                <div class="media-card-topbar">
                    <span class="media-card-num-pill">${isFeatured ? '★ FEATURED 01' : indexStr}</span>
                    <span class="media-card-timecode-pill">${duration}</span>
                </div>

                <div class="media-card-center-action">
                    <div class="media-card-play-btn" aria-hidden="true">
                        <i data-lucide="play" style="width: 20px; height: 20px; fill: currentColor; margin-left: 2px;"></i>
                    </div>
                    <span class="media-card-status-badge">
                        ${hasVideoFile ? 'CLICK TO PLAY VIDEO' : 'SHOWCASE ARCHIVE'}
                    </span>
                </div>

                <div class="media-card-bottombar">
                    <span>${video.fps || (isVertical ? '9:16 VERTICAL' : '16:9 4K')}</span>
                    <span>${video.resolution || 'MP4 ARCHIVE'}</span>
                </div>
            </div>
        </div>

        <div class="media-card-body">
            <div class="media-card-category-row">
                <span class="media-card-category">${isFeatured ? 'FEATURED &middot; ' + category : category}</span>
                ${client ? `<span class="media-card-client">${client}</span>` : ''}
            </div>
            
            <h3 class="media-card-title">${video.title}</h3>

            <!-- Technical Specs HUD Bar -->
            <div class="media-card-specs-row" aria-label="Technical Video Specifications">
                ${video.resolution ? `<span>${video.resolution}</span>` : ''}
                ${video.fps ? `<span>${video.fps}</span>` : ''}
                ${video.size ? `<span>${video.size}</span>` : ''}
                ${video.bitrate ? `<span>${video.bitrate}</span>` : ''}
            </div>

            ${video.description ? `<p class="media-card-desc">${video.description}</p>` : ''}
            
            <div class="media-card-tags">
                ${tags.map(t => `<span class="media-tag">${t}</span>`).join('')}
            </div>

            ${video.permalink ? `
                <div class="media-card-action-row">
                    <a href="${video.permalink}" target="_blank" rel="noopener noreferrer" class="media-card-ig-link" onclick="event.stopPropagation();">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                        <span>Open on Instagram ↗</span>
                    </a>
                </div>
            ` : ''}
        </div>
    </article>
    `;
}

/* ==========================================================================
   POPULATE SECTIONS FROM DATA STORE
   ========================================================================== */
function initContentRender() {
    // 1. Hero Stats
    const statsContainer = document.getElementById('heroStatsContainer');
    if (statsContainer && MEDIA_DATA.heroStats) {
        statsContainer.innerHTML = MEDIA_DATA.heroStats.map((st, i) => `
            <div class="media-hero-stat-item">
                <div class="media-stat-val-wrap">
                    <span class="media-stat-counter" data-target="${st.value}">0</span>
                    <span class="media-stat-suffix">${st.suffix}</span>
                </div>
                <span class="media-stat-label">${st.label}</span>
                <span class="media-stat-sublabel">${st.sublabel}</span>
            </div>
            ${i < MEDIA_DATA.heroStats.length - 1 ? '<div class="media-stat-sep" aria-hidden="true"></div>' : ''}
        `).join('');
    }

    // 2. Reels (Vertical 9:16)
    const reelsContainer = document.getElementById('reelsGrid');
    if (reelsContainer && MEDIA_DATA.reels) {
        reelsContainer.innerHTML = MEDIA_DATA.reels.map((reel, idx) => 
            renderVideoCard(reel, idx)
        ).join('');
    }

    // 3. Widescreen & Landscape Featured Video (Horizontal 16:9 Local Video)
    const ytFeaturedContainer = document.getElementById('ytFeaturedWrap');
    if (ytFeaturedContainer && MEDIA_DATA.youtubeVideos && MEDIA_DATA.youtubeVideos.featured) {
        const feat = MEDIA_DATA.youtubeVideos.featured;
        const hasVideo = Boolean(feat.videoSrc && feat.videoSrc.trim());
        const hasThumb = Boolean(feat.thumbnail && feat.thumbnail.trim());
        ytFeaturedContainer.innerHTML = `
            <div class="media-yt-featured-card">
                <div class="media-card-media-wrap aspect-16-9" 
                     data-video-src="${hasVideo ? feat.videoSrc : ''}" 
                     data-title="${encodeURIComponent(feat.title)}"
                     data-poster="${feat.thumbnail || ''}"
                     tabindex="0"
                     role="button"
                     aria-label="Play ${feat.title}">
                    ${hasThumb ? `<img src="${feat.thumbnail}" alt="${feat.title} Poster" class="media-card-thumb-img" loading="lazy" />` : ''}
                    <div class="media-card-placeholder-bg ${hasThumb ? 'has-thumbnail' : ''}">
                        <div class="media-card-topbar">
                            <span class="media-card-num-pill">FEATURED WIDESCREEN</span>
                            <span class="media-card-timecode-pill">${feat.duration}</span>
                        </div>
                        <div class="media-card-center-action">
                            <div class="media-card-play-btn" style="width: 64px; height: 64px;">
                                <i data-lucide="play" style="width: 24px; height: 24px; fill: currentColor; margin-left: 2px;"></i>
                            </div>
                            <span class="media-card-status-badge">
                                ${hasVideo ? 'CLICK TO PLAY VIDEO' : 'FEATURE PREVIEW'}
                            </span>
                        </div>
                        <div class="media-card-bottombar">
                            <span>${feat.fps || '30 FPS'} &middot; ${feat.resolution || '16:9'}</span>
                            <span>${feat.size || 'HD MP4'}</span>
                        </div>
                    </div>
                </div>
                <div class="media-card-body">
                    <span class="media-card-category">${feat.category}</span>
                    <h3 class="media-card-title">${feat.title}</h3>
                    
                    <div class="media-card-specs-row" aria-label="Technical Video Specifications">
                        <span>${feat.resolution}</span>
                        <span>${feat.fps}</span>
                        <span>${feat.size}</span>
                        <span>${feat.bitrate || ''}</span>
                    </div>

                    <p class="media-card-desc">${feat.description}</p>
                    <div class="media-card-tags">
                        ${feat.tags.map(t => `<span class="media-tag">${t}</span>`).join('')}
                    </div>

                    ${feat.permalink ? `
                        <div class="media-card-action-row" style="margin-top: 1rem;">
                            <a href="${feat.permalink}" target="_blank" rel="noopener noreferrer" class="media-card-ig-link" onclick="event.stopPropagation();">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                                <span>Open on Instagram ↗</span>
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // YouTube Secondary Grid
    const ytGridContainer = document.getElementById('ytGrid');
    if (ytGridContainer && MEDIA_DATA.youtubeVideos && MEDIA_DATA.youtubeVideos.grid) {
        ytGridContainer.innerHTML = MEDIA_DATA.youtubeVideos.grid.map((v, i) => 
            renderVideoCard(v, i)
        ).join('');
    }

    // 4. Channel Growth Case Study
    const growthContainer = document.getElementById('growthCaseWrap');
    if (growthContainer && MEDIA_DATA.growthCase) {
        const gc = MEDIA_DATA.growthCase;
        growthContainer.innerHTML = `
            <div class="media-growth-box">
                <div class="media-growth-header">
                    <div class="media-growth-title-col">
                        <span class="media-eyebrow">CASE STUDY ARCHIVE</span>
                        <h3>${gc.channelName}</h3>
                        <p>${gc.overview}</p>
                    </div>
                    <span class="media-growth-badge">${gc.timeline}</span>
                </div>

                <!-- Before & After Metrics Grid -->
                <div class="media-growth-metrics-grid">
                    ${gc.beforeAfter.map(ba => `
                        <div class="media-growth-metric-card">
                            <span class="media-metric-title">${ba.metric}</span>
                            <span class="media-metric-after">${ba.after}</span>
                            <div class="media-metric-before-row">
                                <span>Prev: ${ba.before}</span>
                                <span class="media-metric-growth-badge">${ba.growth}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- What I Did Strategy List -->
                <div class="media-growth-did-section">
                    <div class="media-growth-did-title">EXECUTION & RETENTION BLUEPRINT</div>
                    <div class="media-growth-did-grid">
                        ${gc.whatIDid.map((item, idx) => `
                            <div class="media-growth-did-card">
                                <span class="media-did-num">0${idx + 1}</span>
                                <div class="media-did-content">
                                    <h4>${item.title}</h4>
                                    <p>${item.desc}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Mixed Grid: 16:9 & 9:16 Video Showcase -->
                <div class="media-growth-did-title" style="margin-bottom: 1.5rem;">MULTI-FORMAT PRODUCTION DELIVERABLES</div>
                <div class="media-growth-mixed-grid">
                    ${gc.showcaseVideos.map((v, idx) => renderVideoCard(v, idx)).join('')}
                </div>
            </div>
        `;
    }

    // 5. Services Section (Styled like What I Build)
    const servicesContainer = document.getElementById('servicesGrid');
    if (servicesContainer && MEDIA_DATA.services) {
        servicesContainer.innerHTML = MEDIA_DATA.services.map(srv => `
            <div class="media-service-card">
                <div class="media-service-body">
                    <div class="media-service-header">
                        <span class="media-service-num">${srv.num}</span>
                        <span class="media-service-num-line"></span>
                        <span class="media-service-badge">${srv.badge}</span>
                    </div>
                    <h3 class="media-service-title">${srv.title}</h3>
                    <span class="media-service-subtitle">${srv.subtitle}</span>
                    <p class="media-service-desc">${srv.desc}</p>
                    <ul class="media-service-features">
                        ${srv.features.map(f => `
                            <li>
                                <i data-lucide="check" aria-hidden="true"></i>
                                <span>${f}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="media-service-visual" aria-hidden="true">
                    ${srv.image ? `<img src="${srv.image}" alt="${srv.title}" class="media-service-img" loading="lazy" />` : ''}
                    <div class="media-service-img-overlay"></div>
                    <div class="media-service-visual-grid"></div>
                    <div class="media-service-visual-tag">
                        <span>${srv.badge}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 6. Bind Direct Click-To-Play for Video Media Wrappers
    document.querySelectorAll('.media-card-media-wrap').forEach(wrap => {
        const handleActivation = () => {
            const videoSrc = wrap.getAttribute('data-video-src');
            const poster = wrap.getAttribute('data-poster');
            const embedUrl = wrap.getAttribute('data-embed');
            const title = decodeURIComponent(wrap.getAttribute('data-title') || 'Video');

            // If local video exists, play directly using HTML5 video!
            if (videoSrc && videoSrc.trim()) {
                const posterAttr = poster ? `poster="${poster}"` : '';
                wrap.innerHTML = `
                    <div class="media-video-player-container">
                        <video src="${videoSrc}" 
                               ${posterAttr}
                               controls 
                               autoplay 
                               playsinline 
                               preload="auto"
                               aria-label="${title}"
                               style="width: 100%; height: 100%; object-fit: contain !important; display: block; background: #000; border-radius: inherit;">
                        </video>
                    </div>
                `;
                const vid = wrap.querySelector('video');
                if (vid) {
                    const keepContain = () => {
                        vid.style.setProperty('object-fit', 'contain', 'important');
                        vid.style.setProperty('background', '#000000', 'important');
                    };
                    vid.addEventListener('fullscreenchange', keepContain);
                    vid.addEventListener('webkitfullscreenchange', keepContain);
                    vid.addEventListener('loadedmetadata', keepContain);
                    vid.addEventListener('play', keepContain);
                    vid.addEventListener('dblclick', (e) => {
                        e.stopPropagation();
                        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                            if (vid.requestFullscreen) {
                                vid.requestFullscreen();
                            } else if (vid.webkitRequestFullscreen) {
                                vid.webkitRequestFullscreen();
                            }
                        } else {
                            if (document.exitFullscreen) {
                                document.exitFullscreen();
                            } else if (document.webkitExitFullscreen) {
                                document.webkitExitFullscreen();
                            }
                        }
                    });
                }
                showMediaNotice(`Now Playing: ${title}`);
            } else if (embedUrl && embedUrl.trim()) {
                // Fallback to embed if applicable
                wrap.innerHTML = `
                    <div class="media-iframe-container">
                        <iframe src="${embedUrl}" 
                                title="${title}"
                                frameborder="0"
                                scrolling="no"
                                allowtransparency="true"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowfullscreen
                                loading="lazy">
                        </iframe>
                    </div>
                `;
            } else {
                showMediaNotice(`Preview for "${title}" is in production archive.`);
            }
        };

        wrap.addEventListener('click', handleActivation);
        wrap.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleActivation();
            }
        });
    });
}

/* ==========================================================================
   HERO VIEWFINDER INTERACTIVE SHOWREEL (PLAYS LOCAL MP4)
   ========================================================================== */
function initHeroViewfinder() {
    const vf = document.querySelector('.media-viewfinder-frame');
    if (!vf) return;

    const videoSrc = (MEDIA_DATA.meta && MEDIA_DATA.meta.featuredVideoSrc) || 'content/Media/APS NMC Media Team Official Showcase.mp4';
    const videoTitle = (MEDIA_DATA.meta && MEDIA_DATA.meta.featuredTitle) || 'APS NMC Media Team Official Showcase';
    const videoPoster = (MEDIA_DATA.meta && MEDIA_DATA.meta.featuredThumbnail) || 'content/Media/thumbnails/thumb_APS_NMC_Media_Team_Official_Showcase.jpg';

    vf.style.cursor = 'pointer';
    vf.addEventListener('click', () => {
        if (vf.querySelector('.media-video-player-container')) return; // already playing

        vf.innerHTML = `
            <div class="media-video-player-container" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 10; background: #000; border-radius: inherit; overflow: hidden;">
                <video src="${videoSrc}" 
                       poster="${videoPoster}"
                       controls 
                       autoplay 
                       playsinline 
                       preload="auto"
                       aria-label="${videoTitle}"
                       style="width: 100%; height: 100%; object-fit: contain !important; display: block; background: #000;">
                </video>
            </div>
        `;
        const heroVid = vf.querySelector('video');
        if (heroVid) {
            const keepContain = () => {
                heroVid.style.setProperty('object-fit', 'contain', 'important');
                heroVid.style.setProperty('background', '#000000', 'important');
            };
            heroVid.addEventListener('fullscreenchange', keepContain);
            heroVid.addEventListener('webkitfullscreenchange', keepContain);
            heroVid.addEventListener('loadedmetadata', keepContain);
        }
        showMediaNotice(`Now Playing Featured: ${videoTitle}`);
    });
}

/* ==========================================================================
   MINI NOTIFICATION TOAST
   ========================================================================== */
function showMediaNotice(message) {
    let toast = document.getElementById('mediaNoticeToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'mediaNoticeToast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(30px);
            background: #18181b;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            font-size: 0.76rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            padding: 0.75rem 1.4rem;
            border-radius: 100px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
            z-index: 10000;
            opacity: 0;
            pointer-events: none;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            max-width: 90vw;
            text-align: center;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 3800);
}

/* ==========================================================================
   LIVE RUNNING TIMECODE SIMULATOR (24 FPS)
   ========================================================================== */
function initLiveTimecode() {
    const liveDisplays = document.querySelectorAll('.media-live-tc-val');
    if (!liveDisplays.length) return;

    let frames = 12;
    let seconds = 24;
    let minutes = 0;
    let hours = 0;

    setInterval(() => {
        frames++;
        if (frames >= 24) {
            frames = 0;
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }
        }

        const tcStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
        liveDisplays.forEach(el => { el.textContent = tcStr; });
    }, 1000 / 24);
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
    const bar = document.querySelector('.media-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + '%';
    }, { passive: true });
}

/* ==========================================================================
   CUSTOM CURSOR (DESKTOP / FINE POINTER ONLY)
   ========================================================================== */
function initCustomCursor() {
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;

    const cursor = document.querySelector('.media-custom-cursor');
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderCursor() {
        // Smooth lerp follow
        currentX += (mouseX - currentX) * 0.18;
        currentY += (mouseY - currentY) * 0.18;
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Event listeners to toggle PLAY state over videos
    document.addEventListener('mouseover', (e) => {
        const videoWrap = e.target.closest('.media-card-media-wrap, .media-viewfinder-frame');
        const linkBtn = e.target.closest('a, button, .media-filter-btn');

        if (videoWrap) {
            cursor.classList.add('cursor-active-video');
            cursor.classList.remove('cursor-hover-link');
        } else if (linkBtn) {
            cursor.classList.add('cursor-hover-link');
            cursor.classList.remove('cursor-active-video');
        } else {
            cursor.classList.remove('cursor-active-video');
            cursor.classList.remove('cursor-hover-link');
        }
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

/* ==========================================================================
   3D CARD HOVER TILT
   ========================================================================== */
function initCard3DTilt() {
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;
    const cards = document.querySelectorAll('.media-video-card, .media-service-card, .media-viewfinder-frame');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Maximum tilt angle: 6 degrees
            const rotateX = ((centerY - y) / centerY) * 6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

/* ==========================================================================
   MAGNETIC BUTTONS (SUBTLE CURSOR PULL)
   ========================================================================== */
function initMagneticElements() {
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;
    const magnetics = document.querySelectorAll('.media-btn-primary, .media-btn-outline, .media-filter-btn');

    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            // Pull factor
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

/* ==========================================================================
   REELS FILTERING (ANIMATED TRANSITIONS)
   ========================================================================== */
function initReelsFiltering() {
    const filterBtns = document.querySelectorAll('.media-filter-btn');
    const reelCards = document.querySelectorAll('#reelsGrid .media-video-card');

    if (!filterBtns.length || !reelCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter').toLowerCase();

            reelCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const match = (filterValue === 'all' || category === filterValue);

                if (match) {
                    card.style.display = 'flex';
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(card, 
                            { opacity: 0, scale: 0.92, y: 15 }, 
                            { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power2.out' }
                        );
                    } else {
                        card.style.opacity = '1';
                    }
                } else {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, {
                            opacity: 0,
                            scale: 0.92,
                            duration: 0.25,
                            ease: 'power2.in',
                            onComplete: () => {
                                card.style.display = 'none';
                            }
                        });
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

/* ==========================================================================
   BACK TO TOP FLOATING BUTTON
   ========================================================================== */
function initBackToTop() {
    const topBtn = document.querySelector('.media-top-btn');
    if (!topBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            topBtn.classList.add('visible');
        } else {
            topBtn.classList.remove('visible');
        }
    }, { passive: true });

    topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ==========================================================================
   GSAP ENTRANCE & SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initGSAPAnimations() {
    // 1. SplitType Typography Reveal for Hero Headline
    if (typeof SplitType !== 'undefined') {
        const heroTitle = new SplitType('.media-hero-title', { types: 'lines, words' });
        gsap.from(heroTitle.words, {
            opacity: 0,
            y: 60,
            rotateX: -30,
            stagger: 0.03,
            duration: 1.2,
            ease: 'expo.out',
            delay: 0.2
        });
    }

    // Hero Elements Reveal
    gsap.from('.media-hero-badge', { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', delay: 0.1 });
    gsap.from('.media-hero-desc', { opacity: 0, y: 25, duration: 1, ease: 'power3.out', delay: 0.4 });
    gsap.from('.media-hero-actions', { opacity: 0, y: 25, duration: 1, ease: 'power3.out', delay: 0.5 });
    gsap.from('.media-hero-stats', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.6 });
    gsap.from('.media-viewfinder-frame', { opacity: 0, scale: 0.94, y: 40, duration: 1.4, ease: 'expo.out', delay: 0.3 });

    // 2. Numeric Counters on Enter
    const counters = document.querySelectorAll('.media-stat-counter');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target')) || 0;
        gsap.fromTo(counter, 
            { innerText: 0 }, 
            {
                innerText: target,
                duration: 2,
                ease: 'power2.out',
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 90%',
                    once: true
                }
            }
        );
    });

    // 3. Section Titles & Eyebrows Stagger
    document.querySelectorAll('.media-section').forEach(sec => {
        const eyebrow = sec.querySelector('.media-eyebrow');
        const title = sec.querySelector('.media-section-title');
        const sub = sec.querySelector('.media-section-sub');

        if (eyebrow) {
            gsap.from(eyebrow, {
                opacity: 0,
                y: 20,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: sec, start: 'top 85%', once: true }
            });
        }
        if (title) {
            gsap.from(title, {
                opacity: 0,
                y: 35,
                duration: 1.1,
                ease: 'expo.out',
                scrollTrigger: { trigger: sec, start: 'top 82%', once: true }
            });
        }
        if (sub) {
            gsap.from(sub, {
                opacity: 0,
                y: 20,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: { trigger: sec, start: 'top 80%', once: true }
            });
        }
    });

    // 4. Ghost Watermarks Parallax
    document.querySelectorAll('.media-ghost-text').forEach(ghost => {
        gsap.to(ghost, {
            y: -100,
            ease: 'none',
            scrollTrigger: {
                trigger: ghost.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2
            }
        });
    });

    // 5. Marquee Ticker reacts to scroll direction & velocity
    const marqueeTrack = document.querySelector('.media-marquee-track');
    if (marqueeTrack) {
        ScrollTrigger.create({
            trigger: '.media-marquee-wrap',
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                const vel = self.getVelocity();
                // Speed up slightly with vigorous scroll
                const speed = 1 + Math.min(Math.abs(vel) / 500, 3);
                marqueeTrack.style.animationDuration = `${22 / speed}s`;
            }
        });
    }

    // 6. Staggered Card Entrances
    gsap.from('#reelsGrid .media-video-card', {
        opacity: 0,
        y: 40,
        stagger: 0.05,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#reelsGrid', start: 'top 85%', once: true }
    });

    gsap.from('#ytGrid .media-video-card', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#ytGrid', start: 'top 85%', once: true }
    });

    gsap.from('.media-service-card', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#servicesGrid', start: 'top 85%', once: true }
    });

    gsap.from('.media-growth-box', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '#growthCaseWrap', start: 'top 85%', once: true }
    });
}
