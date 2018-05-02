import electron from 'electron';
import path from 'path';

const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;

export default class MenuFunctions {
    constructor(window){
        this.window = window;
    }

    openFont(){
        dialog.showOpenDialog({
            title: 'Open Font',
            defaultPath: path.join(require("os").homedir(),'/Documents'),
            properties: [
            'showHiddenFiles', 
            ],
            filters: [
            { name: 'All Fonts', extensions: ['woff', 'ttf', 'otf']},
            { name: 'Web Fonts', extensions: ['woff'] },
            { name: 'True Type Fonts', extensions: ['ttf'] },
            { name: 'Open Type Fonts', extensions: ['otf'] }
            ],
        },newFontTab
    )}

    newFontTab (filename){
        console.log('sending open-font event, '+filename);
        this.window.webContents.send('open-font', filename)
    }

    newFontWindow(){
    let newFontOptionsWindow = new BrowserWindow({
            width: 400,
            height: 250,
            menu: null,
        });
        newFontOptionsWindow.loadURL(path.join(__dirname, '../windows/newFontOptionsWindow.html'));
        newFontOptionsWindow.once('ready-to-show', ()=>{ newFontOptionsWindow.show(); })
    }
}
