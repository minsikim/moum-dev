import TabGroup from 'electron-tabs';
// import './electron-tabs.css'


(function(){

    const defaultTabOptions = {
        title: 'Font.ttf',
        src: './components/canvas.html',
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
                    webview.openDevTools();
                })
            }
        }
    }
    
    const inspectionTabOptions = {
        title: 'Home',
        src: './components/app.html',
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
let tab = tabGroup.addTab(defaultTabOptions);
tabGroup.addTab(defaultTabOptions)
})();