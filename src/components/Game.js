import React, {Component} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import GButton from './Button';
import shuffle from 'lodash.shuffle';

export class Game extends Component {
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };
  gameStatus = 'PLAYING';

  randomNumber = Array.from({length: this.props.count}).map(
    () => 1 + Math.floor(10 * Math.random()),
  );

  target = this.randomNumber
    .slice(0, this.props.count - 2)
    .reduce((acc, cur) => acc + cur, 0);
  shuffledNumbers = shuffle(this.randomNumber);

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        (prevState) => {
          return {remainingSeconds: prevState.remainingSeconds - 1};
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        },
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
    }));
  };

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }
  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }
  };

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.banner, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={[styles.container, styles.buttonContainer]}>
          {this.shuffledNumbers.map((val, index) => (
            <GButton
              key={index}
              id={index}
              label={val}
              isDisabled={
                this.isNumberSelected(index) || gameStatus !== 'PLAYING'
              }
              onPress={this.selectNumber}
            />
          ))}
        </View>
        <View style={[styles.timerContainer]}>
          {this.gameStatus == 'PLAYING' && (
            <Text style={styles.timer}>
              {this.state.remainingSeconds ? this.state.remainingSeconds : ''}
            </Text>
          )}
        </View>
        <View style={styles.container}>
          {this.gameStatus !== 'PLAYING' && (
            <Button
              style={styles.button}
              title="Play Again"
              onPress={this.props.onPlayAgain}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    fontSize: 50,
    backgroundColor: 'skyblue',
    textAlign: 'center',
    margin: 50,
  },
  button: {
    height: 100,
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  timerContainer: {
    fontSize: 50,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 50,
  },
  timer: {
    color: 'white',
    backgroundColor: 'red',
    paddingTop: 7,
    fontSize: 25,
    width: 50,
    height: 50,
    textAlign: 'center',
    borderRadius: 60,
    alignContent: 'center',
  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },

  STATUS_WON: {
    backgroundColor: 'green',
  },

  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
