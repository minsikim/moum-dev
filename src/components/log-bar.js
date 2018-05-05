import React, {Component} from 'react';
import { FONT_TO_LOG_BAR } from '../constants/event-names';
import { ipcRenderer } from 'electron';

class Logbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            logMessage: 'Vacant'
        }
    }

    componentWillUnmount(){
        ipcRenderer.removeListener(FONT_TO_LOG_BAR)
    }

    componentDidMount(){
        ipcRenderer.on(FONT_TO_LOG_BAR, (event, arg)=>{
            this.setState({logMessage: arg.names.fontFamily.en+" "+arg.outlinesFormat+" font loaded"})
        })
    }

    render(){
        const style= {
            base:{
                height: '20px',
                backgroundColor: '#FBE58E',
                position: 'relative',
                bottom: '20px',
                alignItems: 'center'
            },
            text:{
                fontSize: 12,
                color: 'red'
            }
        }

        return (
            <div style={style.base}>
                <div style={style.text}>{this.state.logMessage}</div>
            </div>
        );
    }
}

export default Logbar;