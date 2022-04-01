import React, {useEffect} from 'react';
import {View, Text, Image} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import {setUser} from '../../store/actions/main';


export default Splash = (props) => {
  useEffect(() => {
    displayData();
  });

  const dispatch = useDispatch();

  const displayData = async () => {
    try {
      
      let userEmail = await AsyncStorage.getItem('email');
      let userExpertId = await AsyncStorage.getItem('expertId');

      if(userEmail != null && userExpertId != null){
        dispatch(setUser({email: userEmail,  expertId: userExpertId}));
        props.navigation.navigate('HomeLayout');
      }
     
    } catch (err) {
      console.log('err : ', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.text}>Conflict Resolver</Text>
        <Image source={require('../../assets/images/logo.png')} />
      </View>
      <View>
        <PrimaryButton
          buttonText={'Login'}
          onPressFunc={() => props.navigation.navigate('Login')}
          bgColor={'#ffffff'}
          color={'#003458'}
          textBold={'bold'}
          marginLeft={28}
          marginRight={28}
        />
        <PrimaryButton buttonText={'Register User'} onPressFunc={() => props.navigation.navigate('RegisterUser')} marginLeft={28} marginRight={28} />
      </View>
    </View>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  text: {
    marginTop: 30,
    marginBottom: 15,
    color: '#003458',
    fontSize: 30,
    textAlign: 'center',
  },
};
