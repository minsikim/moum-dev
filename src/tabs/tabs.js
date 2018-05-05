import React from 'react';
import Radium from 'radium';
import path from 'path';
import Welcome from './welcome';
import Moum from '../canvas/canvas';
import p from 'paper';
import opentype from 'opentype.js'

let TabBar = (props) => {
    const style = {
        base: {
            color: 'white',
            display: 'flex',
        },
        tabBar: {
            height: '33px',
            overflow: 'hidden',
            backgroundColor: '#252525',
            alignItems: 'center'
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
            margin: '0 0 0 5px',
            padding: '0px 5px 2px 5px',
            fontSize: '20px',
            borderRadius: '3px',
            ':hover': {
                backgroundColor: 'grey'
            }
        },
        add: {
            fontWeight: '300',
            fontSize: 24,
            backgroundColor: '#333',
            padding: '2px 10px 0px 10px',
            height:33,
            alignContent: 'center'
        }
    }

    let tabs = [];
    for(var i = 0; i < props.tabs.length; i++){
        var thisType = props.tabs[i].type;
        tabs.push(
        <div style={Object.assign({},style.base,style.tab)}
        key={i}
        className={'tab'}
        id={thisType+'_'+i}
        onClick={(e)=>{
            console.log(e.target)
        }}>
            <img src={path.join(__dirname, '../../assets/icons/',thisType)+'.svg'}
            style={style.icon}/>{props.tabs[i].title}
            <div style={style.close}
            onClick={(e)=>{
                console.log(e.target.parentElement.id)
                var tempArr = document.querySelectorAll('#'+e.target.parentElement.id);
                for(var key in tempArr) {
                    if(tempArr.hasOwnProperty(key)) {
                        tempArr[key].remove()
                    }
                }
            }}>×</div>
        </div>)
    }  
    // 
    return (
        <div style={Object.assign({},style.base,style.tabBar)}
        onLoad={()=>{console.log(document)}}>
            {tabs}
            <div style={style.add}
            onClick={(e)=>{console.log('addTab clicked')}}>+</div>
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
        var thisType = props.tabs[i].type;
        if(thisType == 'welcome'){
            tabView.push(<Welcome id={thisType+'_'+i}
            className='web-view'
            key={i}
            style={(i == props.tabs.length-1) ? Object.assign({}, style.view, style.active):Object.assign({}, style.view, style.inactive)}
            onClick={(e)=>{console.log(e.target.id)}}/>)
        } else {
            tabView.push(
                // <iframe
                // id={thisType+'_'+i}
                // key={i}
                // style={(i == props.tabs.length-1) ? Object.assign({}, style.view, style.active, {background: 'white'}):Object.assign({}, style.view, style.inactive)}
                // src={path.join(__dirname, '../canvas/canvas.html')}></iframe>
            <canvas id={thisType+'_'+i}
            className='web-view'
            key={i}
            style={(i == props.tabs.length-1) ? Object.assign({}, style.view, style.active, {background: 'white'}):Object.assign({}, style.view, style.inactive)}
            onClick={(e)=>{
                console.log(e.target.id)
            }}/>
            )
        }
    }
    return <div style={style.base}>{tabView}</div>
}

const Tabs = (props) => {
    const style= {
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }
    return (
        <div id='tab-wrapper' style={style}>
            <TabBar {...props}/>
            <TabView {...props}/>
        </div>
    );
}

export default Radium(Tabs);