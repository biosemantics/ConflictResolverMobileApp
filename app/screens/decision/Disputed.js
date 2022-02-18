
import React, { useState, useEffect } from "react"
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, SafeAreaView, StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import Voice from '@react-native-community/voice';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';


export default function Disputed() {
    const [pitch, setPitch] = useState('');
    const [error, setError] = useState('');
    const [end, setEnd] = useState('');
    const [started, setStarted] = useState('');
    
    const [results, setResults] = useState([]);
    const [activebtn, setActivebtn] = useState(0);
    const [dropDown1, setDropDown1] = useState(false);
    const [dropDown2, setDropDown2] = useState(false);

    const [input1, setinput1] = useState('');
    const [input2, setinput2] = useState('');
    const [input3, setinput3] = useState('');
    const [input4, setinput4] = useState('');
   



    const [partialResults, setPartialResults] = useState([]);
    const [startRec, setStartRec] = useState(0);



    useEffect(() => {
        //Setting callbacks for the process status
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;

        return () => {
            //destroy the process after switching the screen
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => {
        console.log('value of active button: ', activebtn);
        console.log('value of results: ', results);
        if (results.length > 0) {
            var msg = results[0];
            if (activebtn == 1) {
                setinput1(msg);
                msg = '';
            } if (activebtn == 2) {
                setinput2(msg);
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

    }, [activebtn, results]);

    const start = (inputName) => {
        setActivebtn(inputName);
        // console.log('hello',inputName);
        // console.log('helloVal',activebtn);
        startRecognizing(inputName);
    }
    const onSpeechStart = (e) => {
        //Invoked when .start() is called without error
        console.log('onSpeechStart: ', e);
    };

    const onSpeechEnd = (e) => {
        //Invoked when SpeechRecognizer stops recognition
        console.log('onSpeechEnd: ', e);
    };

    const onSpeechError = (e) => {
        //Invoked when an error occurs.
        console.log('onSpeechError: ', e);
        setError(JSON.stringify(e.error));
    };

    const saveValue = (msg) => {

        if (activebtn == 1) {
            setinput1(msg);
        } else if (activebtn == 2) {
            setinput2(msg);
        } else if (activebtn == 3) {
            setinput3(msg);
        } else if (activebtn == 4) {
            setinput4(msg);
        } else {

        }
    };

    const handleChange = (clickedValue) => {
        // console.log(clickedValue);
        if (clickedValue == 'disable') {
            setDropDown1(true);
            setDropDown2(false);
        } else if (clickedValue == 'disable2') {
            setDropDown2(true);
            setDropDown1(false);
        }
    }

    const onSpeechResults = (e) => {
        //Invoked when SpeechRecognizer is finished recognizing

        let msg = '';
        setResults(e.value);
        // console.log('onSpeechResults: ', e.value[0]);
        if (e.value.length > 0) {
            msg = e.value[0];
        } else {
            msg = 'Wrong Value';
        }

        saveValue(msg);
    };

    const onSpeechPartialResults = (e) => {
        //Invoked when any results are computed
        // console.log('onSpeechPartialResults: ', e);
        setPartialResults(e.value);
    };

    const startRecognizing = async (inputName) => {
        console.log('here', activebtn);
        //Starts listening for speech for a specific locale
        try {
            await Voice.start('en-US');
            setPitch('');
            setError('');
            setStarted('');
            setResults([]);
            setPartialResults([]);
            setEnd('');
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);

        };
    }

    const stopRecognizing = async () => {
        // console.log('hi');
        //Stops listening for speech
        try {
            await Voice.stop();
            // console.log('hi');
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    return (
        <ScrollView>
            <View>
                <View>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 20, color: '#544ea3' }}>Flattened</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 25 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#544ea3' }}>Definition:  </Text>
                        <Text style={{ color: '#544ea3' }}>not provided</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                            <Text style={{ color: '#544ea3' }}>Deprecations </Text>reasons:</Text>
                        <Text>  same as compressed</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text>Anton Reznik</Text>
                        <Text>2020-04-30</Text>
                    </View>

                    <View style={{ marginTop: 5 }}>
                        <Text>
                            <Text style={{ fontWeight: 'bold' }}>Dispute reason: in the following situations</Text>,
                            <Text>Flattened is appropriate, but compressed is misleading.
                            </Text>
                        </Text>
                        <Text style={{ marginTop: 5 }}><Text style={{ fontWeight: 'bold' }}>Proposed definition for restored </Text><Text>flattened: to become level or smooth</Text></Text>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <Text>Disputed by Hong Cut.</Text>
                    </View>
                </View>


                <Text style={{margin:15,fontSize:20,padding:10,color:'red',fontWeight:'bold'}}>You are able to select only one Drop Down from Ist && Second</Text>

                {/* //First DropDown With Speech Recognition */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 10,
                }}>
                    <Text style={{ fontSize: 18 }}>
                        Drop Down Ist
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
                                        <TextInput placeholder="Enter the new item" style={{ width: '95%', borderWidth: 1, height: 40 }} defaultValue={input1}/>
                                        <TouchableOpacity style={{ position: 'absolute', left: '85%', top: '20%' }} onPress={() => start(1)} >
                                            <FontAwesomeIcon icon={faMicrophone} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 10 }}>
                                        <TextInput placeholder="Enter a definition" style={{ width: '95%', borderWidth: 1, height: 40 }} defaultValue={input2} />
                                        <TouchableOpacity style={{ position: 'absolute', left: '85%', top: '20%' }} onPress={() => start(2)}>
                                            <FontAwesomeIcon icon={faMicrophone} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </View>
                    )
                }

                {/* //Existing value Section */}
                <View style={{ marginTop: 10, marginLeft: 30 }}>
                    <TextInput placeholder="Select superclass if quality" style={{ width: '90%', borderWidth: 1, height: 40, borderColor: 'gray', borderRadius: 10 }} selectTextOnFocus={false} editable={false} />
                    <TextInput placeholder="Select superclass if Structure" style={{ width: '90%', borderWidth: 1, height: 40, marginTop: 10, borderColor: 'gray', borderRadius: 10 }} selectTextOnFocus={false} editable={false} />
                </View>



                {/* //Second DropDown with Speech Recognition */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 10,
                }}>
                    <Text style={{ fontSize: 18 }}>
                        Drop Down 2nd
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
                                <View>
                                    <View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 10 }}>
                                        <TextInput placeholder="Enter an example Sentence" style={{ width: '95%', borderWidth: 1, height: 40 }} defaultValue={input3} />
                                        <TouchableOpacity style={{ position: 'absolute', left: '85%', top: '20%' }} onPress={() => start(3)}>
                                            <FontAwesomeIcon icon={faMicrophone} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 10 }}>
                                        <TextInput placeholder="Enter applicable taxa" style={{ width: '95%', borderWidth: 1, height: 40 }} defaultValue={input4} />
                                        <TouchableOpacity style={{ position: 'absolute', left: '85%', top: '20%' }} onPress={() => start(4)}>
                                            <FontAwesomeIcon icon={faMicrophone} size={25} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </View>
                    )
                }

                {/* Another Existing Section */}
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 20, alignItems: 'center' }}>Suggest an existing term for the needed concept</Text>
                <View style={{ marginTop: 10, marginLeft: 30 }}>
                    <TextInput placeholder="Select the term if quality" style={{ width: '90%', borderWidth: 1, height: 40, borderColor: 'gray', borderRadius: 10 }} editable={false} selectTextOnFocus={false} />
                    <TextInput placeholder="Select the term if Structure" style={{ width: '90%', borderWidth: 1, height: 40, marginTop: 10, borderColor: 'gray', borderRadius: 10 }} editable={false} selectTextOnFocus={false} />
                </View>

                {/* Comment and Submit Section */}
                <View style={{ alignItems: 'center' }}>
                    <TextInput placeholder="Enter a record comment" />
                    <TouchableOpacity style={{ width: '80%', alignItems: 'center', backgroundColor: '#544ea3', padding: 5, borderRadius: 50, margin: 10 }} >
                        <Text style={{ color: 'white', fontSize: 20 }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>
    );
}


