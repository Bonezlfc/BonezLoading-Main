fx_version 'cerulean'
game 'gta5'

author 'Bonez Workshop'
description 'FiveM Loading Screen — edit config.js to customise'
version '1.0.0'

files {
    'web/index.html',
    'web/style.css',
    'web/app.js',
    'web/config.js',
    'web/assets/audio/**/*',
    'web/assets/img/**/*',
}

loadscreen 'web/index.html'

-- Uncomment the two lines below if you want to control WHEN the
-- screen closes from a client-side script (advanced use only).
-- Also create a client.lua that calls ShutdownLoadingScreen().
-- loadscreen_manual_shutdown 'yes'
-- client_script 'client.lua'
