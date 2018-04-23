import React from 'react';
import path from 'path';

class MenuTab extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            open: true,
            rotateIcon: '0',
            name: props.name,
            currentMenu: 'default',
            mouse: 'none',
        }
        }
    clickHandler(e){
        console.log(e)
        if(this.state.open == true) {
            this.setState({open: false})
            return;
        }else {
            this.setState({open: true})
        }
    }
    hoverHandler(e){
        console.log(e)
        if(this.state.mouse == 'none') {
            this.setState({mouse: 'over'})
            return;
        }else {
            this.setState({mouse: 'none'})
        }
    }
    render(){
        const style = {
            main:{
                color: 'white',
                backgroundColor: this.state.mouse == 'none' ? '#252525' : 'black',
                padding: '6px',
                paddingLeft: '10px',
                fontSize: '12px',
                fontFamily: 'Lato',
                letterSpacing: '4px'
            },
            icon: {
                padding: '0px',
                paddingRight: '10px',
                transform: this.state.open ? '' : 'rotate(270deg)',
                position: 'relative',
                bottom: this.state.open ? '0' : '6'+'px',
                right: this.state.open ? '0' : '4'+'px', 
            }

        }
        return (
            <div style={style.main}
            onClick={(e)=>this.clickHandler(e)}
            onMouseEnter={(e)=>this.hoverHandler(e)}
            onMouseLeave={(e)=>this.hoverHandler(e)}>
                <img src={path.join(__dirname, '../../assets/icons/arrow_drop.svg')}
                width='10px' style={style.icon} transform={'rotate('+this.state.rotateIcon+'deg)'}/>
                {this.state.name.toUpperCase()}
            </div>
        )
    }
}



class navMenu extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            currentMenu: 'default'
        }
    }
    render(){
        const style= {
            main: {
                width: '250px',
                backgroundColor: '#292929',
                height: '100%'
            },
            title:{
                color: 'white',
                backgroundColor: '#373737',
                padding: '9px',
                paddingLeft: '10px',
                fontSize: '12px',
                fontFamily: 'Lato',
                fontWeight: '700',
                letterSpacing: '4px',
                
            }
        }
        return (
            <div style={style.main}>
                <div style={style.title}>{this.state.currentMenu.toUpperCase()}</div>
                <MenuTab name={'selection'}/>
                <MenuTab name={'deformation'}/>
            </div>
        );
    }
}

export default navMenu;