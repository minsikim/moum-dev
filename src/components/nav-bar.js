import React from 'react';
import Radium from 'radium';
import path from 'path';

const navbar = () => {

    const MENU = {
        default: [
          {name:'glyph-navigator', index: 0},
          {name:'particle-manager', index: 1},
          {name:'kerning', index: 2},
          {name:'font-family', index: 2},
          {name:'rule-map', index: 3},
          {name:'font-info', index: 4}
        ],
        current: [
            {name:'glyph-navigator', svg_file: '', index: 0},
            {name:'particle-manager', svg_file: '', index: 1},
            {name:'kerning', svg_file: '', index: 2},
            {name:'font-family', svg_file: '', index: 2},
            {name:'rule-map', svg_file: '', index: 3},
            {name:'font-info', svg_file: '', index: 4}
          ],
        iconSourceDirectory: '../assets/icons/',
        history: []
      }
    const style = {
        main: {
            width: '60px',
            backgroundColor: '#333',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        },
        button: {
            padding:'18px',
            ':hover':{
                backgroundColor: 'black'
            },
        },
    }
    let arr = [
        {name:'glyph-navigator', index: 0},
        {name:'particle-manager', index: 1},
        {name:'kerning', index: 2},
        {name:'font-family', index: 3},
        {name:'rule-map', index: 4},
        {name:'font-info', index: 5}
    ]
    const clickHandler = (event)=>{
        event.target.background = 'yellow'
    }
    const hoverHandler = (event)=>{
        event.target.background = 'gray'
    }
    
    return (
        <div style={style.main}>
            {arr.map((obj)=>{return <img src={path.join(__dirname, '../../assets/icons/',obj.name+'.svg')}
            width='24px' style={style.button}
            key={obj.index} 
            onClick={(event)=>clickHandler(event)}
            onmouseover={(event)=>hoverHandler{event}}/>})}
        </div>
    );
}

export default Radium(navbar);