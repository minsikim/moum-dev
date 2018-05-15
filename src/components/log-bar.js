import React, {Component} from 'react';
import { ipcRenderer } from 'electron';
import {
    FONT_TO_LOG_BAR,
    LOGGER } from '../constants/event-names';

class Logbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            logMessage: 'Vacant'
        }
    }

    componentWillUnmount(){
        ipcRenderer.removeListener(FONT_TO_LOG_BAR)
        ipcRenderer.removeListener(LOGGER)
    }

    componentDidMount(){
        ipcRenderer.on(FONT_TO_LOG_BAR, (event, arg)=>{
            console.log('[log-bar.js] recieved FONT_TO_LOG_BAR from main')
            this.setState({logMessage: arg.names.fontFamily.en+" "+arg.outlinesFormat+" font loaded"})
        })
        ipcRenderer.on(LOGGER, (event, arg)=>{
            console.log('[log-bar.js] recieved LOGGER from main')
            this.setState({logMessage: arg})
        })
    }

    render(){
        const style= {
            base:{
                height: '20px',
                backgroundColor: '#FBE58E',
                position: 'relative',
                bottom: '20px',
                alignItems: 'center',
                display: 'flex'
            },
            text:{
                fontSize: 12,
                color: 'green',
                margin: '0px 0px 0px 10px'
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