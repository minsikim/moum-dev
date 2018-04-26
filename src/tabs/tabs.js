import TabGroup from 'electron-tabs';
import electron from 'electron';
import path from 'path';

    const welcomeTabOptions = {
        title: 'Welcome',
        src: './tabs/welcome.html',
        webviewAttributes: {
            'nodeintegration': true
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
            'nodeintegration': true
        },
        iconURL: '../assets/icons/arrow-drop.svg',
        visible: true,
        closable: true,
        active: false,
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

export default tabGroup;