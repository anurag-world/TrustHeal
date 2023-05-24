/* eslint-disable react/prop-types */
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CustomButton({ onPress, text, style, textstyle }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Text style={[styles.text, textstyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 15,
  },

  text: {
    textAlign: 'center',
    fontSize: 15,
  },
});
