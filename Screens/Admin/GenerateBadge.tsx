/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {Card, Icon} from 'react-native-elements';

const GenerateBadge = () => {return <></>;};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#0bda51',
    color: 'white',
    borderRadius: 5,
    margin:20,
    marginTop:30,
    textAlign: 'center',
    fontSize: 16,
  },
  ButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GenerateBadge;
