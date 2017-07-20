import React, {Component} from 'react';
import {connect} from 'react-redux';
import Grid from '../Grid'
import {nextGeneration, startGeneration, reset} from '../../store'

import './game.scss'

export class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {running: false, savedCells: []};
  }

  componentWillUnmount() {
    if (this.state.running)
      this.stop();
  }

  save() {
    this.setState((prevState, props) => {
      const newSavedCells = prevState.savedCells.slice();
      newSavedCells.push(props.grid.cells);
      return ({savedCells: newSavedCells});
    });
  }

  start() {
    this.setState({running: true});
    this.props.startGeneration();
    this.interval = setInterval(this.props.startGeneration, 100);
  }

  stop() {
    this.setState({running: false});
    clearInterval(this.interval);
  }

  render() {
    const {grid, iterations} = this.props;

    return <section className="game">
      <div className="controls">
        <button className="control start" onClick={this.props.nextGeneration}>Next</button>
        {!this.state.running && <button className="control start" onClick={() => this.start()}>Start</button>}
        {this.state.running && <button className="control stop" onClick={() => this.stop()}>Stop</button>}
        {this.state.savedCells.length === 0 &&
        <button className="control save" onClick={() => this.save()}>Save</button>}
        {this.state.savedCells.reverse().map((cells, i) => <button key={i}
                                                                   className="control reset"
                                                                   onClick={() => this.props.reset(cells)}>Reset</button>)}
        iterations: {iterations}
        {/*<input type="range" min="1" max="2000" step ="50" value ="200" onChange={(event) => console.log('adf', event)} />*/}
      </div>
      <div className="full">
        <Grid cells={grid.cells}/>
      </div>
    </section>;
  }
}

const mapStateToProps = (store) => {
  return {
    grid: store.grid,
    iterations: store.iterations
  }
};
const mapDispatchToProps = {nextGeneration, startGeneration, reset};
export default connect(mapStateToProps, mapDispatchToProps)(Game);