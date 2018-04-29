import TabGroup from 'electron-tabs';
import electron from 'electron';
import path from 'path';

const { ipcRenderer } = electron;

const welcomeTabOptions = {
    title: 'Welcome',
    src: './tabs/welcome.html',
    webviewAttributes: {
        'nodeintegration': true,
    },
    icon: 'fa',
    iconURL: path.join(__dirname,'../assets/icons/arrow_drop.svg'),
    visible: true,
    closable: true,
    active: true,
    ready: tab => {
        // Open dev tools for webview
        let webview = tab.webview;
        if (!!webview) {
            webview.addEventListener('dom-ready', () => {
                webview.openDevTools();
            })
        }
    }
}
const defaultTabOptions = {
    title: 'Font.ttf',
    src: './tabs/canvas.html',
    webviewAttributes: {
        'nodeintegration': true,
        'preload': './tabs/preload.js'
    },
    iconURL: '../assets/icons/arrow_drop.svg',
    visible: true,
    closable: true,
    active: true,
    ready: tab => {
        // Open dev tools for webview
        let webview = tab.webview;
        if (!!webview) {
            webview.addEventListener('dom-ready', () => {
                webview.openDevTools();
            })
        }
    }
}

const inspectionTabOptions = {
    title: 'Home',
    src: './tabs/inspector.html',
    webviewAttributes: {
        'nodeintegration': true
    },
    icon: 'fa fa-home',
    visible: true,
    closable: true,
    active: true,
    ready: tab => {
        // Open dev tools for webview
        let webview = tab.webview;
        if (!!webview) {
            webview.addEventListener('dom-ready', () => {
                // webview.openDevTools();
            })
        }
    }
}    

let tabGroup = new TabGroup();
tabGroup.addTab(welcomeTabOptions);
// tabGroup.addTab(defaultTabOptions);

// export default tabGroup;

ipcRenderer.on('addTab', (event, fontName)=>{
    console.log('addTab activated in tabs.js')
    var options = defaultTabOptions;
    options.title = fontName+'.ttf'
    tabGroup.addTab(options);
})
let newTab = null;
let tempFileName = null;
let tempTabId = null;

let webviews = null;
let webview = null;

ipcRenderer.on('open-font', (event, filename)=>{
    console.log('open-font activated in tabs.js'+Date.now())
    var options = defaultTabOptions;
    // options.
    tempFileName = path.basename(filename[0]);
    options.title = tempFileName;
    // newTab.
    newTab = tabGroup.addTab(options)
    setTimeout(()=>{
        tempTabId = newTab.id;
        console.log('sending load-font-on-canvas...'+Date.now())
            webviews = document.querySelectorAll('webview')
            for(var i = 0; i< webviews.length; i++){
                webview = webviews[i]
                if(webview!= null){
                    console.log(webview)
                    webview.addEventListener('ipc-message', (event)=>{
                        console.log(event.channel);
                        console.log(`got load-on-canvas via tabs.js and eventListener in webview (id:{webview.id}) `+webview.id);
                    })
                    webview.send('load-on-canvas', [tempFileName, filename])
                }
            }
        },1000)
})

// newTab.on("webview-ready", (tab) => {
//     console.log('sending load-font-on-canvas...')
//     ipcRenderer.send('load-font-on-canvas', [tempFileName, newTabId])
// });