import React from 'react';
import Radium from 'radium';

const welcomePage = (props) => {
    const style= {
        backgroundColor: '#1e1e1e',
        color: '#ccc',
        fontWeight: '300',
        'p': {
            fontSize: 100
        },
        height: '100%'
    }
    return (
        <div style={Object.assign({},props.style, style)}>
            <div style={{padding: 40}}>
                <h1>Welcome to <span className='yellow'>MOUM</span></h1>
                <p>This is a Designer's Application for Font Design<br/>Specifically matching the needs of CJKV.</p>
            </div>
        </div>
    );
}

export default Radium(welcomePage);