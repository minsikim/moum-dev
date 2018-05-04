import React from 'react';
import Radium from 'radium';
import path from 'path';
import Welcome from './welcome';
import Moum from '../canvas/canvas';

let TabBar = (props) => {
    const style = {
        base: {
            color: 'white',
            display: 'flex',
        },
        tabBar: {

            height: '33px',
            overflow: 'hidden',
            backgroundColor: '#252525'
        },
        tab: {
            fontSize: '13px',
            fontWeight: '500',
            alignItems: 'center',
            backgroundColor: '#1e1e1e',
            paddingRight: '5px',
            paddingLeft: '5px'
        },
        icon: {
            maxWidth: '20px',
            margin: '5px',
        },
        close: {
            margin: '5px',
            padding: '6px',
            fontSize: '20px',
            borderRadius: '3px',
            ':hover': {
                backgroundColor: 'grey'
            }
        }
    }

    let tabs = [];
    for(var i = 0; i < props.tabs.length; i++){

        
        if(props.tabs[i].type == 'welcome'){
            // console.log('processing tabs'+i, props.tabs[i].type)
            tabs.push(<Welcome id={'welcome_'+i}
            key={i}
            style={(i == props.tabs.length-1) ? Object.assign({}, style.view, style.active):Object.assign({}, style.view, style.inactive)}/>)
        } else {
            tabs.push(<canvas id={'canvas_'+i}
            key={i}
            style={(i == props.tabs.length-1) ? Object.assign({}, style.view, style.active, {background: 'white'}):Object.assign({}, style.view, style.inactive)}
            onLoad={()=>{
                console.log('loaded')
                new Moum(document.getElementById('canvas_'+i))
            }}/>)
        }
    }  
    // 
    return (
        <div style={Object.assign({},style.base,style.tabBar)}>
            <div style={Object.assign({},style.base,style.tab)}>
                <img src={path.join(__dirname, '../../assets/icons/',props.tabs[0].type)+'.svg'}
                style={style.icon}/>{props.tabs[0].title}
                <div style={style.close}>×</div>
            </div>
        </div>
    )
}



const TabView = (props) => {
    const style = {
        base:{
            flexGrow: '1',
            position: 'relative',
            height: '100%',
            width: '100%'
        },
        view:{
            position: 'relative',
            height: '100%',
            width: '100%'
        },
        active:{
            position: 'absolute',
            zIndex: 1
        },
        inactive:{
            position: 'absolute',
            zIndex: 0
        }
    }
    let tabView = [];
    for(var i = 0; i < props.tabs.length; i++){
        if(props.tabs[i].type == 'welcome'){
            // console.log('processing tabs'+i, props.tabs[i].type)
            tabView.push(<Welcome id={'welcome_'+i}
            key={i}
            style={(i == props.tabs.length-1) ? Object.assign({}, style.view, style.active):Object.assign({}, style.view, style.inactive)}/>)
        } else {
            tabView.push(<canvas id={'canvas_'+i}
            key={i}
            style={(i == props.tabs.length-1) ? Object.assign({}, style.view, style.active, {background: 'white'}):Object.assign({}, style.view, style.inactive)}/>)
        }
    }
    // tabView[tabView.length-1].style = [style.base, style.active];
    // console.log(props)
    return <div style={style.base}>{tabView}</div>
}

const Tabs = (props) => {
    const style= {
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }
    console.log(props)
    return (
        <div id='tab-wrapper' style={style}>
            <TabBar {...props}/>
            <TabView {...props}/>
        </div>
    );
}

export default Radium(Tabs);