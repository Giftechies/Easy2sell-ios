import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';

export default StyleSheet.create({
  wrapper: {
    width: '100%',
    display:"flex",
    alignItems:"center"
  },
  contain: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 46,
    borderRadius: 5,
    padding: 10,
    backgroundColor: BaseColor.fieldColor,
  },
  autocomplete: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,backgroundColor:'#eaeaea'
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
