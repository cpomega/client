const {app, BrowserWindow, dialog} = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require("electron-updater");
const DiscordRPC = require('discord-rpc');

//const {app, BrowserWindow} = require('electron');
const path = require('path');

let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'flash/pepflashplayer64_32_0_0_303.dll'
    break
  case 'darwin':
    pluginName = 'flash/PepperFlashPlayer.plugin'
    break
  case 'linux':
    pluginName = 'flash/libpepflashplayer.so'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

autoUpdater.checkForUpdatesAndNotify();
let mainWindow;

function clearCache() {
  mainWindow.webContents.session.clearCache();
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "Connecting...",
    icon: __dirname + '/favicon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      plugins: true
    }
  });

  mainWindow.setMenu(null);
  clearCache();
  mainWindow.loadURL('https://www.cpome.ga/client');

  const clientId = '793567986841026561'; DiscordRPC.register(clientId); const rpc = new DiscordRPC.Client({ transport: 'ipc' }); const startTimestamp = new Date();
  rpc.on('ready', () => {
    rpc.setActivity({
      details: `Desktop Client`, 
      state: `Waddling around and making new friends`, 
      startTimestamp, 
      largeImageKey: `newlogo`, 
      #smallImageKey: "", 
    });
  });
  rpc.login({ clientId }).catch(console.error);

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});


setInterval(clearCache, 1000*60*5);
