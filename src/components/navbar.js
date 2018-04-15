import React from 'react';

const navbar = (props) => {
    const style= {

    }
    return (
        <div style={style} onClick={props.click} className='navbar' id={props.id}>
            <p>{props.char}</p>
        </div>
    );
}

export default navbar;