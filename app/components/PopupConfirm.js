import React from 'react';
import {View, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import Modal from 'react-native-modal';
import {Dimensions} from 'react-native';
import PropTypes from 'prop-types';

export default PopupConfirm = (props) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    text: {
      letterSpacing: 0.65,
      textAlign: 'center',
      color: '#003458',
    },
    modalContainer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      borderRadius: 10,
      backgroundColor: 'rgba(239, 239, 239, 1)',
      textAlign: 'center',
      elevation: 10,
      fontSize: 24,
    },
    button: {
      width: '100%',
      padding: 10,
    },
    inputContainer: {
      borderWidth: 1,
      paddingLeft: 5,
      paddingRight: 5,
      borderRadius: 5,
      borderColor: '#444444',
      backgroundColor: '#f1f1f1',
      width: '95%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'center',
      marginBottom: 10,
    },
  };
  var popupTitle = props.popupTitle ? props.popupTitle : 'Popup Title';
  var message = props.message ? props.message : '';
  var stateMessage = props.stateMessage ? props.stateMessage : '';
  var yes = props.yes ? props.yes : 'Yes';
  var cancel = props.cancel ? props.cancel : 'Cancel';
  var isReason = props.isReason ? true : false;
  var placeholder = props.placeholder ? props.placeholder : "Enter the reason why you've decided none of above.";
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight =
    Platform.OS === 'ios' ? Dimensions.get('window').height : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT');
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Modal isVisible={props.isVisible} deviceWidth={deviceWidth} deviceHeight={deviceHeight}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={{...styles.text, fontSize: 19, lineHeight: 24, marginTop: 20, fontWeight: 'bold'}}>{popupTitle}</Text>
                {stateMessage !== '' && (
                  <Text style={{...styles.text, fontSize: 15, lineHeight: 20, marginLeft: 10, marginRight: 10, marginBottom: 20, marginTop: 15}}>
                    {stateMessage}
                  </Text>
                )}
                {message !== '' && (
                  <Text style={{...styles.text, fontSize: 15, lineHeight: 20, marginLeft: 10, marginRight: 10, marginBottom: 20, color: '#E94C36'}}>
                    {message}
                  </Text>
                )}
                {isReason === true && (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder={placeholder}
                      style={{color: '#003458', marginLeft: 5}}
                      multiline={true}
                      numberOfLines={3}
                      onChangeText={(txt) => {
                        props.handleChangeReason(txt);
                      }}>
                      {props.reason}
                    </TextInput>
                  </View>
                )}
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      width: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 48,
                      borderColor: '#BCC0C3',
                      borderTopWidth: 1,
                      borderRightWidth: 1,
                    }}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        if (props.handleYes) props.handleYes();
                      }}>
                      <Text style={{...styles.text, fontSize: 19, lineHeight: 24}}>{yes}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width: '50%', alignItems: 'center', justifyContent: 'center', height: 48, borderColor: '#BCC0C3', borderTopWidth: 1}}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        if (props.handleCancel) props.handleCancel();
                      }}>
                      <Text style={{...styles.text, fontSize: 19, lineHeight: 24, color: '#E94C36'}}>{cancel}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};

PopupConfirm.propTypes = {
  handleYes: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};
