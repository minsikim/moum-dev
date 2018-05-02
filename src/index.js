import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import path from 'path';
import fs from 'fs';
import MenuFunction from './controllers/menu-functions';

let mfunc = null;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);
console.log(process.execPath)

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    title: 'Moum v0.1.0'
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  //setting menu from template
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
  mfunc = new MenuFunction(mainWindow);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.quit();
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


//Menu template
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Font',
        accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
        click(){
          console.log('New Font Menu clicked');
          mfunc.newFontWindow();
        },
        id: '_newFont'
      },
      {
        label: 'Open Project',
        accelerator: process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O',
        click(){
          console.log('Open Project Menu clicked')
          mfunc.openFont();
        },
        id: '_openProject'
      },
      {
        label: 'Save',
        accelerator: process.platform === 'darwin' ? 'Command+S' : 'Ctrl+S',
        click(){console.log('Save Menu clicked')},
        id: '_save'
      },
      {
        label: 'Save As...',
        accelerator: process.platform === 'darwin' ? 'Command+Shift+S' : 'Ctrl+Shift+S',
        click(){console.log('Save As Menu clicked')},
        id: '_saveAs'
      },
      {
        type: 'separator'
      },
      {
        label: 'Import',
        accelerator: process.platform === 'darwin' ? 'Command+Shift+O' : 'Ctrl+Shift+O',
        click(){console.log('Import Font Menu clicked')},
        id: '_import'
      },
      {
        label: 'Export',
        click(){console.log('Export Font Menu clicked')},
        id: '_export'
      },
      {
        type: 'separator'
      },
      {
        label: 'Options',
        accelerator: 'F10',
        click(){console.log('Options Menu clicked')},
        id: '_options'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){app.quit();},
        id: '_quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: process.platform === 'darwin' ? 'Command+Z' : 'Ctrl+Z',
        click(){console.log('Undo Menu clicked')},
        id: '_undo',
        enabled: false
      },
      {
        label: 'Redo',
        accelerator: process.platform === 'darwin' ? 'Command+Y' : 'Ctrl+Y',
        click(){console.log('Redo Menu clicked')},
        id: '_redo',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Copy',
        accelerator: process.platform === 'darwin' ? 'Command+C' : 'Ctrl+C',
        click(){console.log('Copy Menu clicked')},
        id: '_copy',
        enabled: false
      },
      {
        label: 'Paste',
        accelerator: process.platform === 'darwin' ? 'Command+V' : 'Ctrl+V',
        click(){console.log('Paste Menu clicked')},
        id: '_paste',
        enabled: false
      },
      {
        label: 'Paste In Place',
        accelerator: process.platform === 'darwin' ? 'Command+Shift+V' : 'Ctrl+Shift+V',
        click(){console.log('Paste In Place Menu clicked')},
        id: '_pasteInPlace',
        enabled: false
      },
      {
        type: 'separator'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Show Layers',
        id: '_showLayers',
        submenu: [
          {
            label: 'Grid',
            accelerator: process.platform === 'darwin' ? "Command+'" : "Ctrl+'",
            click(){console.log('View Grid clicked')},
            id: '_grid',
            enabled: false
          },
          {
            label: 'Ruler',
            accelerator: process.platform === 'darwin' ? 'Command+R' : 'Ctrl+R',
            click(){console.log('View Ruler clicked')},
            id: '_ruler',
            enabled: false
          },
          {
            label: 'Glyph Metrics',
            accelerator: process.platform === 'darwin' ? 'Command+"' : 'Ctrl+"',
            click(){console.log('View Glyph Metrics clicked')},
            id: '_glyphMetrics',
            enabled: false
          },
        ]
      }
    ]
  }
]

if (process.env.NODE_ENV !== 'production'){
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      {
        label: 'Devtools',
        accelerator: 'F12',
        click(){
          mainWindow.webContents.openDevTools();
        }
      },
      {role: 'toggledevtools'},
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'togglefullscreen'},
      {role: 'minimize'},
      {role: 'close'}
    ]
  })
}