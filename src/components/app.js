import React from 'react';
import LogBar from './log-bar'
import NavBar from './nav-bar'
import NavMenu from './nav-menu'
import TabWrapper from './tab-wrapper'

const __LEFT_NAV_BAR_MENU__ = {
  default: [
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


export default class App extends React.Component {

  render() {
    const style = {
      root: {
        display: 'grid',
        gridTemplateRows: 'auto',
        resize: 'both'
      },
      main: {
        display: 'flex',
        height: (window.innerHeight-20)+'px'
      }
    }

    return (
    <div style={style.root}>
      <div style={style.main}>
        <NavBar />
        <NavMenu />
        <TabWrapper />
      </div>
      <LogBar />
    </div>);
  }
}
