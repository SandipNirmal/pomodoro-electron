const app = module.exports = {
    window: null
}

const electron = require('electron')
const path = require('path')
const url = require('url')

const Tray = electron.Tray
const Menu = electron.Menu

// let window = null

// Wait until the app is ready
electron.app.once('ready', () => {
    // Create a new window
    app.window = new electron.BrowserWindow({
        width: 400,
        height: 320,
        titleBarStyle: 'hidden',
        resizable: false,
        maximizable: false,
        // Set the default background color of the window to match the CSS
        // background color of the page, this prevents any white flickering
        backgroundColor: "#111",
        // Don't show the window until it ready, this prevents any white flickering
        show: false,
        icon: path.join(__dirname, '.favicon.ico')
    })

    // Load a URL in the window to the local index.html path
    app.window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Show window when page is ready
    app.window.once('ready-to-show', () => {
        showApp()
        app.window.focus()
    })

    // Handle close event
    app.window.on('close', (e) => {
        e.preventDefault();
        hideApp()
    })

    // Handle maximize event
    app.window.on('maximize', (e) => {
        e.preventDefault();
        app.window.setResizable(false);
        console.log('maximize');
    })

    // Handle maximize event
    app.window.on('resize', (e) => {
        e.preventDefault();
        app.window.setResizable(false);
        console.log('Resize');
    })

    // initialise tray 
    initTray()
})

/**
 * Initialise tray creation
 */
function initTray() {
    // OS X has no tray icon
    if (process.platform === 'darwin') return

    createTrayIcon()
}

/**
 * Function to create tray icon for app
 */
function createTrayIcon() {
    trayIcon = new Tray(path.join(__dirname, 'icons', '32x32.png'))

    // On Windows, left click to open the app, right click for context menu
    // On Linux, any click (right or left) opens the context menu
    trayIcon.on('click', showApp)

    updateTrayMenu()
}

function showApp() {
    app.window.show();
}

function hideApp() {
    app.window.minimize();
}

/**
 * Shows options on tray icon
 */
function updateTrayMenu() {
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Hide', click: hideApp },
        { label: 'Show', click: showApp },
        { label: 'Quit', click: () => {
            app.window.destroy();
            app.window = null;
         }}
    ])

    trayIcon.setContextMenu(contextMenu)
}
