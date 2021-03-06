import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, Dimensions, TextInput} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';


import NavHeader from '../../components/NavHeader';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import WarningModal from '../../components/WarningModal';
import PopupConfirm from '../../components/PopupConfirm';
import CommentsModal from '../../components/CommentsModal';

import api from '../../api/tasks';
import { set_equivTerm_options } from '../../store/actions'
import { set_tasks } from '../../store/actions'

export default EquivTerm = (props) => {
    const [task, setTask] = useState(props.navigation.getParam('task',{}));
    const [optionIndexes, setOptionIndexes] = useState([]);
    const [none, setNone] = useState(false);
    const [isNone, setIsNone] = useState(false);
    const [warningModal, setWarningModal] = useState(false);
    const [stateMessage, setStateMessage] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [reason, setReason] = useState("");
    const [placeholder, setPlaceholder] = useState("");
    const [commentsModal, setCommentsModal] = useState(false);

    const auth = useSelector(state => state.main.auth);
    const options = useSelector(state => state.main.data.equivTermOptions);

    const dispatch = useDispatch();
    
    var deviceHeight = Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

    const getTerm = () => {
        api.getExactOptions(task.termId, auth.expertId).then(result=>{
            console.log(result);
            if (result.data.options_data && result.data.options_data.data ) {
                if (result.data.options_data.countSolution != 0) {
                    if (result.data.options_data.decisions.length == 0) {
                        setNone(true);
                    } else {
                        let temp = [...optionIndexes];
                        result.data.options_data.decisions.map((indDecision, index) => {
                            temp.push(indDecision);
                        });
                        setOptionIndexes(temp);
                    }
                    setReason(result.data.options_data.curReason);
                }
            }
            dispatch(set_equivTerm_options(result.data.options_data));           
        });
    }
    useEffect(() => {
        getTerm();
    }, []);

    const onSubmit = () => {
        var messageVal = "You've decided that " + task.term + " is NOT equivalent with ";
        var placeholderVal = "";
        var ind = 0;
        if (optionIndexes.length == options.data.length) {
            placeholderVal = "Enter the reason why you\'ve decided none of above.";
            messageVal = "You've confirmed " + task.term + " is equivalent with all candidate terms";
            setIsNone(false);
        } else {
            options.data.map((eachOption) => {
                if (optionIndexes.indexOf(eachOption.id) < 0) {
                    if (ind !== 0) {
                        messageVal += ', ';
                    }
                    messageVal += eachOption.label;
                    ind ++;
                    placeholderVal += 'Enter the reason for ' + eachOption.label + '\n';
                }
            });
            setIsNone(true);
        }
        messageVal += '.';
        setStateMessage(messageVal);
        setPlaceholder(placeholderVal);
        setConfirmModal(true);
    }

    const submitDecesion = async () => {
        if (none == false) {
            api.submitExactDecesions(auth.expertId, task.termId, optionIndexes, reason).then(result => {
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
            api.submitExactDecesionsNone(auth.expertId, task.termId, reason).then(result => {
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
        setNone(false);
    }

    const clickNone = () => {
        let temp = [...optionIndexes];
        temp = [];
        setOptionIndexes(temp);
        setNone(true);
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
            <ScrollView contentContainerStyle={{padding: 10}} style={{ height: deviceHeight - 205}} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                {   options.definition &&
                    <Text style={{fontSize: 13, textAlign: 'left', marginLeft: 10, marginRight: 10}}>
                        {" " + options.definition.replace(/"/g, "")}
                    </Text>
                }
                {
                    // options.sentences && options.sentences != "" &&
                    <Text style={{fontSize: 13, textAlign: 'left', marginLeft: 10, marginRight: 10}}>
                        {options.sentences != "" ? " Used in: " + options.sentences : " "}
                    </Text>
                }
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '95%'}}>
                    <Image source={require('../../assets/images/noimage.png')} />
                </View>
                <View style={{alignContent: 'center', alignItems: 'center', width: '100%', backgroundColor: 'green', padding: 10, paddingTop: 2, paddingBottom: 2}}>
                    <Text style={{...styles.sentence, color: '#fff'}}>Which of the following terms are equivalent with {task.term}, regardless of context?</Text>
                </View>
                {
                    options && options.data && options.data.map((option, index)=> (
                        <TouchableOpacity key={index} onPress={() => clickOption(option.id)}>
                            <View style={styles.option}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '95%'}}>
                                    <Text style={{fontSize: 20}}>
                                        {option.label} ({option.count})
                                    </Text>
                                    {
                                        optionIndexes.map((indOpt, it) => {
                                            if (indOpt == option.id) {
                                                return (
                                                    <Image source={require('../../assets/images/ok.png')} style={{width: 40, height: 40}} key={it}/>
                                                )
                                            }
                                        })
                                    }
                                </View>
                                <Text style={{fontSize: 13, textAlign: 'left', marginLeft: 10, marginRight: 10}}>
                                    {"- " + option.definition.replace(/"/g, "")}
                                </Text>
                                {
                                    option.sentences != "" &&
                                    <Text style={{fontSize: 13, textAlign: 'left', marginLeft: 10, marginRight: 10}}>
                                        {"- Used in: " + option.sentences}
                                    </Text>
                                }
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '95%'}}>
                                    <Image source={require('../../assets/images/noimage.png')} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                }
                <TouchableOpacity onPress={() => clickNone()}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '95%'}}>
                        <Text style={{fontSize: 20}}>
                            None of above ({options.noneCount})
                        </Text>
                        {
                            none == true &&
                            <Image source={require('../../assets/images/ok.png')} style={{width: 40, height: 40}} />
                        }
                    </View>
                </TouchableOpacity>
                <View style={{borderWidth: 1, borderRadius: 4, width: 140, justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                    <TouchableOpacity onPress={() => setCommentsModal(true)}>
                        <Text style={{padding: 3}}>Other's comments</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            <PrimaryButton
                buttonText={'Submit'} 
                onPressFunc={onSubmit} 
                marginLeft={20} 
                marginRight={20} 
                marginBottom={5}
                enable={(none == true) || (optionIndexes.length > 0)}
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
                isVisible={confirmModal}
                handleYes={()=> {
                    setConfirmModal(false);
                    submitDecesion();
                }}
                yes={"Confirm"}
                handleChangeReason={(text) => {
                    setReason(text);
                }}
                reason={reason}
                isReason={isNone}
                placeholder={placeholder}
                handleCancel={()=>{setConfirmModal(false)}}
            />

            <CommentsModal
                popupTitle="Other's comments"
                comments={options.reasons}
                isVisible={commentsModal}
                term={task.term}
                noneText="No comments"
                handleYes={()=> {
                    setCommentsModal(false);
                }}
                handleCancel={()=>{setCommentsModal(false)}}
            />
        </ScrollView>
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