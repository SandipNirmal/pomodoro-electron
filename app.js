const electron = require('electron')
const path = require('path')
const url = require('url')

let window = null

// Wait until the app is ready
electron.app.once('ready', function () {
    // Create a new window
    window = new electron.BrowserWindow({
        width: 400,
        height: 320,
        titleBarStyle: 'hidden',
        resizable: false,
        // Set the default background color of the window to match the CSS
        // background color of the page, this prevents any white flickering
        backgroundColor: "#111",
        // Don't show the window until it ready, this prevents any white flickering
        show: false,
        icon: path.join(__dirname, '.favicon.ico')
    })

    // Load a URL in the window to the local index.html path
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Show window when page is ready
    window.once('ready-to-show', function () {
        window.show()
    })

})
