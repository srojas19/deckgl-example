import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import {json as requestJson} from 'd3-request';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FudGkyMTIiLCJhIjoiY2phYWllaGw0MGlmeDJxcXBtMjU5YmRheiJ9.xxHKd_m0-gLkUvYpm-uLWA';

const DATA_URL = {
  AIRPORTS: 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/line/airports.json',
  FLIGHT_PATHS: 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/line/heathrow-flights.json'
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      flightPaths: null,
      airports: null
    }

    requestJson(DATA_URL.FLIGHT_PATHS, (err, response)=>{
      if(!err) {
        this.setState({flightPaths: response});
      }
    });
    requestJson(DATA_URL.AIRPORTS, (err, response)=>{
      if(!err){
        this.setState({airports: response});
      }
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    })
  }

  render() {
    const {viewport, flightPaths, airports} = this.state;
    return (
      <MapGL 
        {...viewport}
        mapStyle='mapbox://styles/mapbox/dark-v9'
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay
          viewport={viewport}
          strokeWidth={3}
          flightPaths = {flightPaths}
          airports = {airports}
        />
      </MapGL>
    );
  }
}

export default App;
