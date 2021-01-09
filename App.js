import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Game from './src/components/Game';

export class App extends Component {
  state = {
    gameId: 1,
  };
  resetGame = () => {
    this.setState((prevState) => {
      return {gameId: prevState.gameId + 1};
    });
  };
  render() {
    return (
      <Game
        count={6}
        key={this.state.gameId}
        onPlayAgain={this.resetGame}
        initialSeconds={10}
      />
    );
  }
}
export default App;
