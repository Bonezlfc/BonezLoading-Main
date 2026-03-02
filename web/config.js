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
    Tagline    : 'Your tagline goes here',      // ← CHANGE THIS

    // Your server's IP:port — used to display a live player count.
    // Example: '123.456.78.90:30120'
    // Set to '' to disable the player count entirely.
    ServerIP   : '',                            // ← CHANGE THIS (or leave '' to disable)

    // ─────────────────────────────────────────────────────────────
    // THEME
    // ─────────────────────────────────────────────────────────────

    // Main accent color — controls bar, glow, seal, dots, links.
    // Any valid CSS hex color. Examples: '#3a7bd5'  '#e04a4a'  '#22c55e'
    AccentColor : '#3a7bd5',

    // Background style: 'gradient' | 'particles' | 'image'
    //   gradient  — slow animated dark gradient (default, recommended)
    //   particles — floating particle drift on canvas
    //   image     — your own background image (set BackgroundImage below)
    BackgroundMode  : 'gradient',
    BackgroundImage : 'assets/img/background.jpg',  // only used when mode = 'image'

    // ─────────────────────────────────────────────────────────────
    // AUDIO
    // ─────────────────────────────────────────────────────────────

    DefaultVolume : 30,     // 0 – 100
    Autoplay      : true,   // false = player must click the play button manually

    // Add your music tracks here.
    // Place .mp3 files in:  web/assets/audio/
    // Format: { title: 'Display Name', file: 'assets/audio/yourfile.mp3' }
    Playlist : [
        { title: 'Track One',   file: 'assets/audio/track1.mp3' },  // ← CHANGE THIS
        { title: 'Track Two',   file: 'assets/audio/track2.mp3' },  // ← CHANGE THIS
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
                'Rule 1 — describe your rule here',     // ← CHANGE THIS
                'Rule 2 — describe your rule here',
                'Rule 3 — describe your rule here',
                'Rule 4 — describe your rule here',
                'Rule 5 — describe your rule here',
            ],
        },
        {
            icon  : '🏙',
            title : 'What We Offer',
            items : [
                'Feature one — describe it here',       // ← CHANGE THIS
                'Feature two — describe it here',
                'Feature three — describe it here',
                'Feature four — describe it here',
                'Feature five — describe it here',
            ],
        },
        {
            icon  : '💡',
            title : 'Did You Know?',
            items : [
                'Tip or fact about your server here',   // ← CHANGE THIS
                'Another interesting fact',
                'Something players should know',
                'A hidden feature or shortcut',
                'A helpful reminder',
            ],
        },
        {
            icon  : '🤝',
            title : 'Community',
            items : [
                'Community highlight or value',         // ← CHANGE THIS
                'Another community highlight',
                'Staff team info',
                'Events info',
                'How to get involved',
            ],
        },
    ],

    // ─────────────────────────────────────────────────────────────
    // ROTATING TIPS  (right panel — slower cycle)
    // ─────────────────────────────────────────────────────────────

    Tips : [
        'Tip 1 — write a helpful tip for new players here.',    // ← CHANGE THIS
        'Tip 2 — write another tip here.',
        'Tip 3 — hint about a feature or command.',
        'Tip 4 — remind players about rules or events.',
        'Tip 5 — link to Discord or website for more info.',
    ],

    // ─────────────────────────────────────────────────────────────
    // LINKS  (right panel + footer)
    // ─────────────────────────────────────────────────────────────

    // Available icons: 'discord' | 'web' | 'store' | 'tiktok' | 'twitter' | 'youtube'
    Links : [
        { label: 'Discord', url: 'https://discord.gg/CHANGEME',       icon: 'discord' },  // ← CHANGE THIS
        { label: 'Website', url: 'https://yourwebsite.com',           icon: 'web'     },  // ← CHANGE THIS
        { label: 'Store',   url: 'https://store.yourwebsite.com',     icon: 'store'   },  // ← CHANGE THIS (or remove)
    ],

};
