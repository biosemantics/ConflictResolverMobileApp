import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import {Picker} from '@react-native-community/picker';
import SearchableDropdown from 'react-native-searchable-dropdown';

import { useDispatch, useSelector } from 'react-redux';


import NavHeader from '../../components/NavHeader';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DeclineModal from '../../components/DeclineModal';
import WarningModal from '../../components/WarningModal';
import PopupConfirm from '../../components/PopupConfirm';
import CommentsModal from '../../components/CommentsModal';

import api from '../../api/tasks';
import { set_options } from '../../store/actions'
import { set_tasks } from '../../store/actions'

export default Category = (props) => {
    const [task, setTask] = useState(props.navigation.getParam('task',{}));
    const [optionIndex, setOptionIndex] = useState(null);
    const [optionIndexes, setOptionIndexes] = useState([]);
    const [declineModal, setDeclineModal] = useState(false);
    const [comment, setComment] = useState("");
    const [group, setGroup] = useState('');
    const [warningModal, setWarningModal] = useState(false);
    const [stateMessage, setStateMessage] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [characterDefaultIndex, setCharacterDefaultIndex] = useState(0);
    const [commentsModal, setCommentsModal] = useState(false);

    const auth = useSelector(state => state.main.auth);
    const options = useSelector(state => state.main.data.options);
    const quailtyData = useSelector(state => state.main.metaData.quality);

    const dispatch = useDispatch();
    
    var deviceHeight = Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

    const getTerm = () => {
        api.getOptions(task.termId, auth.expertId).then(result=>{
            console.log(result);
            if (result.data.options_data && result.data.options_data.data && result.data.options_data.decisions) {
                let temp = [...optionIndexes];
                result.data.options_data.data.map((indOption, index) => {
                    if (result.data.options_data.decisions.includes(indOption.option_)) {
                        temp.push(index);
                    }
                })
                setOptionIndexes(temp);
                if (result.data.options_data.curComment != "") {
                    setComment(result.data.options_data.curComment);
                }
            }
            dispatch(set_options(result.data.options_data));           
        });
    }
    useEffect(() => {
        getTerm();
    }, []);

    const onDecline = () => {
        setDeclineModal(true);
    }

    const onSubmit = () => {
        var canSubmit = 0;
        if (optionIndexes.length !== 0 || group != '') {
            canSubmit = 1;
        }
        if (canSubmit === 0) {
            setWarningModal(true);
        } else {
            var messageVal = "You've decided that " + task.term + " belongs to categories: ";
            var ind = 0;
            if (optionIndexes.length === 0) {
                messageVal += group;
            } else {
                optionIndexes.map(indOpt => {
                    if (ind !== 0) {
                        messageVal += ', ';
                    }
                    messageVal += options.data[indOpt].option_;
                    ind ++;
                })
            }
            messageVal += '.';
            if (optionIndexes.length !== 0) {
                if (group != '') {
                    var ind = 0;
                    messageVal += "\n\nThe selection of " + group + " is ignored because you also selected ";
                    optionIndexes.map(indOpt => {
                        if (ind !== 0) {
                            messageVal += ', ';
                        }
                        messageVal += options.data[indOpt].option_;
                        ind ++;
                    })
                    messageVal += '.';
                }
            }
            setStateMessage(messageVal);
            setConfirmModal(true);
        }
    }

    const submitDecesion = async () => {
        if (optionIndexes.length !== 0) {
            let choices = [];
            optionIndexes.map(indOpt => {
                choices.push(options.data[indOpt].option_);
            });
            api.submitDecesions(auth.expertId, task.termId, choices, comment).then(result => {
                console.log('decision', result);
                if (result.data.error){

                }
                else if (result.data.error == false){
                    api.getTasks(auth.expertId).then(result=>{
                        dispatch(set_tasks(result.data.task_data));
                        props.navigation.goBack();
                    });
                }
            });
        } else {
            api.submitDecesion(auth.expertId, task.termId, group, comment).then(result => {
                console.log('decision', result);
                if (result.data.error){

                }
                else if (result.data.error == false){
                    api.getTasks(auth.expertId).then(result=>{
                        dispatch(set_tasks(result.data.task_data));
                        props.navigation.goBack();
                    });
                }
            });
        }
    }

    const clickOption = (index) => {
        let temp = [...optionIndexes];
        if (temp.includes(index) == true) {
            var eleInd = temp.indexOf(index);
            temp.splice(eleInd, 1);
        } else {
            temp.push(index);
        }
        setOptionIndexes(temp);
    }

    return (
        <>
        <ScrollView contentContainerStyle={{backgroundColor: "#fff", flexDirection: 'column', justifyContent: 'space-between'}} keyboardShouldPersistTaps="handled">
            <NavHeader
                headerText={task.term}
                size={22}
                bold={true}
                letterSpacing={1.6}
                navigation={props.navigation}
                onBackFunc={()=>{props.navigation.goBack()}}
            />
            <View style={{alignContent: 'center', alignItems: 'center', width: '100%', padding: 10}}>
            {
                options && options.termDeclined &&
                <Text style={{...styles.senctence, fontSize: 14, color: 'red', fontWeight: 'bold'}}>You declined the term.</Text>
            }
            {
                task.data !== '' &&
                <Text style={{...styles.senctence, color: '#555', fontWeight: '800'}}>Example sentence: "{task.data.replace(/(\r\n|\n|\r)/gm,"").replace(/"/g, "")}"</Text>
            }
            {
                task.data === '' &&
                <Text style={{...styles.senctence, color: '#555', fontWeight: '800'}}>Example sentences not available</Text>
            }
            </View>
            <View style={{alignContent: 'center', alignItems: 'center', width: '100%', backgroundColor: 'green'}}>
                <Text style={{...styles.senctence, color: '#fff'}}>Which of the following category does {task.term} belong?</Text>
            </View>
            <ScrollView contentContainerStyle={{padding: 10}} style={{ height: deviceHeight - 370}} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                {
                    options && options.data && options.data.map((option, index)=> (
                        <TouchableOpacity key={index} onPress={() => clickOption(index)}>
                            <View style={styles.option}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', width: '85%'}}>
                                    <Text style={{fontSize: 20, width: '35%'}}>
                                        {option.option_} ({option.count}): 
                                    </Text>
                                    <Text style={{...styles.senctence, textAlign: 'left', marginLeft: 5, width: '65%'}}>
                                        {option.definition.replace(/"/g, "")}
                                    </Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '85%'}}>
                                    <Image source={require('../../assets/images/noimage.png')} />
                                    <View style={{flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', alignItems: 'center'}}>
                                    {
                                        optionIndexes.map((indOpt, it) => {
                                            if (indOpt == index) {
                                                return (
                                                    <Image source={require('../../assets/images/ok.png')} style={{width: 40, height: 40}} key={it}/>
                                                )
                                            }
                                        })
                                    }
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                }
                <TouchableOpacity >
                    <View >
                        <Text style={{fontSize: 20}}>
                            None of above, select a new category:
                        </Text>
                        <View style={{borderWidth: 1, borderRadius: 5, borderColor: 'grey', marginTop: 3}}>
                            <SearchableDropdown
                                onItemSelect={(item) => {
                                    let newArr = [...optionIndexes];
                                    newArr = [];
                                    setOptionIndexes(newArr);
                                    setGroup(item.name);
                                    setCharacterDefaultIndex(item.id - 1);
                                }}
                                itemValue={group}
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
                                defaultIndex={characterDefaultIndex}
                                resetValue={false}
                                textInputProps={
                                    {
                                        placeholder: "Enter a quality name ",
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
                        </View>
                    </View>
                </TouchableOpacity>
                <View>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder="Enter or record comment" style={{color: '#003458',width: '100%', paddingLeft:10, paddingRight:10, marginLeft: 5}} onChangeText={txt => {setComment(txt)}}>{comment}</TextInput>
                    </View>
                    <View style={{borderWidth: 1, borderRadius: 4, width: 140, justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                    <TouchableOpacity onPress={() => setCommentsModal(true)}>
                        <Text style={{padding: 3}}>Other's comments</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            
            <PrimaryButton
                buttonText={'Submit'} 
                onPressFunc={onSubmit} 
                marginLeft={20} 
                marginRight={20} 
                marginBottom={5}
            />

            <PrimaryButton
                buttonText={'Reject the Term'} 
                onPressFunc={onDecline} 
                marginLeft={20} 
                marginRight={20} 
                marginBottom={5}
                bgColor={"#F4463A"}
                borderColor={"#F4463A"}
            />

            <WarningModal
                popupTitle="Warning"
                message={"You need to select at least one category."}
                isVisible={warningModal}
                handleYes={()=> {
                    setWarningModal(false);
                }}
                handleCancel={()=>{setWarningModal(false)}}
            />

            <PopupConfirm
                popupTitle="Are you sure to submit?"
                stateMessage={stateMessage}
                message={"You will not be able to change this decision after submit."}
                isVisible={confirmModal}
                handleYes={()=> {
                    setConfirmModal(false);
                    submitDecesion();
                }}
                handleCancel={()=>{setConfirmModal(false)}}
            />

            <CommentsModal
                popupTitle="Other's comments"
                comments={options.comments}
                term={task.term}
                isVisible={commentsModal}
                handleYes={()=> {
                    setCommentsModal(false);
                }}
                handleCancel={()=>{setCommentsModal(false)}}
            />
            
        </ScrollView>
        <DeclineModal
            popupTitle="Are you sure to deline the term?"
            message={"You will not be able to change this decision after decline."}
            isVisible={declineModal}
            task={task}
            handleYes={()=> {
                setDeclineModal(false);
                api.getTasks(auth.expertId).then(result=>{
                    dispatch(set_tasks(result.data.task_data));
                    setTimeout(() => {
                        props.navigation.goBack();
                    }, 100);
                });
            }}
            handleCancel={()=>{setDeclineModal(false)}}
        />
        </>
    )
}
const styles = {
    senctence: {
        textAlign: 'left',
        fontSize: 12,
    },
    option: {
        flexDirection:'column',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        alignItems: 'flex-start'
    },
    inputContainer: {
        borderRadius: 9999,
        backgroundColor: '#f1f1f1',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
    },
    button: {
        borderRadius: 9999,
        padding: 8,
        width: 35,
        height: 35,
        alignItems: 'center',
        alignContent: 'center',
    }
}