import React from 'react';
import Radium from 'radium';
import path from 'path';

class navbar extends React.Component{ 
    constructor(props){
        super(props);

        this.state = {
            icons: [
                {name:'glyph-navigator', index: 0, selected: true},
                {name:'particle-manager', index: 1, selected: false},
                {name:'kerning', index: 2, selected: false},
                {name:'font-family', index: 3, selected: false},
                {name:'rule-map', index: 4, selected: false},
                {name:'font-info', index: 5, selected: false}
            ],
            selected: 'glyph-navigator',
            iconSourceDirectory: '../assets/icons/',
            history: []
        }
    }

    clickHandler(event){
        this.state.icons.map((icon)=>{
            if(icon.name == event.target.id){
                icon.selected = true;
                this.setState({selected: event.target.id})
            }else {
                icon.selected = false;
            }
        })
    }
    hoverHandler(event){
        console.log(event);
    }
    
    render(){
        const style = {
            main: {
                width: '50px',
                backgroundColor: '#333',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            },
            button: {
                padding:'16px',
                ':hover':{
                    backgroundColor: '#111'
                },
            },
            buttonSelected: {
                padding:'16px',
                backgroundColor: '#5C5C5C',
                ':hover':{
                    backgroundColor: 'BLACK'
                },
            },
        }

        return (
            <div style={style.main}>
                {this.state.icons.map((obj)=>{return <img src={path.join(__dirname, '../../assets/icons/',obj.name+'.svg')}
                width='18px'
                style={obj.selected ? style.buttonSelected : style.button}
                key={obj.index}
                id={obj.name}
                className='nav-button'
                onClick={(event)=>this.clickHandler(event)}
                onMouseEnter={(event)=>this.hoverHandler(event)}
                onMouseLeave={(event)=>this.hoverHandler(event)}/>})}
            </div>
        );
    }
}

export default Radium(navbar);