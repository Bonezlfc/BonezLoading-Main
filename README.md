# FiveM Loading Screen
**Built by Bonez Workshop**

A modern, lightweight FiveM loading screen.
No jQuery. No frameworks. Pure vanilla JS — fast and clean.

---

## Installation

1. Drop the `Bonezloading` folder into your server's `resources/` directory
2. Open `server.cfg` and add:
   ```
   ensure Bonezloading
   ```
3. Make sure no other loading screen resource is running at the same time
4. Restart your server and connect — the screen will appear

---

## First-Time Setup

Open `web/config.js` in any text editor and update every line marked `← CHANGE THIS`.

The minimum required changes are:

```js
Config.ServerName = 'Your Server Name';
Config.Tagline    = 'Your tagline here';
Config.ServerIP   = '123.456.78.90:30120';   // your actual IP:port

Config.Links = [
    { label: 'Discord', url: 'https://discord.gg/your-invite', icon: 'discord' },
    { label: 'Website', url: 'https://yourwebsite.com',        icon: 'web'     },
];
```

Everything else has safe defaults and can be changed at your own pace.

---

## Adding Music

1. Place your `.mp3` files in `web/assets/audio/`
2. Add each track to the playlist in `config.js`:
   ```js
   Config.Playlist = [
       { title: 'Track Name Here', file: 'assets/audio/yourfile.mp3' },
       { title: 'Another Track',   file: 'assets/audio/second.mp3'   },
   ];
   ```
3. Tracks loop automatically and players can skip with the next/prev buttons

---

## Full Config Reference

All settings live in `web/config.js`. Here is every option explained:

### Server Identity

| Option | Type | Description |
|--------|------|-------------|
| `ServerName` | string | Full server name — shown in header and browser tab |
| `Tagline` | string | Short tagline shown under the name |
| `ServerIP` | string | `'ip:port'` for live player count. Set `''` to disable |

### Theme

| Option | Type | Description |
|--------|------|-------------|
| `AccentColor` | hex string | Controls bar, glow, seal, dots, links. Default: `'#3a7bd5'` |
| `BackgroundMode` | string | `'gradient'` \| `'particles'` \| `'image'` |
| `BackgroundImages` | array | One or more image paths. Single entry = static; two+ entries = slideshow |
| `BackgroundSlideInterval` | number | Milliseconds between slideshow transitions. Minimum: `3000`. Default: `8000` |

**Background modes:**

| Mode | Description |
|------|-------------|
| `gradient` | Slow animated dark gradient. Lightest on performance. Default. |
| `particles` | Floating blue particle drift on canvas |
| `image` | Your own background image(s), auto-dimmed. Supports any browser image format (`.jpg` `.png` `.webp` `.gif` `.avif`). Place files in `web/assets/img/` |

**Background slideshow example:**

```js
Config.BackgroundMode  = 'image';
Config.BackgroundImages = [
    'assets/img/slide1.jpg',
    'assets/img/slide2.png',
    'assets/img/slide3.webp',
];
Config.BackgroundSlideInterval = 10000;  // 10 seconds between transitions
```

### Audio

| Option | Type | Description |
|--------|------|-------------|
| `DefaultVolume` | number | Starting volume `0`–`100` |
| `Autoplay` | boolean | `true` = auto-start. `false` = player must click play |
| `Playlist` | array | List of `{ title, file }` objects |

### Info Cards (left panel)

| Option | Type | Description |
|--------|------|-------------|
| `CardRotationInterval` | number | Milliseconds between auto-advances. Hover pauses rotation |
| `Cards` | array | Each card has `icon` (emoji), `title`, and `items` (string array) |

### Tips (right panel)

| Option | Type | Description |
|--------|------|-------------|
| `Tips` | array | String array. Rotates every 9 seconds |

### Links

| Option | Type | Description |
|--------|------|-------------|
| `Links` | array | Each link has `label`, `url`, and `icon` |

**Available icons:** `discord` · `web` · `store` · `tiktok` · `twitter` · `youtube`

Links appear in both the right panel (with icon + arrow) and the footer (text only).

---

## Customising the Seal / Logo

The hexagonal seal in the top-left corner automatically fills with your server's initials,
generated from `Config.ServerName` at runtime.
For example: `"Night Shift Roleplay"` → `"NSR"`.

**To use your own logo image instead:**

Open `web/index.html` and find the `<div class="sau-seal">` block.
Replace everything inside it with:

```html
<img src="assets/img/logo.png" alt="Server Logo"
     style="width:100%;height:100%;object-fit:contain;">
```

Then place your logo PNG at `web/assets/img/logo.png`.
Recommended size: 128×128px or larger, transparent background.

---

## Changing the Accent Color

Edit one line in `config.js`:

```js
Config.AccentColor = '#e04a4a';   // red
Config.AccentColor = '#22c55e';   // green
Config.AccentColor = '#f59e0b';   // amber
Config.AccentColor = '#8b5cf6';   // purple
```

The color is applied at runtime to the progress bar, glow effects, seal, nav dots, and links.

---

## File Structure

```
sau_loading/
├─ fxmanifest.lua          FiveM resource manifest — do not edit
├─ README.md               This file
└─ web/
   ├─ config.js            ← Edit this to customise your server
   ├─ index.html           HTML layout — edit only if you know what you're doing
   ├─ style.css            All styling — safe to tweak colors/sizes
   ├─ app.js               All JavaScript logic — edit only if you know what you're doing
   └─ assets/
      ├─ audio/            Place your .mp3 music files here
      └─ img/              Place background images here (any format). Optional: logo.png
```

---

## Manual Shutdown (Advanced)

By default, FiveM auto-dismisses the loading screen when the player spawns.

If you need to control this from a script (e.g. wait for a custom spawn system):

1. In `fxmanifest.lua`, uncomment:
   ```lua
   loadscreen_manual_shutdown 'yes'
   client_script 'client.lua'
   ```

2. Create `sau_loading/client.lua` and call this when your server is ready:
   ```lua
   ShutdownLoadingScreen()
   ShutdownLoadingScreenNui()
   ```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Music doesn't start automatically | Some environments block autoplay. The play button will appear. Set `Config.Autoplay = false` to always show the button instead of attempting auto-start. |
| Player count shows "ONLINE" dot instead of numbers | The fetch to your server endpoints failed. Double-check `Config.ServerIP` is correct and the server is reachable. |
| Progress bar doesn't move | Verify `sau_loading` is started before any resource that sends `loadProgress` messages. Check the order in `server.cfg`. |
| Background image not showing | Confirm the file is in `web/assets/img/` and the path in `Config.BackgroundImages` matches the filename exactly — Linux paths are case-sensitive. |
| Screen stays up indefinitely | Only one `loadscreen` resource can be active at a time. Check for conflicts in `server.cfg`. |
| Fonts look wrong | The screen uses Google Fonts CDN. If your server has no outbound internet access during loading, it falls back to `Impact` and `Segoe UI` automatically. |

---

## Compatibility

- **FiveM artifact:** any modern version (`cerulean` manifest)
- **Game:** GTA V only
- **Resolutions:** 1280×720 up to 3840×2160 (ultrawide). Tested at 1080p and 1440p.
- **Dependencies:** none — no jQuery, no Vue, no React

---

*Built by Bonez Workshop*
