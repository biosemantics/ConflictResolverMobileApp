
import React, { useState, useEffect } from "react"
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, SafeAreaView, StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleLeft, faL, faMicrophone } from '@fortawesome/free-solid-svg-icons'
// import Voice from '@react-native-community/voice';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import NavHeader from "../../components/NavHeader";
import { Picker } from '@react-native-community/picker';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/tasks';
import { set_quality_item, set_structure_item } from "../../store/actions";

import PopupAlert from '../../components/PopupAlert';
import { Checkbox, RadioButton } from 'react-native-paper';

export default function Disputed(props) {
    const auth = useSelector(state => state.main.auth);

    const [disputed, setDisputed] = useState(props.navigation.getParam('disputed', {}));

    const [pitch, setPitch] = useState('');
    const [error, setError] = useState('');
    const [end, setEnd] = useState('');
    const [started, setStarted] = useState('');
    const [qualityType, setQualityType] = useState('');
    const [structureType, setStructureType] = useState('');

    const [qualityType2, setQualityType2] = useState('');
    const [structureType2, setStructureType2] = useState('');

    const [pickerStructure, setPickerStructure] = useState('');

    const [results, setResults] = useState([]);
    const [activebtn, setActivebtn] = useState(0);
    const [dropDown1, setDropDown1] = useState(false);
    const [dropDown2, setDropDown2] = useState(false);
    const [qualityItems, setQualityItems] = useState([]);
    const [structureItems, setStructureItems] = useState([]);

    const [newTerm, setNewTerm] = useState('');
    const [newDefinition, setNewDefinition] = useState('');
    const [input3, setinput3] = useState('');
    const [input4, setinput4] = useState('');
    const [example, setExample] = useState('');
    const [superClass, setSuperClass] = useState(qualityType);
    const [elucidation, setElucidation] = useState('');
    const [newDate, setNewDate] = useState(new Date());
    const [definitionSrc, setDefinitionSrc] = useState('');
    const [logicDefinition, setlogicDefinition] = useState('');
    const [decisionExperts, setDecisionExperts] = useState('');

    const [ontology, setOntology] = useState(carex);

    const [partialResults, setPartialResults] = useState([]);
    const [startRec, setStartRec] = useState(0);

    const getCurrentDate=()=>{

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
  
        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        console.log(date + '-' + month + '-' + year);
        return date + '-' + month + '-' + year;//format: dd-mm-yyyy;

  }
    console.log(getCurrentDate);

    const [message, setMessage] = useState('');
    const [errorInfoModal, setErrorInfoModal] = useState(false);
    const [isSelected, setSelection] = useState(false);

    const [checked, setChecked] = React.useState(false);

    const dispatch = useDispatch();
    // console.log("hsddsdsdsdsssdsey" + superClass);

    // useEffect(() => {
    //     //Setting callbacks for the process status
    //     Voice.onSpeechStart = onSpeechStart;
    //     Voice.onSpeechEnd = onSpeechEnd;
    //     Voice.onSpeechError = onSpeechError;
    //     Voice.onSpeechResults = onSpeechResults;
    //     Voice.onSpeechPartialResults = onSpeechPartialResults;

    //     return () => {
    //         //destroy the process after switching the screen
    //         Voice.destroy().then(Voice.removeAllListeners);
    //     };

    // }, []);

    useEffect(() => {
        if (results.length > 0) {
            var msg = results[0];
            if (activebtn == 1) {
                setNewTerm(msg);
                msg = '';
            } if (activebtn == 2) {
                setNewDefinition(msg);
                msg = '';
            } if (activebtn == 3) {
                setinput3(msg);
                msg = '';
            } if (activebtn == 4) {
                setinput4(msg);
                msg = '';
            } else {
                console.log('error');
            }
            setResults([]);
        }

        api.getQualityItem().then(result => {
            let qualityItem = [];

            qualityItem.push({
                id: result.data.data.details[0].IRI,
                name: result.data.text
            });

            qualityItem = getQualityItem(result.data.children, qualityItem);
            if (qualityItem.length > 0) {
                setQualityItems(qualityItem)
            }
            dispatch(set_quality_item(qualityItem));
        });

        api.getStructureItem().then(result => {
            let structureItem = [];

            structureItem.push({
                id: result.data.data.details[0].IRI,
                name: result.data.text
            });

            structureItem = getQualityItem(result.data.children, structureItem);
            if (structureItem.length > 0) {
                setStructureItems(structureItem)
            }
            dispatch(set_structure_item(structureItem));
        });

    }, [activebtn, results]);


    const getQualityItem = (data, qualityItem) => {
        if (data) {
            data.forEach(element => {
                if (element.children) {
                    getQualityItem(element.children, qualityItem);
                } else {
                    qualityItem.push({
                        id: element.data.details[0].IRI,
                        name: element.text
                    });
                }

            });
        }

        return qualityItem;

    }

    const getStructureItem = (data, structureItem) => {
        if (data) {
            data.forEach(element => {
                if (element.children) {
                    getStructureItem(element.children, structureItem);
                } else {
                    structureItem.push({
                        id: element.data.details[0].IRI,
                        name: element.text
                    });
                }

            });
        }
        return structureItem;
    }

    // const user = auth.username;
    const user = "";
    
    // const ontology = disputed.label;

    const submitData = () => {
        const example1 = input3 + " " + input4;


        if (dropDown1 == true) {
            if (checked == 'Quality') {
                setPickerStructure(qualityType);
                console.log('hello');
                console.log(qualityType);
                console.log("set data quality");
                console.log(newDate);
                console.log(pickerStructure);

            } else if (checked == 'Structure') {
                setPickerStructure(structureType);
            }
            // console.log("jfgdsfgh");
            api.submitNewTerm(user, ontology, newTerm, pickerStructure, newDefinition, elucidation, user, newDate, definitionSrc, example1, logicDefinition).then(result => {
                if (result.data.error) {
                    setMessage(result.data.message);
                    setErrorInfoModal(true);
                }
                console.log("no response");
            }).catch(err => {
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
                }
                setMessage(msg);
                setErrorInfoModal(true);
            });
            // api.submitDisputedterm(user, ontology, newTerm, pickerStructure, decisionExperts, newDate).then(result => {
            //     if (result.data.error) {
            //         setMessage(result.data.message);
            //         setErrorInfoModal(true);
            //     }
            //     console.log("no response");

            // }).catch(err => {
            //     let msg = 'Connection error. Please check your network connection.';
            //     switch (err.response.status) {
            //         case 404:
            //             msg = "Server not found";
            //             break;
            //         case 403:
            //             msg = "You are forbidden.";
            //             break;
            //         case 401:
            //             msg = "You are unautherized";
            //             break;
            //     }
            //     setMessage(msg);
            //     setErrorInfoModal(true);
            // });

        }
        else if (dropDown2 == true) {
            if (checked == 'Quality') {
                setPickerStructure(qualityType2);


            } else if (checked == 'Structure') {
                setPickerStructure(structureType2);
            }
            api.submitDisputedterm(user, ontology, newTerm, pickerStructure, decisionExperts, newDate).then(result => {
                if (result.data.error) {
                    setMessage(result.data.message);
                    setErrorInfoModal(true);
                }
                console.log("no response");

            }).catch(err => {
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
                }
                setMessage(msg);
                setErrorInfoModal(true);
            });
        }

    }


    const start = (inputName) => {
        setActivebtn(inputName);
        startRecognizing(inputName);
    }
    const onSpeechStart = (e) => {
        //Invoked when .start() is called without error
    };

    const onSpeechEnd = (e) => {
        //Invoked when SpeechRecognizer stops recognition
    };

    const onSpeechError = (e) => {
        //Invoked when an error occurs.
        setError(JSON.stringify(e.error));
    };

    const saveValue = (msg) => {

        if (activebtn == 1) {
            setNewTerm(msg);
        } else if (activebtn == 2) {
            setNewDefinition(msg);
        } else if (activebtn == 3) {
            setinput3(msg);
        } else if (activebtn == 4) {
            setinput4(msg);
        } else {

        }
    };

    const handleChange = (clickedValue) => {
        if (clickedValue == 'disable') {
            setDropDown1(true);
            setDropDown2(false);
            if (dropDown1 == true) {
                setDropDown1(false);
                setDropDown2(true);
            }
        }

        else if (clickedValue == 'disable2') {
            setDropDown2(true);
            setDropDown1(false);
            if (dropDown2 == true) {
                setDropDown1(true);
                setDropDown2(false);
            }
        }
        else {
            setDropDown1(false);
            setDropDown2(false);
        }
    }

    const onSpeechResults = (e) => {
        //Invoked when SpeechRecognizer is finished recognizing

        let msg = '';
        setResults(e.value);
        if (e.value.length > 0) {
            msg = e.value[0];
        } else {
            msg = 'Wrong Value';
        }

        saveValue(msg);
    };

    const onSpeechPartialResults = (e) => {
        //Invoked when any results are computed
        setPartialResults(e.value);
    };

    // const startRecognizing = async (inputName) => {
    //     //Starts listening for speech for a specific locale
    //     try {
    //         await Voice.start('en-US');
    //         setPitch('');
    //         setError('');
    //         setStarted('');
    //         setResults([]);
    //         setPartialResults([]);
    //         setEnd('');
    //     } catch (e) {
    //         //eslint-disable-next-line
    //         console.error(e);

    //     };
    // }

    // const stopRecognizing = async () => {

    //     try {
    //         await Voice.stop();

    //     } catch (e) {
    //         //eslint-disable-next-line
    //         console.error(e);
    //     }
    // };

    return (
        <View style={{ marginHorizontal: 20, marginVertical: 20, display: 'flex', }}>
            <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <NavHeader

                        size={22}
                        bold={true}
                        navigation={props.navigation}
                        onBackFunc={() => props.navigation.goBack()}
                        headerText={disputed.label}
                    />
                </View>

                <View style={[Styles.rowText, { marginTop: 20 }]}>
                    <Text>
                        <Text style={[Styles.rowDefinition, { color: '#544ea3' }]}>Definition:  </Text>
                        <Text style={Styles.TextMain} >{disputed.definition}</Text>
                    </Text>
                </View>
                <View style={Styles.rowText}>
                    <Text style={Styles.TextMain}>
                        <Text style={[Styles.rowDefinition, { color: '#544ea3' }]}>Deprecations reasons: </Text>
                        <Text style={Styles.TextMain}>{disputed.deprecated_reason}</Text>
                    </Text>
                </View>

                <View style={Styles.rowText}>
                    <Text style={Styles.TextMain}>
                        <Text style={Styles.rowDefinition}>Dispute reason: </Text>
                        <Text style={Styles.TextMain}>{disputed.disputed_reason}</Text>
                    </Text>
                </View>

                <View style={Styles.rowText}>
                    <Text style={Styles.TextMain}>
                        <Text style={Styles.rowDefinition}>Proposed definition for restored </Text>
                        <Text style={Styles.TextMain}>{disputed.new_definition}</Text>
                    </Text>
                </View>
                <View style={Styles.rowText}>
                    <Text style={Styles.rowDefinition}>Disputed by </Text>
                    <Text style={Styles.TextMain}>{disputed.disputed_by}</Text>
                </View>



                <Text style={{ margin: 15, fontSize: 20, padding: 10, color: 'red', fontWeight: 'bold' }}>What action should be taken to address the disputes?</Text>

                {/* //First DropDown With Speech Recognition */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '90%',
                    marginTop: 10,
                }}>
                    <Text style={{ fontSize: 16 }}>
                        Add a new term to express the needed concept
                    </Text>
                    <TouchableOpacity onPress={() => {
                        handleChange('disable');
                    }}>
                        {
                            dropDown1 ?
                                <AntDesignIcon name="caretup" size={25} />
                                : <AntDesignIcon name="caretdown" size={25} />
                        }
                    </TouchableOpacity>
                </View>
                {
                    dropDown1 && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} >
                            {
                                <View>
                                    <View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 10 }}>
                                        <TextInput
                                            placeholder="Enter the new item"
                                            style={{ width: '95%', borderWidth: 1, height: 40 }}
                                            value={newTerm}
                                            onChangeText={text => setNewTerm(text)}
                                        />
                                        <TouchableOpacity style={{ position: 'absolute', left: '85%', top: '20%' }} onPress={() => start(1)} >
                                            <FontAwesomeIcon icon={faMicrophone} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 10 }}>
                                        <TextInput
                                            placeholder="Enter a definition"
                                            style={{ width: '95%', borderWidth: 1, height: 40 }}
                                            value={newDefinition}
                                            onChangeText={text => setNewDefinition(text)}
                                        />
                                        <TouchableOpacity style={{ position: 'absolute', left: '85%', top: '20%' }} onPress={() => start(2)}>
                                            <FontAwesomeIcon icon={faMicrophone} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    {/* //Existing value Section */}
                                    <View style={{ marginHorizontal: 30, width: "90%" }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', margin: 10 }}>
                                            <RadioButton
                                                value="Quality"
                                                status={checked === 'Quality' ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked('Quality')}
                                            />
                                            <RadioButton
                                                value="Structure"
                                                status={checked === 'Structure' ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked('Structure')}
                                            />
                                            <Text style={{ margin: 8 }}>{checked}</Text>
                                        </View>

                                        {checked === 'Quality' ?

                                            <Picker
                                                style={{ height: 50 }}
                                                mode="dropdown"
                                                selectedValue={qualityType}
                                                onValueChange={(itemValue, itemIndex) =>
                                                    // console.log("set quality iri value"),
                                                    setQualityType(itemValue, itemIndex)
                                                }
                                                disabled={true}
                                            >
                                                {qualityItems.map((item, index) => {
                                                    return (
                                                        <Picker.Item
                                                            label={item.name}
                                                            value={item.id}
                                                            key={index}
                                                        />
                                                    );

                                                })}

                                            </Picker>
                                            :
                                            <Picker
                                                style={{ height: 50 }}
                                                mode="dropdown"
                                                selectedValue={structureType}
                                                onValueChange={(itemValue, itemIndex) =>
                                                    //alert(selectedValue)
                                                    setStructureType(itemValue, itemIndex)
                                                }
                                            >
                                                {structureItems.map((item, index) => {
                                                    return (
                                                        <Picker.Item
                                                            label={item.name}
                                                            value={item.id}
                                                            key={index}
                                                        />
                                                    );

                                                })}

                                            </Picker>
                                        }
                                    </View>

                                    {/* Second input and mic field */}
                                    <View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 10 }}>
                                        <TextInput
                                            placeholder="Enter an example Sentence"
                                            style={{ width: '95%', borderWidth: 1, height: 40 }}
                                            value={input3}
                                            // onChangeText={input3}
                                            onChangeText={text => setinput3(text)}
                                        />
                                        <TouchableOpacity style={{ position: 'absolute', left: '85%', top: '20%' }} onPress={() => start(3)}>
                                            <FontAwesomeIcon icon={faMicrophone} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 10 }}>
                                        <TextInput
                                            placeholder="Enter applicable taxa"
                                            style={{ width: '95%', borderWidth: 1, height: 40 }}
                                            value={input4}
                                            onChangeText={text => setinput4(text)}
                                        />
                                        <TouchableOpacity style={{ position: 'absolute', left: '85%', top: '20%' }} onPress={() => start(4)}>
                                            <FontAwesomeIcon icon={faMicrophone} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </View>
                    )
                }

                {/* //Second DropDown with Speech Recognition */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '90%',
                    marginTop: 10,
                }}>
                    <Text style={{ fontSize: 16 }}>
                        Suggest an existing term for the needed concept
                    </Text>
                    <TouchableOpacity onPress={() => {
                        handleChange('disable2');
                    }}>
                        {
                            dropDown2 ?
                                <AntDesignIcon name="caretup" size={25} />
                                : <AntDesignIcon name="caretdown" size={25} />
                        }
                    </TouchableOpacity>
                </View>

                {
                    dropDown2 && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                            {

                                < View style={{ marginTop: 10, marginLeft: 20, width: "90%" }}>
                                    {/* Another Existing Section */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', margin: 10 }}>
                                        <RadioButton
                                            value="Quality"
                                            status={checked === 'Quality' ? 'checked' : 'unchecked'}
                                            onPress={() => setChecked('Quality')}
                                        />
                                        <RadioButton
                                            value="Structure"
                                            status={checked === 'Structure' ? 'checked' : 'unchecked'}
                                            onPress={() => setChecked('Structure')}
                                        />
                                        <Text style={{ margin: 8 }}>{checked}</Text>
                                    </View>
                                    
                                {checked === 'Quality' ?

                                    <Picker
                                        style={{ height: 50 }}
                                        mode="dropdown"
                                        selectedValue={qualityType2}
                                        onValueChange={(itemValue, itemIndex) =>
                                            //alert(selectedValue)
                                            setQualityType2(itemValue, itemIndex)
                                        }
                                    >
                                        {qualityItems.map((item, index) => {
                                            return (
                                                <Picker.Item
                                                    label={item.name}
                                                    value={item.id}
                                                    key={index}
                                                />
                                            );

                                        })}

                                    </Picker>
                                    :
                                    <Picker
                                        style={{ height: 50 }}
                                        mode="dropdown"
                                        selectedValue={structureType2}
                                        onValueChange={(itemValue, itemIndex) =>
                                            //alert(selectedValue)
                                            setStructureType2(itemValue, itemIndex)
                                        }
                                    >
                                        {structureItems.map((item, index) => {
                                            return (
                                                <Picker.Item
                                                    label={item.name}
                                                    value={item.id}
                                                    key={index}
                                                />
                                            );

                                        })}

                                    </Picker>
                                }
                                </View>

                            }
                        </View>

                    )
                }

                {/* Comment and Submit Section */}
                <View style={{ alignItems: 'center' }}>
                    <TextInput
                        placeholder="Enter a record comment"
                        style={{ backgroundColor: '#e8e8e8', width: '80%', borderRadius: 50 }}

                    />
                    <TouchableOpacity
                        style={Styles.button}
                        onPress={() => submitData()}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Submit</Text>
                    </TouchableOpacity>
                </View>
                <PopupAlert
                    popupTitle="Error"
                    message={message}
                    isVisible={errorInfoModal}
                    handleOK={() => { setErrorInfoModal(false) }}
                />
            </ScrollView >
        </View >
    );
}

const Styles = StyleSheet.create({
    rowText: {
        flexDirection: 'row',
        justifyContent: 'flex-start',

    },
    rowDefinition: {
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'auto',
    },
    TextMain: {
        fontSize: 16,
        flex: 1,
    },
    button: {
        width: '80%',
        alignItems: 'center',
        backgroundColor: '#544ea3',
        padding: 5,
        borderRadius: 50,
        margin: 10
    },
})
