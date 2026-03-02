/* ═══════════════════════════════════════════════════════════════════
   San Andreas United — Loading Screen  ·  app.js
   Bonez Workshop build  ·  v1.0.0
   ─────────────────────────────────────────────────────────────────

   FIVEM EVENT CONTRACT  (must not be changed):
   ───────────────────────────────────────────────────────────────
   Event  :  window  "message"
   Property: e.data.eventName  === 'loadProgress'
   Property: e.data.loadFraction  (float  0.0 → 1.0)

   Old loader  →  new loader mapping:
     loadProgress + loadFraction  →  window.addEventListener('message') → updateProgress()

   No other NUI messages were found in the original resource.
   FiveM auto-dismisses the loadscreen when the client finishes
   spawning (loadscreen_manual_shutdown is NOT enabled).
   ─────────────────────────────────────────────────────────────────
   Section map:
     A. DOM refs
     B. State
     C. Helpers
     D. Boot  — init()
     E. Background
     F. Progress  — FiveM event listener + updateProgress()
     G. Info cards
     H. Tips
     I. Server links
     J. Player count
     K. Audio player
═══════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // A.  DOM REFS
    // ─────────────────────────────────────────────────────────────
    const $ = id => document.getElementById(id);

    const dom = {
        // Header
        serverName   : $('server-name'),
        tagline      : $('tagline'),
        currentDate  : $('current-date'),
        serverStatus : $('server-status'),
        statusChip   : $('status-chip'),

        // Progress
        progressFill : $('progress-fill'),
        progressTip  : $('progress-tip'),
        progressPct  : $('progress-pct'),
        statusText   : $('status-text'),

        // Cards
        cardsViewport: $('cards-viewport'),
        cardNav      : $('card-nav'),

        // Tips
        tipText      : $('tip-text'),

        // Links
        serverLinks  : $('server-links'),
        footerLinks  : $('footer-links'),

        // Audio
        audio        : $('audio-player'),
        btnPlay      : $('btn-play'),
        btnPrev      : $('btn-prev'),
        btnNext      : $('btn-next'),
        btnMute      : $('btn-mute'),
        volumeSlider : $('volume-slider'),
        iconPlay     : $('icon-play'),
        iconPause    : $('icon-pause'),
        iconVol      : $('icon-vol'),
        iconMute     : $('icon-mute'),
        trackName    : $('track-name'),
        trackTime    : $('track-time'),
        trackBarFill : $('track-bar-fill'),

        // Background
        bgLayer      : $('bg-layer'),
        bgImage      : $('bg-image'),
        bgCanvas     : $('bg-canvas'),

        // Custom cursor (FiveM hides OS cursor during loadscreen)
        nuiCursor    : $('nui-cursor'),
    };

    // ─────────────────────────────────────────────────────────────
    // B.  STATE
    // ─────────────────────────────────────────────────────────────
    const state = {
        progress     : 0,
        trackIndex   : 0,
        isPlaying    : false,
        isMuted      : false,
        cardIndex    : 0,
        cardsPaused  : false,   // true on hover — pauses auto-rotate
        tipIndex     : 0,
        cardTimer    : null,
        tipTimer     : null,
    };

    // ─────────────────────────────────────────────────────────────
    // C.  HELPERS
    // ─────────────────────────────────────────────────────────────

    /** Clamp a number between lo and hi */
    function clamp(v, lo, hi) {
        return Math.min(hi, Math.max(lo, v));
    }

    /** Format seconds → "m:ss" */
    function fmtTime(secs) {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    /** Open URL in new tab (works in FiveM NUI) */
    function openURL(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    // ─────────────────────────────────────────────────────────────
    // C2.  CUSTOM CURSOR
    // FiveM hides the hardware cursor during loadscreens.
    // We track mousemove and reposition a CSS-drawn cursor div.
    // ─────────────────────────────────────────────────────────────
    function initCursor() {
        const cursor = dom.nuiCursor;
        if (!cursor) return;

        // Selector of elements that should show the "pointer" variant
        const POINTER_SELECTOR = 'a, button, [role="button"], .card-dot, .server-link, .footer-link, input[type="range"]';

        document.addEventListener('mousemove', function (e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top  = e.clientY + 'px';
        });

        document.addEventListener('mouseover', function (e) {
            cursor.classList.toggle('is-pointer', !!e.target.closest(POINTER_SELECTOR));
        });
    }

    // ─────────────────────────────────────────────────────────────
    // D.  BOOT
    // ─────────────────────────────────────────────────────────────
    function init() {
        applyTheme();
        setDate();
        applyServerName();
        initCursor();
        initBackground();
        initCards();
        initTips();
        initLinks();
        initAudio();
        fetchPlayerCount();
    }

    /** Apply accent color from config to the :root CSS variable */
    function applyTheme() {
        const accent = (Config.AccentColor || '#3a7bd5').trim();
        document.documentElement.style.setProperty('--accent', accent);

        // Derive glow & dim from the hex — simple rgba wrappers
        // (works for any valid hex value; falls back silently on bad input)
        try {
            const r = parseInt(accent.slice(1, 3), 16);
            const g = parseInt(accent.slice(3, 5), 16);
            const b = parseInt(accent.slice(5, 7), 16);
            document.documentElement.style.setProperty('--accent-dim',    `rgba(${r},${g},${b},0.10)`);
            document.documentElement.style.setProperty('--accent-mid',    `rgba(${r},${g},${b},0.22)`);
            document.documentElement.style.setProperty('--accent-glow',   `rgba(${r},${g},${b},0.40)`);
            document.documentElement.style.setProperty('--accent-border', `rgba(${r},${g},${b},0.28)`);
        } catch (_) { /* leave CSS defaults */ }
    }

    /** Write today's date into the header chip */
    function setDate() {
        const d   = new Date();
        const pad = n => n < 10 ? '0' + n : n;
        dom.currentDate.textContent =
            d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }

    /** Populate server name, tagline, and seal abbreviation from config */
    function applyServerName() {
        const name = (Config.ServerName || '').trim();
        const tag  = (Config.Tagline    || '').trim();

        if (dom.serverName && name) dom.serverName.textContent = name;
        if (dom.tagline    && tag)  dom.tagline.textContent    = tag;

        // Auto-generate a 2-3 letter abbreviation for the hex seal.
        // Takes the first letter of each word, upper-cased, max 3 chars.
        // e.g. "Night Shift Roleplay" → "NSR",  "Apex RP" → "AR"
        const abbrEl = document.getElementById('seal-abbr');
        const subEl  = document.getElementById('seal-sub');
        if (abbrEl && name) {
            const abbr = name
                .split(/\s+/)
                .filter(Boolean)
                .map(w => w[0].toUpperCase())
                .join('')
                .slice(0, 3);
            abbrEl.textContent = abbr || name.slice(0, 3).toUpperCase();
        }
        // Update the subtitle line in the seal to the first word of the name
        if (subEl && name) {
            subEl.textContent = name.split(/\s+/)[0].toUpperCase().slice(0, 8);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // E.  BACKGROUND
    // ─────────────────────────────────────────────────────────────
    function initBackground() {
        const mode = (Config.BackgroundMode || 'gradient').toLowerCase();

        if (mode === 'particles') {
            // Add class so CSS reveals the canvas and switches gradient
            // to a transparent vignette (so particles are visible).
            dom.bgLayer.classList.add('has-particles');
            runParticleCanvas();

        } else if (mode === 'image') {
            const src = (Config.BackgroundImage || '').trim();
            if (!src) return;

            // Set the background directly — do NOT use new Image() preload.
            // FiveM's CEF does not reliably fire onload for NUI resource URLs,
            // so the preload callback would never trigger.
            // The CSS opacity:0 → 1 transition (1s) provides a smooth reveal.
            // If the path is wrong, the div stays transparent (gradient shows).
            dom.bgImage.style.backgroundImage = 'url(' + src + ')';
            dom.bgLayer.classList.add('has-image');
        }
        // 'gradient' mode: no JS needed — CSS handles it by default.
    }

    /** Lightweight canvas particle drift (≈ 60 particles, raf-driven) */
    function runParticleCanvas() {
        const canvas = dom.bgCanvas;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let W, H;

        function resize() {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        // Parse accent color for particle color
        const accent = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent').trim() || '#3a7bd5';

        const particles = Array.from({ length: 80 }, () => ({
            x  : Math.random() * window.innerWidth,
            y  : Math.random() * window.innerHeight,
            r  : Math.random() * 2.2 + 0.6,   // 0.6–2.8px — visible at 1440p
            dx : (Math.random() - 0.5) * 0.32,
            dy : (Math.random() - 0.5) * 0.32,
            a  : Math.random() * 0.55 + 0.20,  // 0.20–0.75 — clearly visible
        }));

        function draw() {
            ctx.clearRect(0, 0, W, H);
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = accent;
                ctx.globalAlpha = p.a;
                ctx.fill();
                ctx.globalAlpha = 1;

                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > W) p.dx *= -1;
                if (p.y < 0 || p.y > H) p.dy *= -1;
            }
            requestAnimationFrame(draw);
        }

        draw();
    }

    // ─────────────────────────────────────────────────────────────
    // F.  PROGRESS  —  FiveM event listener + updateProgress()
    // ─────────────────────────────────────────────────────────────

    /**
     * STATUS_MESSAGES
     * Maps loading percentage thresholds to human-readable status lines.
     * The last message with threshold ≤ currentProgress is shown.
     */
    const STATUS_MESSAGES = [
        { at:  0, text: 'Connecting to server…'         },
        { at:  3, text: 'Initializing resources…'       },
        { at: 12, text: 'Loading game assets…'          },
        { at: 28, text: 'Streaming world geometry…'     },
        { at: 48, text: 'Loading player data…'          },
        { at: 66, text: 'Populating the world…'         },
        { at: 82, text: 'Spawning environment…'         },
        { at: 93, text: 'Almost ready…'                 },
        { at: 98, text: 'Entering San Andreas…'         },
    ];

    function resolveStatusText(pct) {
        let msg = STATUS_MESSAGES[0].text;
        for (const s of STATUS_MESSAGES) {
            if (pct >= s.at) msg = s.text;
        }
        return msg;
    }

    /** Called whenever a loadProgress message arrives (or for testing) */
    function updateProgress(pct) {
        pct = clamp(Math.round(pct), 0, 100);

        // Only update DOM when value actually changed
        if (pct === state.progress && pct !== 0) return;
        state.progress = pct;

        const pctStr = String(pct);

        // Percentage counter
        dom.progressPct.textContent = pctStr;

        // Bar fill width
        dom.progressFill.style.width = pct + '%';

        // Glowing tip orb at leading edge
        // We subtract a small offset so the orb straddles the edge
        dom.progressTip.style.left = clamp(pct, 0, 99.5) + '%';

        // Status label
        dom.statusText.textContent = resolveStatusText(pct);

        // Completion flash at 100 %
        if (pct >= 100) {
            dom.progressFill.classList.add('complete');
        }
    }

    // ─── FIVEM NUI MESSAGE LISTENER ──────────────────────────────
    // Contract: e.data.eventName === 'loadProgress'
    //           e.data.loadFraction  (0.0 – 1.0)
    //
    // Matching the original loader exactly:
    //   Old: window.addEventListener('message', e => { if(e.data.eventName==='loadProgress') ... })
    //   New: identical listener, same property names
    // ─────────────────────────────────────────────────────────────
    window.addEventListener('message', function (e) {
        // Guard: ignore messages without expected shape
        if (!e.data || typeof e.data !== 'object') return;

        if (e.data.eventName === 'loadProgress') {
            const fraction = parseFloat(e.data.loadFraction);
            if (!isNaN(fraction)) {
                updateProgress(fraction * 100);
            }
        }
    });

    // ─────────────────────────────────────────────────────────────
    // G.  INFO CARDS  (left panel, auto-rotating)
    // ─────────────────────────────────────────────────────────────
    function initCards() {
        const cards = Array.isArray(Config.Cards) ? Config.Cards : [];
        if (!cards.length) return;

        // Build card elements
        cards.forEach((card, i) => {
            const el = document.createElement('div');
            el.className = 'info-card' + (i === 0 ? ' active' : '');
            el.innerHTML =
                `<div class="card-icon">${card.icon || ''}</div>` +
                `<div class="card-title">${escHtml(card.title || '')}</div>` +
                `<ul class="card-items">` +
                (card.items || []).map(t => `<li>${escHtml(t)}</li>`).join('') +
                `</ul>`;
            dom.cardsViewport.appendChild(el);

            // Nav dot
            const dot = document.createElement('span');
            dot.className = 'card-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => showCard(i));
            dom.cardNav.appendChild(dot);
        });

        // Pause rotation on hover
        dom.cardsViewport.addEventListener('mouseenter', () => { state.cardsPaused = true; });
        dom.cardsViewport.addEventListener('mouseleave', () => { state.cardsPaused = false; });

        // Auto-rotate
        state.cardTimer = setInterval(nextCard, Config.CardRotationInterval || 7000);
    }

    /** Transition to card at index i */
    function showCard(i) {
        const allCards = dom.cardsViewport.querySelectorAll('.info-card');
        const allDots  = dom.cardNav.querySelectorAll('.card-dot');
        if (!allCards.length) return;

        allCards[state.cardIndex].classList.remove('active');
        allDots[state.cardIndex].classList.remove('active');

        state.cardIndex = ((i % allCards.length) + allCards.length) % allCards.length;

        allCards[state.cardIndex].classList.add('active');
        allDots[state.cardIndex].classList.add('active');
    }

    function nextCard() {
        if (state.cardsPaused) return;
        const total = dom.cardsViewport.querySelectorAll('.info-card').length;
        if (total > 0) showCard((state.cardIndex + 1) % total);
    }

    // ─────────────────────────────────────────────────────────────
    // H.  TIPS  (right panel, slower rotation)
    // ─────────────────────────────────────────────────────────────
    function initTips() {
        const tips = Array.isArray(Config.Tips) ? Config.Tips : [];
        if (!tips.length) {
            dom.tipText.textContent = '';
            return;
        }

        dom.tipText.textContent = tips[0];
        state.tipIndex = 0;

        state.tipTimer = setInterval(function () {
            state.tipIndex = (state.tipIndex + 1) % tips.length;

            dom.tipText.classList.add('tip-fade');

            setTimeout(function () {
                dom.tipText.textContent = tips[state.tipIndex];
                dom.tipText.classList.remove('tip-fade');
            }, 450);

        }, 9000);
    }

    // ─────────────────────────────────────────────────────────────
    // I.  SERVER LINKS
    // ─────────────────────────────────────────────────────────────

    /** Inline SVG icons for each link type */
    const LINK_ICONS = {
        discord : `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037
            c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0
            12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037
            A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027
            C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.055
            5.842 5.842 0 0 0 1.724.87.078.078 0 0 0 .084-.028
            c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106
            5.632 5.632 0 0 1-.818-.392.077.077 0 0 1-.008-.128
            c.55-.413 1.1-.852 1.615-1.303a.074.074 0 0 1 .078-.01
            c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.01
            c.514.45 1.064.89 1.614 1.303a.077.077 0 0 1-.007.127
            c-.26.14-.532.274-.818.393a.077.077 0 0 0-.041.107
            c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028
            19.838 19.838 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054
            c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
        </svg>`,

        web     : `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
            10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93
            0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54
            c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2
            c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5
            7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>`,

        store   : `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 6H17c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12
            c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3
            c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-1.66 0-3-1.34-3-3
            h2c0 .55.45 1 1 1s1-.45 1-1h2c0 1.66-1.34 3-3 3z"/>
        </svg>`,

        tiktok  : `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67
            a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89
            2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01
            a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34
            6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34
            V8.69a8.18 8.18 0 0 0 4.78 1.52V6.73a4.85 4.85 0 0 1-1-.04z"/>
        </svg>`,

        twitter : `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231
            -5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161
            17.52h1.833L7.084 4.126H5.117z"/>
        </svg>`,

        youtube : `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545
            12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502
            6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0
            2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505
            a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93
            -.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>`,
    };

    function initLinks() {
        const links = Array.isArray(Config.Links) ? Config.Links : [];
        if (!links.length) return;

        // Right panel: full link buttons
        links.forEach(function (link) {
            const a = document.createElement('a');
            a.className = 'server-link';
            a.href      = '#';
            a.setAttribute('role', 'button');

            const iconSvg = LINK_ICONS[link.icon] || LINK_ICONS.web;
            a.innerHTML =
                `<span class="link-icon">${iconSvg}</span>` +
                `<span class="link-label">${escHtml(link.label)}</span>` +
                `<span class="link-arrow" aria-hidden="true">→</span>`;

            a.addEventListener('click', function (e) {
                e.preventDefault();
                openURL(link.url);
            });

            dom.serverLinks.appendChild(a);
        });

        // Footer: text-only quick links
        links.forEach(function (link) {
            const a = document.createElement('a');
            a.className   = 'footer-link';
            a.href        = '#';
            a.textContent = link.label;
            a.addEventListener('click', function (e) {
                e.preventDefault();
                openURL(link.url);
            });
            dom.footerLinks.appendChild(a);
        });
    }

    /** Minimal HTML escape to prevent XSS from config values */
    function escHtml(str) {
        return String(str)
            .replace(/&/g,  '&amp;')
            .replace(/</g,  '&lt;')
            .replace(/>/g,  '&gt;')
            .replace(/"/g,  '&quot;');
    }

    // ─────────────────────────────────────────────────────────────
    // J.  PLAYER COUNT  (live fetch from FiveM endpoints)
    // ─────────────────────────────────────────────────────────────
    function fetchPlayerCount() {
        const ip = (Config.ServerIP || '').trim();
        if (!ip) return;

        const base = 'http://' + ip;

        // Race: if either fetch takes > 5 s, abandon silently
        const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000));

        Promise.race([
            fetch(base + '/info.json')
                .then(r => r.json())
                .then(info => fetch(base + '/players.json').then(r => r.json()).then(players => {
                    const chip = dom.statusChip;
                    if (!chip) return;
                    const label = chip.querySelector('.chip-label');
                    const value = chip.querySelector('.chip-value');
                    if (label) label.textContent = 'PLAYERS';
                    if (value) {
                        value.textContent = players.length + ' / ' + (info.vars?.sv_maxClients || '??');
                        value.classList.remove('chip-online');   // remove dot — replaced by count
                    }
                })),
            timeout,
        ]).catch(() => {
            // Server unreachable during loading — status chip keeps "ONLINE" with dot
        });
    }

    // ─────────────────────────────────────────────────────────────
    // K.  AUDIO PLAYER  (playlist, play/pause, volume, mute)
    // ─────────────────────────────────────────────────────────────
    function initAudio() {
        const playlist = Array.isArray(Config.Playlist) ? Config.Playlist : [];
        if (!playlist.length) {
            // No tracks configured — hide music controls gracefully
            dom.trackName.textContent = 'No tracks configured';
            return;
        }

        const audio = dom.audio;
        audio.volume = clamp((Config.DefaultVolume || 30), 0, 100) / 100;
        dom.volumeSlider.value = Config.DefaultVolume || 30;

        // ── Internal helpers ──────────────────────────────────────

        function loadTrack(index) {
            const track = playlist[index];
            if (!track) return;
            audio.src = track.file;
            dom.trackName.textContent = track.title || track.file.split('/').pop().replace(/\.[^.]+$/, '');
            // Reset bar
            dom.trackBarFill.style.width = '0%';
            dom.trackTime.textContent    = '0:00';
        }

        function play() {
            // .play() returns a Promise — catch autoplay policy blocks
            const p = audio.play();
            if (p !== undefined) {
                p.then(function () {
                    state.isPlaying = true;
                    dom.iconPlay.style.display  = 'none';
                    dom.iconPause.style.display = 'block';
                }).catch(function () {
                    // Autoplay blocked by browser — user must click play
                    state.isPlaying = false;
                    dom.iconPlay.style.display  = 'block';
                    dom.iconPause.style.display = 'none';
                });
            }
        }

        function pause() {
            audio.pause();
            state.isPlaying = false;
            dom.iconPlay.style.display  = 'block';
            dom.iconPause.style.display = 'none';
        }

        function setMuted(muted) {
            state.isMuted      = muted;
            audio.muted        = muted;
            dom.iconVol.style.display  = muted ? 'none'  : 'block';
            dom.iconMute.style.display = muted ? 'block' : 'none';
            dom.btnMute.classList.toggle('muted', muted);
        }

        // ── Load first track ──────────────────────────────────────
        loadTrack(0);
        state.trackIndex = 0;

        if (Config.Autoplay !== false) {
            play();
        }

        // ── Controls ──────────────────────────────────────────────

        dom.btnPlay.addEventListener('click', function () {
            if (state.isPlaying) pause();
            else                 play();
        });

        dom.btnNext.addEventListener('click', function () {
            state.trackIndex = (state.trackIndex + 1) % playlist.length;
            loadTrack(state.trackIndex);
            if (state.isPlaying) play();
        });

        dom.btnPrev.addEventListener('click', function () {
            // If more than 3 s in, restart current track; otherwise go back
            if (audio.currentTime > 3) {
                audio.currentTime = 0;
            } else {
                state.trackIndex = (state.trackIndex - 1 + playlist.length) % playlist.length;
                loadTrack(state.trackIndex);
                if (state.isPlaying) play();
            }
        });

        dom.btnMute.addEventListener('click', function () {
            setMuted(!state.isMuted);
        });

        dom.volumeSlider.addEventListener('input', function () {
            const vol = dom.volumeSlider.value / 100;
            audio.volume = vol;
            // If user raises volume while muted, auto-unmute
            if (vol > 0 && state.isMuted) setMuted(false);
        });

        // ── Track end → advance to next ───────────────────────────
        audio.addEventListener('ended', function () {
            state.trackIndex = (state.trackIndex + 1) % playlist.length;
            loadTrack(state.trackIndex);
            play();
        });

        // ── Time update → progress bar + clock ───────────────────
        audio.addEventListener('timeupdate', function () {
            if (!audio.duration || isNaN(audio.duration)) return;
            const pct = (audio.currentTime / audio.duration) * 100;
            dom.trackBarFill.style.width = pct + '%';
            dom.trackTime.textContent    = fmtTime(audio.currentTime);
        });

        // ── Graceful error handling ───────────────────────────────
        audio.addEventListener('error', function () {
            // Don't freeze — just show a message and stop trying
            dom.trackName.textContent = 'Audio unavailable';
            state.isPlaying           = false;
            dom.iconPlay.style.display  = 'block';
            dom.iconPause.style.display = 'none';
        });
    }

    // ─────────────────────────────────────────────────────────────
    // BOOT
    // ─────────────────────────────────────────────────────────────
    // Wait for DOM to be ready (script is at end of body so it's
    // always ready, but this guard costs nothing).
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
