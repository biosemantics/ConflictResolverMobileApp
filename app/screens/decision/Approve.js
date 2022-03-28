import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import { Checkbox } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import NavHeader from '../../components/NavHeader';
import PrimaryButton from '../../components/PrimaryButton';
import PopupConfirm from '../../components/PopupConfirm';
import DeclineModal from '../../components/DeclineModal';
import WarningModal from '../../components/WarningModal';
import CommentsModal from '../../components/CommentsModal';

import api from '../../api/tasks';
import { set_approve_options } from '../../store/actions'
import { set_tasks } from '../../store/actions'

export default Approve = (props) => {
    const [task, setTask] = useState(props.navigation.getParam('task',{}));

    var selection = (new Array(task.sCount)).fill(false);
    var setSelection = (new Array(task.sCount)).fill(null);
    ((new Array(task.sCount)).fill(null)).map((it, index) => {
        [selection[index], setSelection[index]] = useState(false);
    })
  
    const [newDefinition, setNewDefinition] = useState(null);
    const [confirmModal, setConfirmModal] = useState(false);
    const [declineModal, setDeclineModal] = useState(false);
    const [warningModal, setWarningModal] = useState(false);
    const [noSentencewarningModal, setNoSentencewarningModal] = useState(false);
    const [comment, setComment] = useState("");
    const [stateMessage, setStateMessage] = useState('');
    const [commentsModal, setCommentsModal] = useState(false);
    const [checked, setChecked] = useState(false);

    const auth = useSelector(state => state.main.auth);
    const options = useSelector(state => state.main.data.approveOptions);
    
    const dispatch = useDispatch();
    
    var deviceHeight = Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

    const getTerm = () => {
        api.getApproveOptions(task.termId, auth.expertId).then(result=>{
            if (result.data.curComment != "") {
                setComment(result.data.curComment);
            }
            dispatch(set_approve_options(result.data));
        });
    }
    
    useEffect(() => {
        getTerm();
    }, []);

    const clearDefinition = (definitionId) => {
        let tmp = options;
        while (true) {
            let index = tmp.approveData.findIndex(it => it.definitionId == definitionId);
            if (index < 0) {
                break;
            }
            tmp.approveData.splice(index, 1);
        }
        dispatch(set_approve_options(tmp));
        selection.map((sel, index) => {
            setSelection[index](!sel);
        })
    }
    
    const setDefinition = (definitionId) => {
        var sentenceSelected = false;
        selection.map((sel, index) => {
            if (sel) {
                sentenceSelected = true;
            }
        });
        if (sentenceSelected == false) {
            setNoSentencewarningModal(true);
        } else {
            const sentenceIds = options.sentence.filter((it, index) => selection[index]).map(it => it.id);
         
            let tmp = options;
            sentenceIds.map(sId => {
                if (!tmp.approveData.find(it => it.sentenceId == sId && it.definitionId == definitionId)) {
                    tmp.approveData.push({sentenceId: sId, definitionId});
                }
            })
            dispatch(set_approve_options(tmp));
            selection.map((sel, index) => {
                if (sel) {
                    setSelection[index](false);
                }
            })
        }
    }
    const addDefinition = () => {
        api.addDefinition(task.termId, auth.expertId, newDefinition).then(result => {
            dispatch(set_approve_options({...options,...result.data}));
            setNewDefinition('');
        })
    }

    const removeDefinition = (id) => {
        api.removeDefinition(task.termId, auth.expertId, id).then(result => {
            dispatch(set_approve_options({...options,...result.data}));
            setNewDefinition('');
        })
    }

    const onSubmit = () => {
        var canSubmit = 0;
        var messageVal = "You've decided to approve definitions: ";
        var firstFlg = 0;
        if (options && options.definition) {
            options.definition.map((item, index) => {
                var curDefFlg = 0;
                options.approveData.filter(it => it.definitionId == item.id).map(item => {
                    canSubmit = 1;
                    curDefFlg = 1;
                });
                if (curDefFlg == 1) {
                    if (firstFlg == 0) {
                        firstFlg = 1;
                    } else {
                        messageVal += ", ";
                    }
                    messageVal += '"';
                    messageVal += item.definition.replace(/"/g, "");
                    messageVal += '"';
                }
            })
        }
        if (canSubmit == 0) {
            setWarningModal(true);
        } else {
            setStateMessage(messageVal);
            setConfirmModal(true);
        }
    }

    const onDecline = () => {
        setDeclineModal(true);
    }

    const onConfirmSubmit = () => {
        api.setDefinition(task.termId, auth.expertId, options.approveData.map(item => item.sentenceId), options.approveData.map(item => item.definitionId), comment).then(result => {
            api.getTasks(auth.expertId).then(result=>{
                dispatch(set_tasks(result.data.task_data));
                props.navigation.goBack();
            });
        })
    }

    return (
        <>
        <ScrollView contentContainerStyle={{backgroundColor: "#fff", flexDirection: 'column', justifyContent: 'space-between'}}>
            <NavHeader
                headerText={task.term + ' (' + task.data.substring(0, task.data.length - 1) + ')'}
                size={22}
                bold={true}
                letterSpacing={1.6}
                navigation={props.navigation}
                onBackFunc={()=>{
                    api.getTasks(auth.expertId).then(result=>{
                        dispatch(set_tasks(result.data.task_data));
                        props.navigation.goBack();
                    });
                }}
            />
            <View style={{alignContent: 'center', alignItems: 'center', width: '100%', padding: 10}}>
            {
                options && options.termDeclined &&
                <Text style={{...styles.senctence, fontSize: 14, color: 'red', fontWeight: 'bold'}}>You declined the term.</Text>
            }
            </View>
            <View style={{ }}>
                <View style={{alignContent: 'center', alignItems: 'center', width: '100%', backgroundColor: 'green'}}>
                    <Text style={{...styles.sentence, color: '#fff', marginLeft: 10}}>
                        Select/provide a good definition and example sentences for {task.term}.
                    </Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={{padding: 10}} style={{height: deviceHeight - 320}} nestedScrollEnabled={true}>
                <Text style={{...styles.sentence, color: '#003458'}}>
                    Proposed definitions:
                </Text>
                {
                    options && options.definition &&
                    options.definition.map((item, index) => {
                        return (
                            <View key={'sentence'+index}>
                                <View style={{flexDirection: 'column', marginBottom: 10/*, backgroundColor: color*/}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                                        <Text>{index+1}. {item.definition.replace(/"/g, "")}</Text>
                                        {
                                            item.expertId == auth.expertId && 
                                            <TouchableOpacity style={{...styles.button, width: 22, height: 22, padding: 4, backgroundColor: 'red'}} onPress={() => {removeDefinition(item.id)}}>
                                                <FontAwesomeIcon name="minus" size={12} color={"white"}/>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                                        <View style={{width: '15%'}}>
                                            <Text style={styles.sentence}>
                                                {
                                                    options.approveData.filter(it => it.definitionId == item.id).map(item => '#' + (options.sentence.findIndex(sen => sen.id == item.sentenceId) + 1) + ' ')
                                                }
                                            </Text>
                                        </View>
                                        <View style={{flexDirection:'row', width: '85%', marginRight: 3}}>
                                            <TouchableOpacity style={{borderWidth: 1, borderRadius: 5, padding: 3, width: '85%', alignItems:'center', alignContent:'center', justifyContent: 'center'}} onPress={() => {setDefinition(item.id)}}>
                                                <Text style={{...styles.sentence}}>
                                                    Select sentences fitting this definition, then click here
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{borderWidth: 1, borderRadius: 5, padding: 3, marginLeft: 5, width: '15%', alignItems:'center', alignContent:'center', justifyContent: 'center'}} onPress={() => {clearDefinition(item.id)}}>
                                                <Text style={{...styles.sentence}}>
                                                    Clear
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                <View style={styles.noneOfAbove}>
                    {
                        options && options.definition && options.definition.length === 0 &&
                        <View>
                            <Text>
                                No definitions exist
                            </Text>
                            <Text>
                                Please add a new definition:
                            </Text>
                        </View>
                    }
                    {
                        options && options.definition && options.definition.length !== 0 &&
                        <Text>
                            Or add a new definition:
                        </Text>
                    }
                    <View style={styles.inputContainer}>
                        <TextInput placeholder="Enter or record new definition" style={{color: '#003458', width: '75%', marginLeft: 5}} onChangeText={txt => {setNewDefinition(txt)}}>{newDefinition}</TextInput>
        
                        <TouchableOpacity style={{...styles.button, backgroundColor: '#013458'}} onPress={() => {addDefinition()}}>
                            <FontAwesomeIcon name="plus" size={20} color={"white"}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{...styles.sentence, color: '#003458'}}>
                    Select example sentences:
                </Text>
                {
                    options && options.sentence &&
                    options.sentence.map((item, index) => (
                        <View key={'sentence'+index} style={{flexDirection: 'row', alignItems: 'center'}}>
                            {selection[index] ?
                                <Checkbox.Android
                                    status={checked ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setChecked(!checked),
                                        setSelection[index](false);
                                    }}
                                    />
                                :
                                <Checkbox.Android
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked(!checked),
                                    setSelection[index](true);
                                }}
                                />
                            }
                            <Text style={{marginRight: 10, paddingRight: 10}}>{index+1}. "{item.sentence}"</Text>
                        </View>
                    ))
                }
                <View>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder="Enter or record comment" style={{color: '#003458', width: '100%', paddingLeft:10, paddingRight:10, marginLeft: 5}} onChangeText={txt => {setComment(txt)}}>{comment}</TextInput>
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
            
            <PopupConfirm
                popupTitle="Are you sure to submit?"
                stateMessage={stateMessage}
                message={"You will not be able to change this decision after submit."}
                isVisible={confirmModal}
                handleYes={()=> {
                    setConfirmModal(false);
                    onConfirmSubmit();
                }}
                handleCancel={()=>{setConfirmModal(false)}}
            />

            <WarningModal
                popupTitle="Warning"
                message={"You need to select/provide at least one definition AND example sentence."}
                isVisible={warningModal}
                handleYes={()=> {
                    setWarningModal(false);
                }}
                handleCancel={()=>{setWarningModal(false)}}
            />

            <WarningModal
                popupTitle="Warning"
                message={"Select at least one example sentence."}
                isVisible={noSentencewarningModal}
                handleYes={()=> {
                    setNoSentencewarningModal(false);
                }}
                handleCancel={()=>{setNoSentencewarningModal(false)}}
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
    sentence: {
        textAlign: 'left',
        fontSize: 12,
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
    noneOfAbove: {
        width: '100%',
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