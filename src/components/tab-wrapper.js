import React from 'react';
import TabGroup from 'electron-tabs';
// import './electron-tabs.css'

let tabGroup  = new TabGroup();
console.log(tabGroup)
// let tab = tabGroup.addTab({
//     title: "Electron",
//     src: "http://electron.atom.io",
//     visible: true
// });

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