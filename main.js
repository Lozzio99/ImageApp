const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // Required for Angular routing
      contextIsolation: false,
      // Enable Node.js integration
      nodeIntegration: true,
    },
  });

  // Load the index.html of the app.
  win.loadFile(path.join(__dirname, 'www', 'index.html'));

  // Open the DevTools (optional).
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS, it's common for applications to stay open until the user quits explicitly.
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS, recreate a window when the dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
