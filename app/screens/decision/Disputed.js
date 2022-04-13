import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMicrophone} from '@fortawesome/free-solid-svg-icons';
import Voice from '@react-native-community/voice';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import NavHeader from '../../components/NavHeader';
import {useDispatch, useSelector} from 'react-redux';
import api from '../../api/tasks';
import PopupAlert from '../../components/PopupAlert';
import PopupConfirm from '../../components/PopupConfirm';
import PrimaryButton from '../../components/PrimaryButton';

import {RadioButton} from 'react-native-paper';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {set_disputed_options, set_tasks} from '../../store/actions';
import CommentsModal from '../../components/CommentsModal';
import {set_options} from '../../store/actions';

export default function Disputed(props) {
  const [task, setTask] = useState(props.navigation.getParam('task', {}));

  const options = useSelector((state) => state.main.data.options);

  const auth = useSelector((state) => state.main.auth);

  const [disputed, setDisputed] = useState(props.navigation.getParam('disputed', {}));

  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [qualityType, setQualityType] = useState('');
  const [color, setColor] = useState('');

  const [pickerStructure, setPickerStructure] = useState('');
  const [qualityDefault, _qualityDefault] = useState(null);
  const [qualityDefalutExisting, _qualityDefaultExisting] = useState(null);
  const [structureDefault, _structureDefault] = useState(null);
  const [structureDefaultExisting, _structureDefaultExisting] = useState(null);
  const [stateMessage, setStateMessage] = useState('');
  const [results, setResults] = useState([]);
  const [activebtn, setActivebtn] = useState(0);
  const [dropDown1, setDropDown1] = useState(false);
  const [dropDown2, setDropDown2] = useState(false);
  const [qualityItems, setQualityItems] = useState([]);
  const [structureItems, setStructureItems] = useState([]);
  const [commentsModal, setCommentsModal] = useState(false);


  const [newTerm, setNewTerm] = useState(disputed.solutionGiven ? disputed.userSolution.newTerm : '');
  const [newDefinition, setNewDefinition] = useState(disputed.solutionGiven ? disputed.userSolution.newDefinition : '');
  const [input3, setinput3] = useState(disputed.solutionGiven ? disputed.userSolution.exampleSentence : '');
  const [input4, setinput4] = useState(disputed.solutionGiven ? disputed.userSolution.taxa : '');
  const [input5, setinput5] = useState(disputed.solutionGiven ? disputed.userSolution.comment : '');

  const [group, setGroup] = useState('');

  const [warningModal, setWarningModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const [partialResults, setPartialResults] = useState([]);

  const [characterDefaultIndex, setCharacterDefaultIndex] = useState(0);
  const [optionIndexes, setOptionIndexes] = useState([]);

  const [message, setMessage] = useState('');
  const [commentMessage, setCommentMessage] = useState([]);
  const [errorInfoModal, setErrorInfoModal] = useState(false);

  const [checked, setChecked] = React.useState('Quality');

  const quailtyData = useSelector((state) => state.main.metaData.quality);
  const structureData = useSelector((state) => state.main.metaData.structure);

  // console.log(quailtyData);
  // console.log(structureData);
  const dispatch = useDispatch();

  useEffect(() => {

    // api.getQuality().then((result) => {
    //   let qualityItem = [];
    //   if (result.data.children) {
    //     customLoop(result.data.children, qualityItem)
    //   }
    //   setQualityItems(qualityItem)

    //   // dispatch(set_quality_item(qualityItem));
    // });

    // api.getStructure().then((result) => {
    //   let structureItem = [];
    //   if (result.data.children) {
    //     customLoop(result.data.children, structureItem)
    //   }
    //   setStructureItems(structureItem)
    // });  

  }, []);

  // console.log(qualityItems);

  // const customLoop = (array, returnedArray) => {
  //   if (array) {
  //     array.forEach((element) => {
  //       if (element.children) {
  //         customLoop(element.children, returnedArray);
  //       } else {
  //         returnedArray.push({
  //           id: element.data.details[0].IRI,
  //           name: element.text,
  //         });
  //       }
  //     });
  //   }
  // }

  useEffect(() => {
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
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
    if (results.length > 0) {
      var msg = results[0];
      if (activebtn == 1) {  
        setNewTerm(msg);
        msg = '';
      }
      if (activebtn == 2) {
        setNewDefinition(msg);
        msg = '';
      }
      if (activebtn == 3) {
        setinput3(msg);
        msg = '';
      }
      if (activebtn == 4) {
        setinput4(msg);
        msg = '';
      }
      if (activebtn == 5) {
        setinput5(msg);
      } else {
        console.log('error');
      }
      setResults([]);
    }
  }, [activebtn, results]);

  useEffect(() => {
    if ('userSolution' in disputed) {
      let searchItem = disputed.userSolution.superclass;
      console.log("prefatch data", searchItem);
      // console.log(searchItem)
      if (searchItem) {
        if (quailtyData.length > 0){

          let responseQualityIndex = quailtyData.findIndex((item) => item.url == searchItem);
          let responseQuality = quailtyData.find((item) => item.url == searchItem);          
          
          if (responseQuality != undefined && disputed.userSolution.newOrExisting == 2 && disputed.userSolution.type == 1) {
            console.log('data goes here in existing quality ' + responseQualityIndex);

            handleChange('disable2');
            setChecked('Quality');

            let newArr = [...optionIndexes];
            newArr = [];

            setOptionIndexes(newArr);
            setPickerStructure(responseQuality.url);
            setGroup(responseQuality.name);
            setCharacterDefaultIndex(responseQuality.id - 1);
            _qualityDefaultExisting(responseQualityIndex);
            console.log("helo "+ qualityDefalutExisting);
          } else if (responseQuality != undefined && disputed.userSolution.newOrExisting == 1 && disputed.userSolution.type == 1) {
            console.log('data goes here in new quality ' + responseQualityIndex );

            handleChange('disable');
            setChecked('Quality');

            let newArr = [...optionIndexes];
            newArr = [];

            setOptionIndexes(newArr);
            setPickerStructure(responseQuality.id);
            setGroup(responseQuality.name);
            setCharacterDefaultIndex(responseQuality.id - 1);
            _qualityDefault(responseQualityIndex);
          }
        }
      }
    }
  }, [quailtyData]);

  //const setDefaultStructure = (structureItems) => {
  useEffect(() => {
    if ('userSolution' in disputed) {
      let searchItem = disputed.userSolution.superclass;
      if (searchItem) {
        if (structureData.length > 0) {
         
          let responseStructureIndex = structureData.findIndex((item) => item.id == searchItem);
          let responseStructure = structureData.find((item) => item.id == searchItem);
          
          if (responseStructure != undefined && disputed.userSolution.newOrExisting == 2 && disputed.userSolution.type == 2) {
            console.log('data goes here in exisiting structure ' + responseStructureIndex );

            handleChange('disable2');
            setChecked('Structure');

            let newArr = [...optionIndexes];
            newArr = [];

            setOptionIndexes(newArr);
            setPickerStructure(responseStructure.id);
            setGroup(responseStructure.name);
            setCharacterDefaultIndex(responseStructure.id - 1);
            _structureDefaultExisting(responseStructureIndex);
          } else if (responseStructure != undefined && disputed.userSolution.newOrExisting == 1 && disputed.userSolution.type == 2) {
            console.log('data goes here in new structure ' + responseStructureIndex);
           
            handleChange('disable');
            setChecked('Structure');

            let newArr = [...optionIndexes];
            newArr = [];

            setOptionIndexes(newArr);
            setPickerStructure(responseStructure.id);
            setGroup(responseStructure.name);
            setCharacterDefaultIndex(responseStructure.id - 1);
            _structureDefault(responseStructureIndex);
          }
        }
      }
    }
    
  }, [structureData]);

  // const getQuality = (data, qualityItem) => {
  //   if (data) {
  //     data.forEach((element) => {
  //       if (element.children) {
  //         getQuality(element.children, qualityItem);
  //       } else {
  //         qualityItem.push({
  //           id: element.data.details[0].IRI,
  //           name: element.text,
  //         });
  //       }
  //     });
  //   }
  //   if (qualityItem.length > 0) {
  //     setQualityItems(qualityItem);
  //   }
  //   //return qualityItem;
  //   return qualityItems;
  // };

  const getStructure = (data, structureItem) => {
    // let strcutureInfo = [...structureItems];
    if (data) {
      data.forEach((element) => {
        if (element.children) {
          getStructure(element.children, structureItem);
        } else {
          structureItem.push({
            id: element.data.details[0].IRI,
            name: element.text,
          });
        }
      });
    }
    if (structureItem.length > 0) {
      setStructureItems(structureItem);
    }
    // setDefaultStructure(structureItem);
    // return strcutureInfo;
    return structureItems;
  };

  const submitData = () => {
    var canSubmit = 0;
    if (optionIndexes.length !== 0 || group != '') {
      canSubmit = 1;
    }
    if (canSubmit === 0) {
      setMessage('Not Submitted');
      setWarningModal(true);
    } else {
      var messageVal = '';
      if (dropDown2) {
        messageVal = "You've selected using existing term " + group + ' to represent the concept';
      } else if (dropDown1) {
        messageVal = "You've selected a new term " + newTerm + ' to represent the concept ';
      }
      setStateMessage(messageVal);
      setConfirmModal(true);
    }
  };

  const submitNewTerm = async () => {
    if (dropDown1 == true) {
      if (checked == 'Quality') {
        var newExist1 = '1';
        var myType1 = '1';
      } else if (checked == 'Structure') {
        var newExist1 = '1';
        var myType1 = '2';
      }
    } else if (dropDown2 == true) {
      if (checked == 'Quality') {
        var newExist1 = '2';
        var myType1 = '1';
      } else if (checked == 'Structure') {
        var newExist1 = '2';
        var myType1 = '2';
      }
    }

    api
      .submitNewTerm(auth.expertId, disputed.termId, newTerm, newDefinition, pickerStructure, input3, input4, newExist1, input5, myType1)
      .then((result) => {
        if (result.data.error) {
        } else if (result.data.error == false) {
          setTimeout(() => setWarningModal(true), 1000);

          api.getDisputed(auth.expertId).then((result) => {
            dispatch(set_disputed_options(result.data));
          });
        }
      });
  };

  const start = (inputName) => {
    
   
//   setColor(true);
    if(color == true){
      setColor(false);
      Voice.stop();
    }else if(color == false){
      setColor(true);
      setActivebtn(inputName);
      startRecognizing(inputName);
    }
   console.log(color, "color");
      
  };

  const onSpeechStart = (e) => {
    //Invoked when .start() is called without error
    setStarted('')
  };

  const onSpeechRecognized = (e) => {};

  const onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition
  };

  const onSpeechError = (e) => {
    //Invoked when an error occurs.
    setError(JSON.stringify(e.error));
  };

  const saveValue = (msg) => {

    console.log('saveMsg', msg);
    if (activebtn == 1) {
      setNewTerm(msg);
      
    } else if (activebtn == 2) {
      setNewDefinition(msg);
     
    } else if (activebtn == 3) {
      setinput3(msg);
    
    } else if (activebtn == 4) {
      setinput4(msg);
    
    } else if (activebtn == 5) {
      setinput5(msg);
    } else {
    }
    msg = ''

  };

  const handleChange = (clickedValue) => {
   // setPickerStructure('');
    if (clickedValue == 'disable') {
      setDropDown1(true);
      setDropDown2(false);
      if (dropDown1 == true) {
        setDropDown1(false);
        setDropDown2(true);
      }
    } else if (clickedValue == 'disable2') {
      setDropDown2(true);
      setDropDown1(false);
      if (dropDown2 == true) {
        setDropDown1(true);
        setDropDown2(false);
      }
    } else {
      setDropDown1(false);
      setDropDown2(false);
    }
  };

  const onSpeechResults = (e) => {
    //Invoked when SpeechRecognizer is finished recognizing
    console.log('results ', e);

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
    //setPartialResults(e.value);
  };

  const startRecognizing = async (inputName) => {
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
    }
  };

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

  const dropdownRef = useRef();
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight =
    Platform.OS === 'ios' ? Dimensions.get('window').height + 70 : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT');

  const customRef = useRef({});
  return (
    <View style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -480 : StatusBar.currentHeight} // 50 is Button height
        enabled>
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={'always'}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <NavHeader size={22} bold={true} navigation={props.navigation} onBackFunc={() => props.navigation.goBack()} headerText={disputed.term} />
          </View>

          <View style={[Styles.rowText, {marginTop: 20}]}>
            <Text>
              <Text style={[Styles.rowDefinition, {color: '#003458'}]}>Definition: </Text>
              <Text style={Styles.TextMain1}>{disputed.term}</Text>
            </Text>
          </View>
          <View style={([Styles.rowText], {marginBottom: 7, width: '100%', paddingLeft: 10})}>
            <Text style={Styles.TextMain1}>
              <Text style={[Styles.rowDefinition, {color: '#003458'}]}>Deprecations reasons: </Text>
              <Text style={Styles.TextMain1}>{disputed.deprecatedReason}</Text>
            </Text>
          </View>

          <View
            style={
              ([Styles.rowText], {borderTopWidth: 1, borderTopColor: 'lightgrey', marginTop: 10, paddingTop: 10, width: '100%', paddingLeft: 10})
            }>
            <Text style={Styles.TextMain1}>
              <Text style={Styles.rowDefinition}>Dispute reason: </Text>
              <Text style={Styles.TextMain1}>{disputed.disputedReason}</Text>
            </Text>
          </View>

          <View style={Styles.rowText}>
            <Text style={Styles.TextMain1}>
              <Text style={Styles.rowDefinition}>Proposed definition for restored </Text>
              <Text style={Styles.TextMain1}>{disputed.newDefinition}</Text>
            </Text>
          </View>
          <View style={Styles.rowText}>
            <Text style={Styles.rowDefinition}>Disputed by </Text>
            <Text style={Styles.TextMain1}>{disputed.disputedBy}</Text>
          </View>

          <View style={{width: '100%', padding: 10, marginTop: 0}}>
            <Text
              style={{
                // margin: 15,
                fontSize: 14,
                padding: 5,
                color: '#fff',
                // fontWeight: 'bold',
                backgroundColor: 'green',
              }}>
              What action should be taken to address this disputes?
            </Text>
          </View>

          <View style={Styles.dropdownView}>
            <Text style={Styles.dropdownText}>Suggest an existing term for the needed concept</Text>
            <TouchableOpacity
              onPress={() => {
                handleChange('disable2');
              }}>
              {dropDown2 ? <AntDesignIcon name="caretup" size={25} /> : <AntDesignIcon name="caretdown" size={25} />}
            </TouchableOpacity>
          </View>

          {dropDown2 && (
            <View style={Styles.dropdownInner}>
              {
                <View style={Styles.mainView}>
                  {/* Another Existing Section */}
                  <Text style={Styles.otherText}>Other's decision : </Text>
                  {disputed.otherSolution && disputed.otherSolution.length != "" && disputed.qualitySuperclassExisting != null ? (
                    <View style={Styles.otherDecision}>
                      <Text style={Styles.TextMain}>
                        <Text style={Styles.otherText}>Quality : </Text>
                        <Text style={Styles.otherQuality}>{disputed.qualitySuperclassExisting}</Text>
                      </Text>
                    </View>
                  ) : null
                  }

                  {disputed.otherSolution && disputed.otherSolution.length != "" && disputed.structureSuperclassExisting != null ? (
                    <View style={Styles.otherDecision}>
                      <Text style={Styles.TextMain}>
                        <Text style={Styles.otherText}>Structure : </Text>
                        <Text style={Styles.otherQuality}>{disputed.structureSuperclassExisting}</Text>
                      </Text>
                    </View>
                  ) : null
                  }
                  <View style={{marginTop: 25}}></View>
                  <View style={Styles.radioContainer}>
                    <RadioButton.Android
                      value="Quality"
                      status={checked === 'Quality' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked('Quality');
                        setPickerStructure('');
                        setCharacterDefaultIndex(0);
                        //; dropdownRef.current.reset()
                      }}
                    />
                    <Text style={{margin: 8}}>Quality</Text>
                  </View>
                  <View style={Styles.radioContainer}>
                    <RadioButton.Android
                      value="Structure"
                      style={{
                        borderWidth: 2,
                        color: 'black',
                        backgroundColor: 'red',
                        borderRadius: 2,
                      }}
                      status={checked === 'Structure' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked('Structure');
                        setPickerStructure('');
                        setCharacterDefaultIndex(0);
                        console.log('@COMING HERE');
                      }}
                    />
                    <Text style={{margin: 8}}>Structure</Text>
                  </View>

                  {checked == 'Quality' ? (
                    <KeyboardAvoidingView behavior="padding">
                      <SearchableDropdown
                        onItemSelect={(item) => {
                          let newArr = [...optionIndexes];
                          newArr = [];
                          setOptionIndexes(newArr);
                          setPickerStructure(item.url);
                          console.log("exis ting quality ", pickerStructure);
                          setGroup(item.name);
                          setCharacterDefaultIndex(item.id - 1);
                        }}
                        onRemoveItem={(item) => {
                          setOptionIndexes([]);
                          setPickerStructure('');
                          setCharacterDefaultIndex(0);
                        }}
                        //  defaultIndex={2}
                        //defaultIndex={0}
                        defaultIndex={qualityDefalutExisting}
                        containerStyle={{padding: 5, width: '96%'}}
                        itemStyle={{
                          padding: 10,
                          marginTop: 2,
                          backgroundColor: '#ddd',
                          borderColor: '#bbb',
                          borderWidth: 1,
                          borderRadius: 5,
                        }}
                        itemTextStyle={{color: '#222'}}
                        itemsContainerStyle={{maxHeight: 140}}
                        //items={qualityItems}
                        items={quailtyData}
                        // defaultIndex={2}
                        resetValue={false}
                        textInputProps={{
                          placeholder: 'Enter a quality name ',
                          underlineColorAndroid: 'transparent',
                          style: {
                            padding: 12,
                            borderWidth: 1,
                            // borderColor: '#ccc',
                            borderRadius: 5,
                          },
                        }}
                        listProps={{nestedScrollEnabled: true}}
                      />
                    </KeyboardAvoidingView>
                  ) : checked == 'Structure' ? (
                    <SearchableDropdown
                      // ref={customRef}
                      onItemSelect={(item) => {
                        let newArr = [...optionIndexes];
                        newArr = [];
                        setOptionIndexes(newArr);
                        setPickerStructure(item.url);
                        setGroup(item.name);
                        setCharacterDefaultIndex(item.id - 1);
                      }}
                      onRemoveItem={(item) => {
                        setOptionIndexes([]);
                        setPickerStructure('');
                        setCharacterDefaultIndex(0);
                      }}
                      // defaultIndex={2}
                      defaultIndex={structureDefaultExisting}
                      containerStyle={{padding: 5, width: '96%'}}
                      itemStyle={{
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: '#ddd',
                        borderColor: '#bbb',
                        borderWidth: 1,
                        borderRadius: 5,
                      }}
                      itemTextStyle={{color: '#222'}}
                      itemsContainerStyle={{maxHeight: 140}}
                      // items={structureItems}
                      items={structureData}
                      // defaultIndex={2}
                      resetValue={false}
                      textInputProps={{
                        placeholder: 'Enter a structure term ',
                        underlineColorAndroid: 'transparent',
                        style: {
                          padding: 12,
                          borderWidth: 1,
                          // borderColor: '#ccc',
                          borderRadius: 5,
                        },
                      }}
                      listProps={{nestedScrollEnabled: true}}
                    />
                  )
                :null}
                </View>
              }
            </View>
          )}

          {/* //First DropDown With Speech Recognition */}
          <View style={Styles.dropdownView}>
            <Text style={Styles.dropdownText}>Add a new term to express the needed concept</Text>
            <TouchableOpacity
              onPress={() => {
                handleChange('disable');
              }}>
              {dropDown1 ? <AntDesignIcon name="caretup" size={25} /> : <AntDesignIcon name="caretdown" size={25} />}
            </TouchableOpacity>
          </View>
          {dropDown1 && (
            <View style={Styles.dropdownInner}>
              {
                <View style={Styles.mainView}>
                  {/* <View style={{padding: 10}}> */}
                  <Text style={Styles.otherText}>Other's decision :</Text>
                  <View style={Styles.otherDecision}>
                    <Text style={Styles.TextMain}>
                      <Text style={Styles.otherText}>Terms : </Text>
                      
                          <Text style={Styles.otherQuality}>
                            {disputed.otherNewTerm}
                            
                          </Text>
                    </Text>
                  </View>

                  { disputed.otherSolution && disputed.otherSolution.length != "" && disputed.qualitySuperclassNew != null ? (
                    <View style={Styles.otherDecision}>
                      <Text style={Styles.TextMain}>
                        <Text style={Styles.otherText}>Quality : </Text>
                        <Text style={Styles.otherQuality}>{disputed.qualitySuperclassNew}</Text>
                      </Text>
                    </View>
                  ) : null
                  }

                  {disputed.otherSolution && disputed.otherSolution.length != "" && disputed.structureSuperclassNew != null ? (
                    <View style={Styles.otherDecision}>
                      <Text style={Styles.TextMain}>
                        <Text style={Styles.otherText}>Structure : </Text>
                        <Text style={Styles.otherQuality}>{disputed.structureSuperclassNew}</Text>
                      </Text>
                    </View>
                  ) : null
                  }

                  <View style={{marginTop: 30}}></View>

                  <View style={Styles.inputView}>
                    <TextInput
                      placeholder="Enter the new item"
                      style={Styles.inputBoxView}
                      value={newTerm}
                      onChangeText={(text) => setNewTerm(text)}
                    />
                    <TouchableOpacity style={{position: 'absolute', left: '85%', top: '20%'}} onPress={() => start(1)}>
                      <FontAwesomeIcon icon={faMicrophone} size={25} color={activebtn == 1 && color ? 'green' : 'black'} />
                    </TouchableOpacity>
                  </View>

                  <View style={Styles.inputView}>
                    <TextInput
                      placeholder="Enter a definition"
                      style={Styles.inputBoxView}
                      value={newDefinition}
                      onChangeText={(text) => setNewDefinition(text)}
                    />

                    <TouchableOpacity style={{position: 'absolute', left: '85%', top: '20%'}} onPress={() => start(2)}>
                      <FontAwesomeIcon icon={faMicrophone} size={25} color={activebtn == 2 && color ? 'green' : 'black'} />
                    </TouchableOpacity>
                  </View>
                  {/* //Existing value Section */}
                  {/* <View style={{marginHorizontal: 30, 
                    width: '90%'}}> */}
                  <View style={Styles.radioContainer}>
                    <RadioButton.Android
                      value="Quality"
                      status={checked === 'Quality' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked('Quality');
                        setPickerStructure('');
                        setCharacterDefaultIndex(0);
                        //; dropdownRef.current.reset()
                      }}
                    />
                    <Text style={{margin: 8}}>Quality</Text>
                  </View>

                  <View style={Styles.radioContainer}>
                    <RadioButton.Android
                      value="Structure"
                      style={{
                        borderWidth: 2,
                        color: 'black',
                        backgroundColor: 'red',
                        borderRadius: 2,
                      }}
                      status={checked === 'Structure' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked('Structure');
                        setPickerStructure('');
                        setCharacterDefaultIndex(0);
                      }}
                    />
                    <Text style={{margin: 8}}>Structure</Text>
                  </View>

                  {/* </View> */}

                  {checked == 'Quality' ? (
                    <KeyboardAvoidingView behavior="padding">
                      <SearchableDropdown
                        onItemSelect={(item) => {
                          let newArr = [...optionIndexes];
                          newArr = [];

                          setOptionIndexes(newArr);
                          setPickerStructure(item.url);
                          setGroup(item.name);
                          setCharacterDefaultIndex(item.id - 1);
                        }}
                        onRemoveItem={(item) => {
                          setOptionIndexes([]);
                          setPickerStructure('');
                          setCharacterDefaultIndex(0);
                        }}
                        // defaultIndex={2}
                        containerStyle={{padding: 5, width: '96%'}}
                        itemStyle={{
                          padding: 10,
                          marginTop: 2,
                          backgroundColor: '#ddd',
                          borderColor: '#bbb',
                          borderWidth: 1,
                          borderRadius: 5,
                        }}
                        defaultIndex={qualityDefault}
                        itemTextStyle={{color: '#222'}}
                        itemsContainerStyle={{maxHeight: 140}}
                        //items={qualityItems}
                        items={quailtyData}
                        resetValue={false}
                        textInputProps={{
                          placeholder: 'Enter a quality term ',
                          underlineColorAndroid: 'transparent',
                          style: {
                            padding: 12,
                            borderWidth: 1,
                            // borderColor: '#ccc',
                            borderRadius: 5,
                          },
                        }}
                        listProps={{nestedScrollEnabled: true}}
                      />
                    </KeyboardAvoidingView>
                  ) : (
                    <SearchableDropdown
                      onItemSelect={(item) => {
                        let newArr = [...optionIndexes];
                        newArr = [];
                        setOptionIndexes(newArr);
                        setPickerStructure(item.url);
                        setGroup(item.name);
                        setCharacterDefaultIndex(item.id - 1);
                      }}
                      onRemoveItem={(item) => {
                        setOptionIndexes([]);
                        setPickerStructure('');
                        setCharacterDefaultIndex(0);
                      }}
                      // defaultIndex={2}
                      containerStyle={{padding: 5, width: '96%'}}
                      itemStyle={{
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: '#ddd',
                        borderColor: '#bbb',
                        borderWidth: 1,
                        borderRadius: 5,
                      }}
                      itemTextStyle={{color: '#222'}}
                      itemsContainerStyle={{maxHeight: 140}}
                      items={structureData}
                      defaultIndex={structureDefault}
                      resetValue={false}
                      textInputProps={{
                        placeholder: 'Enter a structure term ',
                        underlineColorAndroid: 'transparent',
                        style: {
                          padding: 12,
                          borderWidth: 1,
                          // borderColor: '#ccc',
                          borderRadius: 5,
                        },
                      }}
                      listProps={{nestedScrollEnabled: true}}
                    />
                  )}
                  {/* </View> */}

                  {/* Second input and mic field */}
                  <View style={Styles.inputView}>
                    <TextInput
                      placeholder="Enter an example sentence"
                      style={Styles.inputBoxView}
                      value={input3}
                      // onChangeText={input3}
                      onChangeText={(text) => setinput3(text)}
                    />

                    <TouchableOpacity style={{position: 'absolute', left: '85%', top: '20%'}} onPress={() => start(3)}>
                      <FontAwesomeIcon icon={faMicrophone} size={25} color={activebtn == 3 && color ? 'green' : 'black'} />
                    </TouchableOpacity>
                  </View>
                  <View style={Styles.inputView}>
                    <TextInput
                      placeholder="Enter applicable taxa"
                      style={Styles.inputBoxView}
                      value={input4}
                      onChangeText={(text) => setinput4(text)}
                    />
                    <TouchableOpacity style={{position: 'absolute', left: '85%', top: '20%'}} onPress={() => start(4)}>
                      <FontAwesomeIcon icon={faMicrophone} size={25} color={activebtn == 4 && color ? 'green' : 'black'} />
                    </TouchableOpacity>
                  </View>
                </View>
              }
            </View>
          )}

          <View style={{margin: 10}}></View>

          <View style={Styles.mainView}>
            <View style={{marginHorizontal: 10}}>
              <TextInput
                placeholder="Enter or record comment"
                style={{
                  backgroundColor: '#e8e8e8',
                  width: '95%',
                  height: 40,
                  borderRadius: 50,
                  paddingLeft: 20,
                  borderWidth: 1,
                }}
                value={input5}
                onChangeText={(text) => setinput5(text)}
              />
              <TouchableOpacity style={{position: 'absolute', left: '85%', top: '14%'}} onPress={() => start(5)}>
                <FontAwesomeIcon icon={faMicrophone} size={25} color={activebtn == 5 && color ? 'green' : 'black'} />
              </TouchableOpacity>
            </View>
            <View style={{borderWidth: 1, borderRadius: 4, width: 140, justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
              <TouchableOpacity onPress={() => setCommentsModal(true)}>
                <Text style={{padding: 3}}>Other's comments</Text>
              </TouchableOpacity>
            </View>

            <PrimaryButton
              enable={dropDown1 ? newTerm != '' && newDefinition != '' && pickerStructure != '' : pickerStructure != ''}
              buttonText={'Submit'}
              onPressFunc={submitData}
              marginLeft={20}
              marginRight={20}
              marginBottom={15}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <PopupAlert
        popupTitle="Message"
        message={message}
        isVisible={errorInfoModal}
        handleOK={() => {
          setErrorInfoModal(false);
        }}
      />
      <PopupAlert
        popupTitle="Message"
        message={'Submitted successfully'}
        isVisible={warningModal}
        handleOK={() => {
          setWarningModal(false);
          props.navigation.goBack();
        }}
      />

      <PopupConfirm
        popupTitle="Are you sure to submit?"
        stateMessage={stateMessage}
        message={'You will not be able to change this decision after submit.'}
        isVisible={confirmModal}
        handleYes={() => {
          setConfirmModal(false);
          submitNewTerm();
        }}
        handleCancel={() => {
          setConfirmModal(false);
        }}
      />
      <CommentsModal
        popupTitle="Other's comments"
        comments={disputed.otherSolution}
        term={disputed.term}
        isVisible={commentsModal}
        handleYes={() => {
          setCommentsModal(false);
        }}
        handleCancel={() => {
          setCommentsModal(false);
        }}
      />

      {/* </KeyboardAwareScrollView> */}
    </View>
  );
}

const Styles = StyleSheet.create({
  rowText: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 10,
  },
  rowDefinition: {
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'auto',
  },
  TextMain: {
    fontSize: 14,
    flex: 1,
    marginTop:5,
  },
  TextMain1: {
    fontSize: 14,
    flex: 1,
  },
  button: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#544ea3',
    padding: 5,
    borderRadius: 50,
    margin: 10,
  },
  radioButton: {
    borderColor: '#aaa',
    borderWidth: 2,
    borderRadius: 20,
  },
  dropdown1BtnStyle: {
    width: '70%',
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    // marginHorizontal:30,
  },
  inputView: {
    flexDirection: 'row',
    //marginLeft: 30,
    marginHorizontal: 10,
    marginTop: 10,
    width: '95%',
  },
  inputBoxView: {
    width: '95%',
    borderWidth: 1,
    height: 40,
    paddingLeft: 10,
    color: 'black',
  },
  otherDecision: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
    flexWrap: 'wrap',
    width: '92%',
    marginHorizontal: 10,
    // fontSize: 12,
    // backgroundColor:'red'
  },
  otherView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
    width: '90%',
    flexWrap: 'wrap',
  },
  otherView: {
    fontWeight: 'bold',
    alignSelf: 'auto',
  },
  otherText: {
    alignSelf: 'auto',
    fontSize: 12,
    marginBottom:5,
    marginTop:5,
  },
  otherQuality: {
    // width: '50%',
    // alignSelf: 'auto',
    fontSize: 12,
    marginBottom:10,
  },
  dropdownView: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    paddingLeft: 10,
    marginTop: 10,
  },
  dropdownText: {
    fontSize: 14,
    width: '100%',
  },
  dropdownInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mainView: {
    marginHorizontal: 30,
    width: '90%',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
});
