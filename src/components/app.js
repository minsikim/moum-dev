import React from 'react';

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
      color: 'white'
    }

    return (
    <div style={style}>
      <h2>Welcome to React!</h2>
    </div>);
  }
}
