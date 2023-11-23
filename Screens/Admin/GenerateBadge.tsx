/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

const GenerateBadge = ({route}: any) => {
  useEffect(() => {
    console.log('Badges : ', route.params.ba);
  }, []);

  const badge: any = route.params;
  return <View />;
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#0bda51',
    color: 'white',
    borderRadius: 5,
    margin: 20,
    marginTop: 30,
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
