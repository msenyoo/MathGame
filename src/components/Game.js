import React, {Component} from 'react';
import {Text, View, StyleSheet, Button, ScrollView} from 'react-native';
import GButton from './Button';
import shuffle from 'lodash.shuffle';

const Separator = () => <View style={styles.separator} />;
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

  sumSelected = 0;

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
    this.sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (this.sumSelected < this.target) {
      return 'PLAYING';
    }
    if (this.sumSelected === this.target) {
      return 'WON';
    }
    if (this.sumSelected > this.target) {
      return 'LOST';
    }
  };

  render() {
    const gameStatus = this.gameStatus;
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.banner}>Mind Game</Text>
        <Separator />
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={[styles.timerContainer]}>
          <Text style={styles.timer}>
            {this.gameStatus == 'PLAYING'
              ? this.state.remainingSeconds + ' remaining'
              : this.gameStatus == 'WON'
              ? 'Congratulations!'
              : 'Better luck next time!'}
          </Text>
        </View>

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

        <View>
          {this.gameStatus !== 'PLAYING' && (
            <Button
              style={styles.button}
              title="Play Again"
              onPress={this.props.onPlayAgain}
            />
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(236, 237, 234)',
  },
  banner: {
    fontSize: 30,
    color: 'black',
    marginTop: 10,
    textAlign: 'center',
  },
  target: {
    fontSize: 50,
    backgroundColor: 'skyblue',
    textAlign: 'center',
    margin: 20,
    borderRadius: 5,
  },
  button: {
    height: 100,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: 'rgb(242, 246, 252)',
  },
  timerContainer: {marginBottom: 10},
  timer: {
    fontSize: 20,
    textAlign: 'center',
    alignContent: 'center',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  STATUS_PLAYING: {
    backgroundColor: 'rgb(201, 199, 212)',
  },

  STATUS_WON: {
    backgroundColor: 'rgb(158, 240, 26)',
  },

  STATUS_LOST: {
    backgroundColor: 'rgb(238, 150, 75)',
  },
});

export default Game;
