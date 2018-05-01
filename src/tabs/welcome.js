import React from 'react';

const welcomePage = (props) => {
    const style= {
        width: 'auto',
        backgroundColor: '#111'
    }
    return (
        <div>
            <h1>Welcome to <span className='yellow'>MOUM</span></h1>
            <p>This is a Designer's Application for Font Design<br/>Specifically matching the needs of CJKV.</p>
        </div>
    );
}

export default welcomePage;