import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Modal from "react-native-modal";
import {Dimensions} from 'react-native';
import {Picker} from '@react-native-community/picker';
import PropTypes from 'prop-types'
import SearchableDropdown from 'react-native-searchable-dropdown';
import api from '../api/tasks';
import PopupConfirm from './PopupConfirm';

import { useDispatch, useSelector } from 'react-redux';

export default DeclineModal = (props) => {
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
            textAlign: "center",
            color: "#003458",
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
            marginBottom: 10
        },
        button: {
            width: '100%',
            padding: 10
        }
    };
    const [reason, setReason] = useState('');
    const [termType, setTermType] = useState('Character');
    const [confirmModal, setConfirmModal] = useState(false);
    const [alternativeTerm, setAlternativeTerm] = useState('');
    const auth = useSelector(state => state.main.auth);
    const quailtyData = useSelector(state => state.main.metaData.quality);
    const structureData = useSelector(state => state.main.metaData.structure);
    var popupTitle = (props.popupTitle ? props.popupTitle : 'Popup Title');
    var task = props.task;
    var message = (props.message ? props.message : 'Here is a message where we can put absolutely anything we want.');
    var yes = (props.yes ? props.yes : 'Reject term');
    var cancel = (props.cancel ? props.cancel : 'Cancel');
    const deviceWidth = Dimensions.get("window").width;
    const deviceHeight = Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

    const declineTerm = () => {
        console.log(reason);
        console.log(alternativeTerm);
        console.log(auth.expertId);
        console.log(task.termId);
        api.declineTerm(task.termId, auth.expertId, reason, alternativeTerm).then(() => {
            props.handleYes();
        });
    }

    const showConfirmModal = () => {
        setConfirmModal(true);
    }

    return (
        <View>
            <Modal isVisible={props.isVisible}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}>
                <View style={styles.modalContainer} >
                    <View style={styles.modalContent}>
                        <Text style={{...styles.text, fontSize:19, lineHeight:24, marginTop:20, fontWeight:'bold'}}>{"Reject the Term"}</Text>
                        <Text style={{...styles.text, fontSize:17, lineHeight:22, marginTop:10, marginLeft:10, marginRight:10, marginBottom:10, color:'black'}}>Why {task.term} is not good?</Text>
                        <View style={styles.inputContainer}>
                            <TextInput placeholder="Enter the reason why you decline the term." style={{color: '#003458', marginLeft: 5}} multiline={true} numberOfLines={3} onChangeText={txt => {setReason(txt)}}>{reason}</TextInput>
                        </View>
                        <Text style={{...styles.text, fontSize:17, lineHeight:22, marginTop:10, marginLeft:10, marginRight:10, marginBottom:10, color:'black'}}>Choose a term to replace {task.term}</Text>
                        <View style={{...styles.inputContainer, justifyContent:'center', width:'50%', borderWidth: 0}}>
                            <Picker
                                style={{height: 30, width: 140}}
                                selectedValue={termType}
                                onValueChange={(itemValue, itemIndex) => {
                                    setTermType(itemValue);
                                }}>
                                <Picker.Item label="Structure" value="Structure" />
                                <Picker.Item label="Character" value="Character" />
                            </Picker>
                        </View>
                        <View style={{...styles.inputContainer, justifyContent:'flex-start', width:'80%', borderRadius:1}}>
                            {
                                termType === 'Character' &&
                                <SearchableDropdown
                                    onItemSelect={(item) => {
                                        setAlternativeTerm(item.name);
                                    }}
                                    containerStyle={{ padding: 5, width: '100%' }}
                                    itemStyle={{
                                        padding: 10,
                                        marginTop: 2,
                                        backgroundColor: '#ddd',
                                        borderColor: '#bbb',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: 140 }}
                                    items={quailtyData}
                                    defaultIndex={0}
                                    resetValue={false}
                                    textInputProps={
                                        {
                                            placeholder: "Enter quality name",
                                            underlineColorAndroid: "transparent",
                                            style: {
                                                padding: 12,
                                                borderWidth: 1,
                                                borderColor: '#ccc',
                                                borderRadius: 5,
                                            },
                                        }
                                    }
                                    listProps={
                                        {
                                            nestedScrollEnabled: true,
                                        }
                                    }
                                />
                            }
                            {
                                termType === 'Structure' &&
                                <SearchableDropdown
                                    onItemSelect={(item) => {
                                        setAlternativeTerm(item.name);
                                    }}
                                    containerStyle={{ padding: 5, width: '100%' }}
                                    itemStyle={{
                                        padding: 10,
                                        marginTop: 2,
                                        backgroundColor: '#ddd',
                                        borderColor: '#bbb',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: 140 }}
                                    items={structureData}
                                    defaultIndex={0}
                                    resetValue={false}
                                    textInputProps={
                                        {
                                            placeholder: "Enter structure name",
                                            underlineColorAndroid: "transparent",
                                            style: {
                                                padding: 12,
                                                borderWidth: 1,
                                                borderColor: '#ccc',
                                                borderRadius: 5,
                                            },
                                        }
                                    }
                                    listProps={
                                        {
                                            nestedScrollEnabled: true,
                                        }
                                    }
                                />
                            }
                        </View>
                        <Text style={{...styles.text, fontSize:15, lineHeight:20, marginLeft:10, marginRight:10, marginBottom:20, color:'#F4463A'}}>{message}</Text>
                        <View style={{flexDirection:'row',}}>
                            <View style={{width:'50%', alignItems:'center', justifyContent:'center', height: 48, borderColor:'#BCC0C3', borderTopWidth:1, borderRightWidth: 1}}>
                                <TouchableOpacity style={styles.button} onPress={showConfirmModal} disabled={(reason == '')}>
                                    <Text style={{...styles.text, fontSize:19, lineHeight:24, color: ((reason == '') ? '#BFCFDB' : '#003458')}}>
                                        {yes}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{width:'50%', alignItems:'center', justifyContent:'center', height: 48, borderColor:'#BCC0C3', borderTopWidth:1}}>
                                <TouchableOpacity style={styles.button} onPress={() => { if (props.handleCancel) props.handleCancel(); }}>
                                    <Text style={{...styles.text, fontSize:19, lineHeight:24, color:'#E94C36'}}>
                                        {cancel}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            
            <PopupConfirm
                popupTitle="Are you sure to reject the term?"
                message={"You will not be able to change this decision after reject."}
                isVisible={confirmModal}
                handleYes={()=> {
                    setConfirmModal(false);
                    declineTerm();
                }}
                handleCancel={()=>{setConfirmModal(false)}}
            />
        </View>
    );
}


DeclineModal.propTypes = {
    handleYes : PropTypes.func.isRequired,
    handleCancel : PropTypes.func.isRequired,
}