import React from 'react';
import Radium from 'radium';
import path from 'path';
import Welcome from './welcome';

const TabBar = (props) => {
    const style = {
        base: {
            color: 'white'
        },
        tabBar: {
            display: 'flex',
            height: '33px',
            overflow: 'hidden',
            backgroundColor: '#252525'
        },
        tab: {
            fontSize: '13px',
            fontWeight: '500',
            alignItems: 'center',
        },
        icon: {
            maxWidth: '20px',
            margin: '5px'
        },
        close: {
            margin: '5px',
            padding: '6px',
            fontSize: '15px'
        }
    }
    console.log(props.tabs)
    // for(key in props.tabs){
    //     console.log(key)
    //     // console.log(props.tabs[key].type)
    // }
    return (
        <div style={Object.assign(style.base,style.tabBar)}>
            <div style={Object.assign(style.base,style.tab)}>
                <img src={path.join(__dirname, '../../assets/icons/',props.tabs[0].type)+'.svg'}
                style={style.icon}/>{props.tabs[0].title}
                <div>×</div>
            </div>
        </div>
    )
}

const TabView = (props) => {
    const style = {
        base:{
            position: 'absolute'
        },
        active:{
            zIndex: '1'
        },
        inactive:{
            zIndex: '0'
        }
    }
    let tabView = [];
    for(var i = 0; i < props.tabs.length; i++){
        if(props.tabs[i].type == 'welcome'){
            tabView.push(<Welcome id={'welcome_'+i} style={[style.base, style.inactive]}/>)
        } else {
            tabView.push(<canvas id={'canvas_'+i} style={[style.base, style.inactive]}/>)
        }
        
    }
    // tabView[tabView.length-1].style = [style.base, style.active];
    // console.log(props)
    return <div>{tabView}</div>
}

const Tabs = (props) => {
    const style= {
        flexGrow: '1'
    }
    console.log(props)
    return (
        <div style={style}>
            <TabBar {...props}/>
            <TabView {...props}/>
        </div>
    );
}

export default Radium(Tabs);