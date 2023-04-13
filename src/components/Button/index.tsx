import React from 'react';
import {
  Text,
  TouchableOpacity
} from 'react-native';

import colors from '../../constants/colors';

interface ButtonProps {
  onPress: any,
  style: string,
  text: string
}

function Button(props:ButtonProps): JSX.Element {

  return (
    <TouchableOpacity 
      style={{
        backgroundColor: (props.style === 'primary' ? colors.brown : props.style === 'secondary' ? colors.brownLite : props.style === 'tertiary' ? 'red' : props.style === 'disabled' ? 'grey' : colors.brown),
        paddingVertical: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        width: '100%',
        height: 60,
        marginBottom: 10
      }}
      onPress={props.onPress}
    >
      <Text
        style={{
          fontSize: 20,
          color: colors.white
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}

export default Button;
