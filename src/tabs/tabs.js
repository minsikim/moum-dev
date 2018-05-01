import React from 'react';
import Radium from 'radium';

const Hello = (props) => {
    return (
        <div>
            Hello
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
            <Hello/>
            <div className="tabgroup">
                <div className="tabs"></div>
                <div className="buttons"></div>
            </div>
            <div className="views" id="canvas-div"></div>
        </div>
    );
}

export default Radium(tabWrapper);