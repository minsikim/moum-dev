import React from 'react';
import Radium from 'radium';
import path from 'path';

const TabBar = (props) => {
    const style = {
        base: {
            
        },
        tabBar: {
            display: 'flex',
            height: '20px',
            overflow: 'hidden'
        },
        tab: {
            fontSize: '12px',
            fontWeight: '500'
        },
        icon: {
            maxWidth: '10px',
        },
    }

    let tabs = null;
    tabs = (
        <div style={[style.base, style.tabBar]}>
            {props.tabs.map((obj)=>{
                return(
                    <div
                    style={[style.base, style.tab]}
                    onClick={props.click}>
                        <img
                        src={path.join(__dirname, '../../assets/icons/', obj.type+'.svg')}
                        style={style.icon}/>
                    </div>
                )
            })}
        </div>
    )
    return (
        {tabs}
    )
}

const TabView = (props) => {
    return (
        <div>
            tabs
        </div>
    )
}

const tabWrapper = (props) => {
    const style= {
        // '@import': "@getable/lato",
        // fontFamily: 'Lato'
        // p: {
        //         fontWeight: '100'
        //     }
        // .yellow{color: #FBE58E; font-weight: 900}
        // h1{font-weight: 400;}
    }
    return (
        <div style={props.style}>
            <TabBar props={props.tabs}
            click={props.click}/>
            <TabView />
        </div>
    );
}

export default Radium(tabWrapper);