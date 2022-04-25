import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
// import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {faSignOut} from '@fortawesome/free-solid-svg-icons';

export default class NavHeader extends React.Component {
  _menu = null;

  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
  }

  handleBack() {
    this.props.navigation.goBack();
  }

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };
  // valueGettingClear = () => {

  // };

  render() {
    var onBackFunc = this.props.onBackFunc ? this.props.onBackFunc : this.handleBack;

    const clearAsyncStorage = async() => {
  
      await AsyncStorage.clear();
      this.props.navigation.navigate('Splash'); 
    }
    return (
      <View style={styles.container}>
         {this.props.headerText != 'Home' ? 
        <TouchableOpacity style={styles.backBtn} onPress={() => onBackFunc()}>
          <AntDesignIcon name="left" size={25} />
        </TouchableOpacity>
        :null}
        
        <View style={{width: '80%'}}>
          <Text style={styles.text}>&nbsp;{this.props.headerText}</Text>
        </View>

        {this.props.headerText == 'Home' ? 
          <TouchableOpacity style={{position: 'absolute', top: 7, right: 10, padding: 10}} onPress={() => clearAsyncStorage()}>
            <FontAwesomeIcon icon={faSignOut} color={'black'} size={25} />
          </TouchableOpacity>
          : null
        }
      </View>
    );
  }
}
const styles = StyleSheet.create({ 
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    padding: 15,
  },
  icon: {
    width: 24,
    height: 24,
  },
  backBtn: {
    position: 'absolute',
    left: 5,
    top: 7,
    padding: 10,
  },
  text: {
    width: '100%',
    textAlign: 'center',
    fontSize: 22,
    color: '#003458',
    fontWeight: 'bold',
  },
  gearBtn: {
    position: 'absolute',
    right: 5,
    top: 7,
  },
  menu: {
    position: 'absolute',
    right: 5,
    top: 7,
  },
});
