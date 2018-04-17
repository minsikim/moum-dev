import React from 'react';
import TabGroup from 'electron-tabs';
// import './electron-tabs.css'

let tabGroup  = new TabGroup();
console.log(tabGroup)
let tab = tabGroup.addTab({  
    title: 'Home',
    src: './app.html',
    webviewAttributes: {
        'nodeintegration': true
    },
    icon: 'fa fa-home',
    visible: true,
    closable: false,
    active: true,
    ready: tab => {
        // Open dev tools for webview
        let webview = tab.webview;
        if (!!webview) {
            webview.addEventListener('dom-ready', () => {
                webview.openDevTools();
            })
        }
    }});

const tabWrapper = (props) => {
    const style= {
        width: 'auto',
        backgroundColor: '#111'
    }
    return (
        <div>
            <div className="etabs-tabgroup">
                <div className="etabs-tabs"></div>
                <div className="etabs-buttons"></div>
            </div>
            <div className="etabs-views"></div>
        </div>
    );
}

export default tabWrapper;