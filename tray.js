module.exports = {
    init,
    hasTray
}

const cp = require('child_process')
const path = require('path')
const electron = require('electron')

const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray

const app = require('./app')

const trayIcon

function init() {
    // OS X has no tray icon
    if (process.platform === 'darwin') return

    // // On Linux, asynchronously check for libappindicator1
    // if (process.platform === 'linux') {
    //     checkLinuxTraySupport(function (supportsTray) {
    //         if (supportsTray) createTrayIcon()
    //     })
    // }

    // // Windows always supports minimize-to-tray
    // if (process.platform === 'win32') createTrayIcon()

    createTrayIcon()
}

function hasTray() {
    return !!trayIcon
}

function createTrayIcon() {
    trayIcon = new Tray(path.join(__dirname, '..', 'icons', '16x16.png'))

    // On Windows, left click to open the app, right click for context menu
    // On Linux, any click (right or left) opens the context menu
    trayIcon.on('click', showApp)

    // Show the tray context menu, and keep the available commands up to date
    updateTrayMenu()
    windows.main.on('show', updateTrayMenu)
    windows.main.on('hide', updateTrayMenu)
}

// function checkLinuxTraySupport(cb) {
//     // Check that we're on Ubuntu (or another debian system) and that we have
//     // libappindicator1. If WebTorrent was installed from the deb file, we should
//     // always have it. If it was installed from the zip file, we might not.
//     cp.exec('dpkg --get-selections libappindicator1', function (err, stdout) {
//         if (err) return cb(false)
//         // Unfortunately there's no cleaner way, as far as I can tell, to check
//         // whether a debian package is installed:
//         cb(stdout.endsWith('\tinstall\n'))
//     })
// }

function updateTrayMenu() {
    const showHideMenuItem
    if (windows.main.isVisible()) {
        showHideMenuItem = { label: 'Hide to tray', click: hideApp }
    } else {
        showHideMenuItem = { label: 'Show', click: showApp }
    }
    const contextMenu = Menu.buildFromTemplate([
        showHideMenuItem,
        { label: 'Quit', click: () => electron.app.quit() }
    ])
    trayIcon.setContextMenu(contextMenu)
}

function showApp() {
    windows.main.show()
}

function hideApp() {
    windows.main.hide()
    windows.main.send('dispatch', 'backToList')
}