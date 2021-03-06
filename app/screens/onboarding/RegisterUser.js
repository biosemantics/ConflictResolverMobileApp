import React, {useState, useEffect} from 'react';
import { ScrollView, View } from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import FormField from '../../components/FormField';
import PopupAlert from '../../components/PopupAlert';
import NavHeader from '../../components/NavHeader';

import { registerUser } from '../../api/auth';

import {useDispatch} from 'react-redux';

import {setUser} from '../../store/actions/main';

export default RegisterUser = ( props ) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [message, setMessage] = useState('');

  const [errorInfoModal, setErrorInfoModal] = useState(false);
  const [successInfoModal, setSuccessInfoModal] = useState(false);

  const dispatch = useDispatch();

  const handleUsername = (s) => {
    setUsername(s);
  }

  const handlePassword = (s) => {
    setPassword(s);
  }

  const handleEmail = (s) => {
    setEmail(s);
  }
  
  const handleFirstname = (s) => {
    setFirstname(s);
  }
  
  const handleLastname = (s) => {
    setLastname(s);
  }

  const onResigerUser = () => {
    registerUser(email, username, firstname, lastname, password).then(result => {
      console.log(result.data);
      if (result.data.error) {
        setMessage(result.data.message);
        setErrorInfoModal(true);
      }
      else {
          dispatch(setUser({email, username, expertId: result.data.expertId}));
          setMessage(result.data.message);
          setSuccessInfoModal(true);
          props.navigation.navigate('HomeLayout');
      }
    }).catch( err => {
      console.log(err);
      let msg = 'Connection error. Please check your network connection.';
      switch (err.response.status) {
        case 404:
          msg = "Server not found";
          break;
        case 403:
          msg = "You are forbidden.";
          break;
        case 401:
          msg = "You are unautherized";
          break;
        case 500:
          msg = "Server internal Error";
          break;          
      }
      setMessage(msg);
      setErrorInfoModal(true);
    });
  }
  return (
    <ScrollView style={{backgroundColor: '#FFFFFF'}}>
      <NavHeader
          headerText={'Resiger User'}
          size={22}
          bold={true}
          letterSpacing={1.6}
          navigation={props.navigation}
          onBackFunc={()=>{props.navigation.navigate('Splash')}}
      />
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <FormField marginTop={28} placeholder={'Enter Username'} value={username} onChange={handleUsername}/>
          <FormField placeholder={'Enter Password'} value={password} onChange={handlePassword} password={true} />
          <FormField placeholder={'Enter Email'} value={email} onChange={handleEmail} email={true}/>
          <FormField placeholder={'Enter First name'} value={firstname} onChange={handleFirstname}/>
          <FormField placeholder={'Enter Last name'} value={lastname} onChange={handleLastname}/>
        </View>
        <PrimaryButton 
          buttonText={'Resiger User'} 
          onPressFunc={onResigerUser} 
          marginLeft={20} 
          marginRight={20} 
          marginBottom={40}
          enable={(username != "" && password != "" && email != "" && firstname != "" && lastname != "")}
        />
      </View>
      <PopupAlert
        popupTitle="Error"
        message={message}
        isVisible={errorInfoModal}
        handleOK={()=>{setErrorInfoModal(false)}}
      />
      <PopupAlert
        popupTitle="Success"
        message={message}
        isVisible={successInfoModal}
        handleOK={()=>{setSuccessInfoModal(false)}}
      />
    </ScrollView>
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
    width: '100%',
    paddingVertical: 30,
  },
  text: {
    marginTop: 30,
    marginBottom: 15,
    color: "#003458",
    fontSize: 30,
    textAlign: 'center',
  },
};
