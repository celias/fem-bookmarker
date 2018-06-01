// console.log('hello world!');
// Object destructuring
const { app, BrowserWindow } = require('electron');


let mainWindow = null; // always available in the global scope

// app is fully started and ready
app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 300,
        height: 600,
        show: false
    }); // open new window with some stuff
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed',  () => {
        mainWindow = null;
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);
    require('devtron').install();
});

// Browser windows are a way to create renderer processes
// Browser window is the container for renderer processes