/*
Example

{"Battery":255,
"LevelActions":"|||",
"LevelNames":"Off|Level1|Level2|Level3",
"LevelOffHidden":"false",
"RSSI":12,
"SelectorStyle":"1",    1 for drop down, 0 for buttons
"description":"",
"dtype":"Light/Switch",
"id":"00000000",
"idx":128,
"name":"selector test",
"nvalue":0,
"stype":"Selector Switch",
"svalue1":"0",
"switchType":"Selector",
"unit":1}

*/

import React, { Component } from 'react';
import LoadingWidget from './LoadingWidget'
import MqttClientSingleton from '../util/MqttClientSingleton'
import './SwitchSelector.css';
import './SwitchOnOff.css';

class SwitchSelector extends Component {

  constructor(props) {
    super(props);
    this.mqtt = new MqttClientSingleton();
  }

  handleSelect = (event) => {
    if (this.props.readOnly) {
      return
    }
    const message = {
      command: 'switchlight',
      idx: this.props.idx,
      switchcmd: 'Set Level',
      level: event.target.value
    };
    this.mqtt.publish(message);
  }

  render() {
    if (!this.props.deviceSpec) {
      return <LoadingWidget />
    }
    const theme = this.props.theme;
    const style = theme ? {
      backgroundColor: this.props.readOnly ? '' : theme.background,
      color: theme.text
    } : {};
    const buttonStyleOff = theme ? {
      background: theme.buttonOff,
      color: theme.textOff
    } : {};
    const buttonStyleOn = theme ? {
      background: theme.buttonOn,
      color: theme.textOn
    } : {};
    const carretStyle = theme ? {
      color: this.props.value === '0' ? theme.textOff : theme.textOn
    } : {};
    const list = this.props.levels.map(function(level, index) {
      const levelValue = index * 10;
      const selected = parseInt(this.props.value, 10) === levelValue;
      if (index === 0 && this.props.deviceSpec["LevelOffHidden"] === true) {
        return null;
      }
      if (this.props.useButtons) {
        return (
          <button key={index + '-' + level}
                  className={'switch' + (selected ? ' On' : '')}
                  style={selected ? buttonStyleOn : buttonStyleOff}
                  value={levelValue} onClick={this.handleSelect}>{level}
          </button>
        );
      }
      return (
        <option key={index + '-' + level} value={levelValue}>{level}</option>
      );
    }, this);
    if (this.props.useButtons) {
      return (<div className="selector" style={style}><h2>{this.props.label}</h2><section>{list}</section></div>);
    }
    return (<div className={'selector' + (this.props.value !== '0' ? ' On' : '')} style={style}>
        <h2>{this.props.label}</h2>
        <div>
        <i className="carret" style={carretStyle}>▼</i>
        <select disabled={this.props.readOnly} value={this.props.value} style={this.props.value === '0' ? buttonStyleOff : buttonStyleOn} onChange={this.handleSelect}>{list}</select>
        </div></div>);
  }
}

export default SwitchSelector
