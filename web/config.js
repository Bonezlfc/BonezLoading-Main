// ═══════════════════════════════════════════════════════════════
//  FiveM Loading Screen — config.js
//  Built by Bonez Workshop
//  ─────────────────────────────────────────────────────────────
//  HOW TO USE:
//  Edit the values below to match YOUR server.
//  All text marked  ← CHANGE THIS  must be updated before use.
//  Do NOT rename the `Config` variable.
// ═══════════════════════════════════════════════════════════════

const Config = {

    // ─────────────────────────────────────────────────────────────
    // SERVER IDENTITY
    // ─────────────────────────────────────────────────────────────

    // Your full server name — shown in the header and browser tab
    ServerName : 'Your Server Name',           // ← CHANGE THIS

    // Short tagline shown under the server name
    Tagline    : 'Your tagline here',          // ← CHANGE THIS

    // Your server's IP:port — used to display a live player count.
    // Example: '123.456.78.90:30120'
    // Set to '' to disable the player count entirely.
    ServerIP   : '',                           // ← CHANGE THIS

    // ─────────────────────────────────────────────────────────────
    // THEME
    // ─────────────────────────────────────────────────────────────

    // Main accent color — controls bar, glow, seal, dots, links.
    // Any valid CSS hex color. Examples: '#3a7bd5'  '#e04a4a'  '#22c55e'
    AccentColor : '#3a7bd5',

    // Background style: 'gradient' | 'particles' | 'image'
    //   gradient  — slow animated dark gradient (default, recommended)
    //   particles — floating particle drift on canvas
    //   image     — your own background image(s) — see BackgroundImages below
    BackgroundMode  : 'gradient',

    // Background images — supports any browser format: .jpg .jpeg .png .webp .gif .avif
    // Place files in: web/assets/img/
    // • One entry  → static background image, no cycling.
    // • Two+ entries → slideshow that crossfades between images automatically.
    BackgroundImages : [
        'assets/img/bg1.jpg',   // ← CHANGE THIS
        // 'assets/img/bg2.jpg',
        // 'assets/img/bg3.jpg',
    ],

    // Milliseconds between slideshow transitions (minimum: 3000 = 3 seconds).
    // Only used when BackgroundImages has 2 or more entries.
    BackgroundSlideInterval : 8000,

    // ─────────────────────────────────────────────────────────────
    // AUDIO
    // ─────────────────────────────────────────────────────────────

    DefaultVolume : 30,     // 0 – 100
    Autoplay      : true,   // false = player must click the play button manually

    // Add your music tracks here.
    // Place .mp3 files in:  web/assets/audio/
    // Format: { title: 'Display Name', file: 'assets/audio/yourfile.mp3' }
    Playlist : [
        { title: 'City Lights',   file: 'assets/audio/track1.mp3' },
        { title: 'Streets of SA', file: 'assets/audio/track2.mp3' },
        // Add more tracks as needed
    ],

    // ─────────────────────────────────────────────────────────────
    // INFO CARDS  (left panel — rotating)
    // ─────────────────────────────────────────────────────────────

    // Time in milliseconds between auto-advances. Hover pauses rotation.
    CardRotationInterval : 7000,

    // Add / remove / edit cards freely. Each card needs:
    //   icon  — any emoji (or '' to hide)
    //   title — short heading
    //   items — array of bullet-point strings
    Cards : [
        {
            icon  : '⚖',
            title : 'Server Rules',
            items : [
                'Respect all players and staff at all times.',
                'No RDM — you must have a valid RP reason to engage.',
                'No VDM — vehicles are not weapons.',
                'New Life Rule — after death, forget events leading to it.',
                'No metagaming or powergaming at any time.',
                'Stay in character in all public areas.',
            ],
        },
        {
            icon  : '🏙',
            title : 'What We Offer',
            items : [
                'Immersive civilian, LEO, and criminal roleplay.',
                'Custom jobs, businesses, and player-owned properties.',
                'Whitelisted factions with dedicated training programs.',
                'Regular content updates driven by community feedback.',
                'Balanced economy built for long-term progression.',
            ],
        },
        {
            icon  : '💡',
            title : 'Did You Know?',
            items : [
                'You can purchase properties and businesses in-game.',
                'New players receive a starter kit — check your inventory!',
                'Use /report to reach staff without breaking immersion.',
                'The city has a player-run government and council.',
                'Weekly community events are announced on Discord.',
            ],
        },
        {
            icon  : '🤝',
            title : 'Community',
            items : [
                'Player-driven economy, politics, and criminal underworld.',
                'Active and friendly community with zero tolerance for toxicity.',
                'Dedicated staff team available around the clock.',
                'Apply for whitelisted factions directly on our Discord.',
                'Share your ideas in our suggestions channel.',
            ],
        },
    ],

    // ─────────────────────────────────────────────────────────────
    // ROTATING TIPS  (right panel — slower cycle)
    // ─────────────────────────────────────────────────────────────

    Tips : [
        'Press F1 to open the help menu and view available commands.',
        'New to the server? Grab your starter kit from the spawn menu.',
        'Use /report to contact staff in-game without breaking character.',
        'Join our Discord to apply for whitelisted jobs and factions.',
        'Remember the New Life Rule — death resets your memory of that scenario.',
        'Properties and businesses are available to purchase across the map.',
        'Weekly events are held in-game — keep an eye on our Discord for times.',
    ],

    // ─────────────────────────────────────────────────────────────
    // LINKS  (right panel + footer)
    // ─────────────────────────────────────────────────────────────

    // Available icons: 'discord' | 'web' | 'store' | 'tiktok' | 'twitter' | 'youtube'
    Links : [
        { label: 'Discord', url: 'https://discord.gg/your-invite', icon: 'discord' },  // ← CHANGE THIS
        { label: 'Website', url: 'https://yourwebsite.com',        icon: 'web'     },  // ← CHANGE THIS
        // { label: 'Store', url: 'https://store.yourwebsite.com', icon: 'store'   },
    ],

};
