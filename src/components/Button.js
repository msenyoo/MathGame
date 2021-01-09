import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const GButton = (props) => {
  const {id, label, isDisabled} = props;
  const handlePress = () => {
    if (props.isDisabled) {
      return;
    }
    props.onPress(props.id);
  };
  return (
    <TouchableOpacity>
      <Text
        id={id}
        style={[styles.number, isDisabled && styles.disabled]}
        onPress={handlePress}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  number: {
    color: 'white',
    backgroundColor: 'steelblue',
    marginHorizontal: 15,
    marginVertical: 25,
    fontSize: 35,
    width: 100,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
});
export default GButton;
