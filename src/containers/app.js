import React from 'react';
import Radium from 'radium'
import LogBar from '../components/log-bar';
import NavBar from '../components/nav-bar';
import NavMenu from '../components/nav-menu';
import ToolMenu from '../components/tool-menu'
import TabWrapper from '../components/tab-wrapper';

//Settings for initial program execution
const SETTINGS = {
  startPage: true,
  
}

class App extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      navBar: true,
      navMenu: true,
      toolMenu: true,
      navMenu: 'glyph-navigator'
    }
  }
  
  toggleNavMenu(newMenu){
    this.setState({navMenu: newMenu})
  }

  render() {
    const style = {
      root: {
        display: 'grid',
        gridTemplateRows: 'auto 20px',
        resize: 'both',
        width: '100vw',
        height: '100vh'
      },
      main: {
        display: 'flex',
        height: 'calc(100% - 20px)'
      },
      tabWrapper: {
        height: '100%',
        flexGrow: '1'
      }
    }
    
    const navBarProps = {
      
    }
    const navMenuProps = {
      
    }
    const toolMenuProps = {
      
    }

    const navBar = (this.state.navBar) ? <NavBar {...navBarProps}/> : null;
    const navMenu = (this.state.navMenu) ? <NavMenu {...navMenuProps}/> : null;
    const toolMenu = (this.state.toolMenu) ? <ToolMenu {...toolMenuProps}/> : null;

    return (
    <div style={style.root}>
      <div style={style.main}>
        {navBar}
        {navMenu}
        <div style={style.tabWrapper}>
          <div className="etabs-tabgroup">
              <div className="etabs-tabs"></div>
              <div className="etabs-buttons"></div>
          </div>
          <div className="etabs-views"></div>
        </div>
        {toolMenu}
      </div>
      <LogBar />
    </div>);
  }
}


export default App;