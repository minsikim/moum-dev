import React from 'react';
import Radium from 'radium'
import LogBar from '../components/log-bar';
import NavBar from '../components/nav-bar';
import NavMenu from '../components/nav-menu';
import ToolMenu from '../components/tool-menu'
import Tabs from '../tabs/tabs'

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
      tabs: {
        default: ['welcome'],
        tabs: [
          //type: for icon
          //title: for text and id
          //id: title_type_index
        ],
        nextIndex: 1
      }

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
        height: '100%'
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
    const tabsProps = {
      
    }

    const navBar = (this.state.navBar) ? <NavBar {...navBarProps}/> : null;
    const navMenu = (this.state.navMenu) ? <NavMenu {...navMenuProps}/> : null;
    const toolMenu = (this.state.toolMenu) ? <ToolMenu {...toolMenuProps}/> : null;
    const tabs = (this.state.tabs) ? <Tabs style={style.tabWrapper} {...tabsProps}/> : null;

    return (
    <div style={style.root}>
      <div style={style.main}>
        {navBar}
        {navMenu}
        {tabs}
        {toolMenu}
      </div>
      <LogBar />
    </div>);
  }
}


export default App;