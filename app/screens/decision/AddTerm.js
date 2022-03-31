import React, {useState, useEffect, Component, Fragment} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView} from 'react-native';
import Modal from 'react-native-modal';
// import {Picker} from '@react-native-community/picker';
import SelectDropdown from 'react-native-select-dropdown';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Voice from '@react-native-community/voice';
import {faAngleLeft, faL, faMicrophone, faMinus, faPlus, faPlusCircle, faRemove} from '@fortawesome/free-solid-svg-icons';

import {useDispatch, useSelector} from 'react-redux';

import NavHeader from '../../components/NavHeader';
import PrimaryButton from '../../components/PrimaryButton';
import PopupConfirm from '../../components/PopupConfirm';
import CommentsModal from '../../components/CommentsModal';
import DeclineModal from '../../components/DeclineModal';
//import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SearchableDropdown from 'react-native-searchable-dropdown';

import api from '../../api/tasks';
import {set_addTerm_options} from '../../store/actions';
import {set_tasks} from '../../store/actions';

export default Category = (props) => {
  const [task, setTask] = useState(props.navigation.getParam('task', {}));

  const [confirmModal, setConfirmModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const [termType, setTermType] = useState('');
  const [group, setGroup] = useState('');
  const [subclassOf, setSubClassOf] = useState('');
  const [alwaysPartOf, setAlwaysPartOf] = useState([]);
  const [alwaysHasPart, setAlwaysHasPart] = useState([]);
  const [maybePartOf, setMaybePartOf] = useState([]);
  const [subPart, setSubPart] = useState([]);
  const [superPart, setSuperPart] = useState([]);
  const [isSuper, setIsSuper] = useState(false);
  const [synonym, setSynonym] = useState('');
  const [synonyms, setSynonyms] = useState([]);
  const [stateMessage, setStateMessage] = useState('');
  const [comment, setComment] = useState('');
  const [characterDefaultIndex, setCharacterDefaultIndex] = useState(0);
  const [subclassDefaultIndex, setSubclassDefaultIndex] = useState(0);
  const [commentsModal, setCommentsModal] = useState(false);

  const auth = useSelector((state) => state.main.auth);
  const options = useSelector((state) => state.main.data.addTermOptions);
  const quailtyData = useSelector((state) => state.main.metaData.quality);
  const structureData = useSelector((state) => state.main.metaData.structure);

  const dispatch = useDispatch();

  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight =
    Platform.OS === 'ios' ? Dimensions.get('window').height : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT');

  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

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

  const start = (inputName) => {
    startRecognizing(inputName);
  };
  const onSpeechStart = (e) => {
    //Invoked when .start() is called without error
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
    setComment(msg);
  };

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

  const startRecognizing = async (inputName) => {
    //Starts listening for speech for a specific locale
    console.log('start recogniztion part');

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

  const getTerm = () => {
    api.getAddTermOptions(task.termId, auth.expertId).then((result) => {
      if (result.data.curComment != '') {
        setComment(result.data.curComment);
      }
      if (result.data.synonyms && result.data.synonyms.length > 0) {
        setSynonyms(result.data.synonyms);
      }
      if (result.data.curType === 'Character') {
        if (result.data.curCharacter != '') {
          const newCharacterIndex = quailtyData.find((it) => it.name === result.data.curCharacter).id - 1;
          setGroup(result.data.curCharacter);
          setCharacterDefaultIndex(newCharacterIndex);
        }
        setTermType('Character');
      } else if (result.data.curType === 'Structure') {
        if (result.data.curSubclassOf != '') {
          const newSubclassOfIndex = structureData.find((it) => it.name === result.data.curSubclassOf).id - 1;
          setSubClassOf(result.data.curSubclassOf);
          setSubclassDefaultIndex(newSubclassOfIndex);
        }
        if (result.data.curAlwaysPartOf.length > 0) {
          result.data.curAlwaysPartOf.map((indCur, index) => {
            const newIndex = structureData.find((it) => it.name === indCur).id;
            alwaysPartOf.push({name: indCur, id: newIndex});
            setAlwaysPartOf(alwaysPartOf);
          });
        }
        if (result.data.curAlwaysHasPart.length > 0) {
          result.data.curAlwaysHasPart.map((indCur, index) => {
            const newIndex = structureData.find((it) => it.name === indCur).id;
            alwaysHasPart.push({name: indCur, id: newIndex});
            setAlwaysHasPart(alwaysHasPart);
          });
        }
        if (result.data.curMaybePartOf.length > 0) {
          result.data.curMaybePartOf.map((indCur, index) => {
            const newIndex = structureData.find((it) => it.name === indCur).id;
            maybePartOf.push({name: indCur, id: newIndex});
            setMaybePartOf(maybePartOf);
          });
        }
        if (result.data.curSubPart.length > 0) {
          result.data.curSubPart.map((indCur, index) => {
            const newIndex = structureData.find((it) => it.name === indCur).id;
            subPart.push({name: indCur, id: newIndex});
            setSubPart(subPart);
          });
        }
        if (result.data.curSuperPart.length > 0) {
          result.data.curSuperPart.map((indCur, index) => {
            const newIndex = structureData.find((it) => it.name === indCur).id;
            superPart.push({name: indCur, id: newIndex});
            setSuperPart(superPart);
          });
        }
        setTermType('Structure');
      } else {
        setTermType('Character');
      }

      dispatch(set_addTerm_options(result.data));
    });
  };

  useEffect(() => {
    getTerm();
  }, []);

  const onSubmit = () => {
    var messageVal = task.term + ' is a ' + termType;
    if (termType === 'Character') {
      messageVal += ', belongs to ' + group;
    } else {
      messageVal += ', subclass of ' + subclassOf;
      if (alwaysPartOf.length > 0) {
        var firflg = 0;
        messageVal += ', always part of ';
        alwaysPartOf.map((ap) => {
          if (firflg != 0) {
            messageVal += ', ';
          }
          firflg = 1;
          messageVal += ap.name;
        });
      }
      if (alwaysHasPart.length > 0) {
        var firflg = 0;
        messageVal += ', always has part ';
        alwaysHasPart.map((ap) => {
          if (firflg != 0) {
            messageVal += ', ';
          }
          firflg = 1;
          messageVal += ap.name;
        });
      }
      if (maybePartOf.length > 0) {
        var firflg = 0;
        messageVal += ', may be part of ';
        maybePartOf.map((ap) => {
          if (firflg != 0) {
            messageVal += ', ';
          }
          firflg = 1;
          messageVal += ap.name;
        });
      }
      if (subPart.length > 0) {
        var firflg = 0;
        messageVal += ', has ';
        subPart.map((ap) => {
          if (firflg != 0) {
            messageVal += ', ';
          }
          firflg = 1;
          messageVal += ap.name;
        });
        messageVal += ' part';
      }
      if (superPart.length > 0) {
        var firflg = 0;
        messageVal += ', is part of ';
        superPart.map((ap) => {
          if (firflg != 0) {
            messageVal += ', ';
          }
          firflg = 1;
          messageVal += ap.name;
        });
      }
    }
    var ind = 0;
    if (synonyms.length > 0) {
      messageVal += ', has synonyms ';
      synonyms.map((sy) => {
        if (ind !== 0) {
          messageVal += ', ';
        }
        messageVal += sy.synonym;
        ind++;
      });
    }
    messageVal += '.';
    setStateMessage(messageVal);
    setConfirmModal(true);
  };

  const onDecline = () => {
    setDeclineModal(true);
  };

  const onConfirmSubmit = () => {
    var alwaysPartOfString = '';
    var alwaysHasPartString = '';
    var maybePartOfString = '';
    var subPartString = '';
    var superPartString = '';

    if (termType == 'Character') {
      subPartString = group;
    } else {
      if (alwaysHasPart.length > 0) {
        var firflg = 0;
        alwaysHasPart.map((ap) => {
          if (firflg != 0) {
            alwaysHasPartString += ',';
          }
          alwaysHasPartString += ap.name;
          firflg = 1;
        });
      }
      if (alwaysPartOf.length > 0) {
        var firflg = 0;
        alwaysPartOf.map((ap) => {
          if (firflg != 0) {
            alwaysPartOfString += ',';
          }
          alwaysPartOfString += ap.name;
          firflg = 1;
        });
      }
      if (maybePartOf.length > 0) {
        var firflg = 0;
        maybePartOf.map((ap) => {
          if (firflg != 0) {
            maybePartOfString += ',';
          }
          maybePartOfString += ap.name;
          firflg = 1;
        });
      }
      if (subPart.length > 0) {
        var firflg = 0;
        subPart.map((ap) => {
          if (firflg != 0) {
            subPartString += ',';
          }
          subPartString += ap.name;
          firflg = 1;
        });
      }
      if (superPart.length > 0) {
        var firflg = 0;
        superPart.map((ap) => {
          if (firflg != 0) {
            superPartString += ',';
          }
          superPartString += ap.name;
          firflg = 1;
        });
      }
    }

    api
      .solveAddTermConflict(
        task.termId,
        auth.expertId,
        termType,
        subPartString,
        superPartString,
        alwaysHasPartString,
        alwaysPartOfString,
        maybePartOfString,
        subclassOf,
        synonyms.map((sy) => sy.expertId),
        synonyms.map((sy) => sy.synonym),
        comment,
      )
      .then((result) => {
        if(result.success){
          api.getTasks(auth.expertId).then((result) => {
            dispatch(set_tasks(result.data.task_data));
            props.navigation.goBack();
          });
          console.log('success'); 
        }
        else{
          console.log(error);
        }
      });
  };

  const handleClickOtherComment = () => {
    setCommentsModal(true);
  };

  const category = ['Structure', 'Character'];

  return (
    <React.Fragment>
      <ScrollView
        contentContainerStyle={{backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'space-between'}}
        keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior="position">
          <NavHeader
            headerText={task.term}
            size={22}
            bold={true}
            letterSpacing={1.6}
            navigation={props.navigation}
            onBackFunc={() => {
              api.getTasks(auth.expertId).then((result) => {
                dispatch(set_tasks(result.data.task_data));
                props.navigation.goBack();
              });
            }}
          />
          <View style={{alignContent: 'center', alignItems: 'center', width: '100%', padding: 10}}>
            {options && options.termDeclined && (
              <Text style={{...styles.senctence, fontSize: 14, color: 'red', fontWeight: 'bold'}}>You declined the term.</Text>
            )}
          </View>
          <ScrollView
            contentContainerStyle={{padding: 10, paddingTop: 3}}
            style={{height: deviceHeight - 270}}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled">
            <Text style={{...styles.sentence, color: '#003458'}}>Term definition:</Text>
            <Text style={{marginLeft: 15}}>{task.data.replace(/"/g, '')}</Text>
            <Text style={{...styles.sentence, color: '#003458'}}>Example sentences:</Text>
            {options &&
              options.sentence &&
              options.sentence.map((item, index) => (
                <Text key={'sentence' + index} style={{marginLeft: 15}}>
                  {index + 1}. "{item.sentence}"
                </Text>
              ))}
            {options && options.sentence && options.sentence.length == 0 && <Text style={{marginLeft: 15}}> Example sentences not available </Text>}
            <View style={{borderTopWidth: 1, borderTopColor: 'lightgrey', marginTop: 15, paddingTop: 15}}>
              <View style={{alignContent: 'center', alignItems: 'center', width: '100%', backgroundColor: 'green'}}>
                <Text style={{...styles.sentence, color: '#fff', marginLeft: 10}}>
                  Use example senctences and the definition to help answer questions below:
                </Text>
              </View>
            </View>
            <View style={{padding: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{color: 'black', width: '45%'}}>
                  Is {task.term} a structure or a character?
                  {options && options.characterCount > 0 && <Text style={{color: 'black'}}> Character({options.characterCount})</Text>}
                  {options && options.structureCount > 0 && <Text style={{color: 'black'}}> Structure({options.structureCount})</Text>}
                </Text>
                <View style={{borderWidth: 1, width: '60%'}}>
                  <SelectDropdown
                    data={category}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem, index);
                      setTermType(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                    dropdownStyle={styles.dropdown1DropdownStyle}
                    buttonStyle={styles.dropdown2BtnStyle}
                  />
                </View>
              </View>
              {termType == 'Character' && (
                <View>
                  <Text style={{color: 'black'}}>Select a group that {task.term} belong:</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: 'black'}}> Other's decisions: </Text>
                    {options &&
                      options.characterSubpartData &&
                      options.characterSubpartData.length > 0 &&
                      options.characterSubpartData.map((subpart, index) => (
                        <Text style={{color: 'black'}} key={'characterSubPart' + index}>
                          {' '}
                          {subpart.name}({subpart.count}){' '}
                        </Text>
                      ))}
                  </View>
                  <View style={{borderWidth: 0}}>
                    <SearchableDropdown
                      onItemSelect={(item) => {
                        setGroup(item.name);
                        setCharacterDefaultIndex(item.id - 1);
                      }}
                      itemValue={group}
                      containerStyle={{padding: 5, width: '100%'}}
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
                      items={quailtyData}
                      defaultIndex={characterDefaultIndex}
                      resetValue={false}
                      textInputProps={{
                        placeholder: 'Enter a quality name ',
                        underlineColorAndroid: 'transparent',
                        style: {
                          padding: 12,
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 5,
                        },
                      }}
                      listProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                </View>
              )}
              {termType == 'Structure' && (
                <View>
                  <Text style={{color: 'black'}}>Select a structure that has {task.term} as a subclass.</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: 'black'}}> Other's decisions: </Text>
                    {options &&
                      options.subclassOfData &&
                      options.subclassOfData.length > 0 &&
                      options.subclassOfData.map((ind, index) => (
                        <Text style={{color: 'black'}} key={'subclassof' + index}>
                          {' '}
                          {ind.name}({ind.count}){' '}
                        </Text>
                      ))}
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <SearchableDropdown
                      onItemSelect={(item) => {
                        setSubClassOf(item.name);
                        setSubclassDefaultIndex(item.id - 1);
                      }}
                      containerStyle={{padding: 5, width: '100%'}}
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
                      defaultIndex={subclassDefaultIndex}
                      resetValue={false}
                      textInputProps={{
                        placeholder: 'Enter a structure name ',
                        underlineColorAndroid: 'transparent',
                        style: {
                          padding: 12,
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 5,
                        },
                      }}
                      listProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                  <Text style={{color: 'black'}}>Fill in the blanks below if applicable.</Text>

                  <View style={{marginBottom: 10, borderBottomWidth: 1, borderColor: 'grey', paddingBottom: 5}}>
                    <View style={{alignItems: 'center'}}>
                      <View style={{width: '70%'}}>
                        <SearchableDropdown
                          multi={true}
                          selectedItems={alwaysPartOf}
                          onItemSelect={(item) => {
                            setAlwaysPartOf([...alwaysPartOf, item]);
                          }}
                          containerStyle={{padding: 5, width: '100%'}}
                          onRemoveItem={(item, index) => {
                            const items = alwaysPartOf.filter((sitem) => sitem.id !== item.id);
                            setAlwaysPartOf(items);
                          }}
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
                          defaultIndex={0}
                          chip={true}
                          resetValue={false}
                          textInputProps={{
                            placeholder: 'Enter structure name ',
                            underlineColorAndroid: 'transparent',
                            style: {
                              padding: 12,
                              borderWidth: 1,
                              borderColor: '#ccc',
                              borderRadius: 5,
                            },
                          }}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
                      <View style={{width: '70%'}}>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: '900'}}>always has part of {task.term}.</Text>
                      </View>
                    </View>
                    <View style={{textAlign: 'left'}}>
                      <View style={{width: '100%', marginLeft: 5, flexDirection: 'row'}}>
                        <Text style={{color: 'black'}}> Other's decisions: </Text>
                        {options &&
                          options.alwaysPartOfData &&
                          options.alwaysPartOfData.length > 0 &&
                          options.alwaysPartOfData.map((ind, index) => (
                            <Text style={{color: 'black', marginLeft: 5}} key={'alwaysPartOf' + index}>
                              {' '}
                              {ind.name}({ind.count}){' '}
                            </Text>
                          ))}
                      </View>
                    </View>
                  </View>

                  <View style={{marginBottom: 10, borderBottomWidth: 1, borderColor: 'grey', paddingBottom: 5}}>
                    <View style={{alignItems: 'center'}}>
                      <View style={{width: '70%'}}>
                        <SearchableDropdown
                          multi={true}
                          selectedItems={alwaysHasPart}
                          onItemSelect={(item) => {
                            setAlwaysHasPart([...alwaysHasPart, item]);
                          }}
                          containerStyle={{padding: 5, width: '100%'}}
                          onRemoveItem={(item, index) => {
                            const items = alwaysHasPart.filter((sitem) => sitem.id !== item.id);
                            setAlwaysHasPart(items);
                          }}
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
                          defaultIndex={0}
                          chip={true}
                          resetValue={false}
                          textInputProps={{
                            placeholder: 'Enter structure name ',
                            underlineColorAndroid: 'transparent',
                            style: {
                              padding: 12,
                              borderWidth: 1,
                              borderColor: '#ccc',
                              borderRadius: 5,
                            },
                          }}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
                      <View style={{width: '70%'}}>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: '900'}}>is always part of {task.term}.</Text>
                      </View>
                    </View>
                    <View style={{textAlign: 'left'}}>
                      <View style={{width: '100%', marginLeft: 5, flexDirection: 'row'}}>
                        <Text style={{color: 'black'}}> Other's decisions: </Text>
                        {options &&
                          options.alwaysHasPartData &&
                          options.alwaysHasPartData.length > 0 &&
                          options.alwaysHasPartData.map((ind, index) => (
                            <Text style={{color: 'black', marginLeft: 5}} key={'alwaysHasPart' + index}>
                              {' '}
                              {ind.name}({ind.count}){' '}
                            </Text>
                          ))}
                      </View>
                    </View>
                  </View>

                  <View style={{marginBottom: 10, borderBottomWidth: 1, borderColor: 'grey', paddingBottom: 5}}>
                    <View style={{alignItems: 'center'}}>
                      <View style={{width: '70%'}}>
                        <SearchableDropdown
                          multi={true}
                          selectedItems={maybePartOf}
                          onItemSelect={(item) => {
                            setMaybePartOf([...maybePartOf, item]);
                          }}
                          containerStyle={{padding: 5, width: '100%'}}
                          onRemoveItem={(item, index) => {
                            const items = maybePartOf.filter((sitem) => sitem.id !== item.id);
                            setMaybePartOf(items);
                          }}
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
                          defaultIndex={0}
                          chip={true}
                          resetValue={false}
                          textInputProps={{
                            placeholder: 'Enter structure name ',
                            underlineColorAndroid: 'transparent',
                            style: {
                              padding: 12,
                              borderWidth: 1,
                              borderColor: '#ccc',
                              borderRadius: 5,
                            },
                          }}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
                      <View style={{width: '70%'}}>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: '900'}}>may have part {task.term}.</Text>
                      </View>
                    </View>
                    <View>
                      <View style={{width: '100%', marginLeft: 5, flexDirection: 'row'}}>
                        <Text style={{color: 'black'}}> Other's decisions: </Text>
                        {options &&
                          options.maybePartOfData &&
                          options.maybePartOfData.length > 0 &&
                          options.maybePartOfData.map((ind, index) => (
                            <Text style={{color: 'black', marginLeft: 5}} key={'maybePartOf' + index}>
                              {' '}
                              {ind.name}({ind.count}){' '}
                            </Text>
                          ))}
                      </View>
                    </View>
                  </View>

                  <View style={{marginBottom: 10, borderBottomWidth: 1, borderColor: 'grey', paddingBottom: 5}}>
                    <View style={{alignItems: 'center'}}>
                      <View style={{width: '70%'}}>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: '900'}}>{task.term} always has part</Text>
                      </View>
                      <View style={{width: '70%'}}>
                        <SearchableDropdown
                          multi={true}
                          selectedItems={subPart}
                          onItemSelect={(item) => {
                            setSubPart([...subPart, item]);
                          }}
                          containerStyle={{padding: 5, width: '100%'}}
                          onRemoveItem={(item, index) => {
                            const items = subPart.filter((sitem) => sitem.id !== item.id);
                            setSubPart(items);
                          }}
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
                          defaultIndex={0}
                          chip={true}
                          resetValue={false}
                          textInputProps={{
                            placeholder: 'Enter structure name ',
                            underlineColorAndroid: 'transparent',
                            style: {
                              padding: 12,
                              borderWidth: 1,
                              borderColor: '#ccc',
                              borderRadius: 5,
                            },
                          }}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
                    </View>
                    <View>
                      <View style={{width: '100%', marginLeft: 5, flexDirection: 'row'}}>
                        <Text style={{color: 'black'}}> Other's decisions: </Text>
                        {options &&
                          options.subpartData &&
                          options.subpartData.length > 0 &&
                          options.subpartData.map((ind, index) => (
                            <Text style={{color: 'black', marginLeft: 5}} key={'subpart' + index}>
                              {' '}
                              {ind.name}({ind.count}){' '}
                            </Text>
                          ))}
                      </View>
                    </View>
                  </View>

                  <View style={{marginBottom: 10, borderBottomWidth: 1, borderColor: 'grey', paddingBottom: 5}}>
                    <View style={{alignItems: 'center'}}>
                      <View style={{width: '70%'}}>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: '900'}}>{task.term} is always part of</Text>
                      </View>
                      <View style={{width: '70%'}}>
                        <SearchableDropdown
                          multi={true}
                          selectedItems={superPart}
                          onItemSelect={(item) => {
                            setSuperPart([...superPart, item]);
                          }}
                          containerStyle={{padding: 5, width: '100%'}}
                          onRemoveItem={(item, index) => {
                            const items = superPart.filter((sitem) => sitem.id !== item.id);
                            setSuperPart(items);
                          }}
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
                          defaultIndex={0}
                          chip={true}
                          resetValue={false}
                          textInputProps={{
                            placeholder: 'Enter structure name ',
                            underlineColorAndroid: 'transparent',
                            style: {
                              padding: 12,
                              borderWidth: 1,
                              borderColor: '#ccc',
                              borderRadius: 5,
                            },
                          }}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
                    </View>
                    <View>
                      <View style={{width: '100%', marginLeft: 5, flexDirection: 'row'}}>
                        <Text style={{color: 'black'}}> Other's decisions: </Text>
                        {options &&
                          options.superpartData &&
                          options.superpartData.length > 0 &&
                          options.superpartData.map((ind, index) => (
                            <Text style={{color: 'black', marginLeft: 5}} key={'superpart' + index}>
                              {' '}
                              {ind.name}({ind.count}){' '}
                            </Text>
                          ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}
              {
                <View>
                  <View style={{...styles.inputContainer, marginTop: 15}}>
                    <TextInput
                      placeholder={'Enter a term exchangable with ' + task.term}
                      style={{color: '#003458', width: '75%', marginLeft: 5}}
                      onChangeText={(txt) => {
                        setSynonym(txt);
                      }}>
                      {synonym}
                    </TextInput>
                    <TouchableOpacity
                      disabled={synonym == ''}
                      style={{...styles.button, backgroundColor: synonym == '' ? 'grey' : '#003458'}}
                      onPress={() => {
                        setSynonyms([...synonyms, {synonym: synonym, expertId: auth.expertId}]);
                        setSynonym('');
                      }}>
                      <FontAwesomeIcon icon={faPlus} size={25} color={'white'} />
                    </TouchableOpacity>
                  </View>
                  <Text style={{color: 'black', marginTop: 5}}>List terms that are exchangable with {task.term}.</Text>
                  <View style={{marginHorizontal: 10, borderWidth: 1, minHeight: 50, paddingHorizontal: 1}}>
                    {synonyms.map(
                      (sy, index) =>
                        sy.expertId === auth.expertId && (
                          <View key={'synonym' + index} style={{...styles.synonym, backgroundColor: index % 2 ? 'lightcyan' : 'rgb(200,224,240)'}}>
                            <Text>{sy.synonym}</Text>
                            <TouchableOpacity
                              style={{...styles.button, width: 26, height: 26, backgroundColor: 'red'}}
                              onPress={() => {
                                setSynonyms(synonyms.filter((it) => it != sy));
                              }}>
                              <FontAwesomeIcon icon={faRemove} size={16} color={'white'} />
                            </TouchableOpacity>
                          </View>
                        ),
                    )}
                  </View>
                  <Text style={{color: 'black', marginTop: 5}}>Other's synonyms</Text>
                  <View style={{marginHorizontal: 10, borderWidth: 1, minHeight: 50, paddingHorizontal: 1}}>
                    {synonyms.map(
                      (sy, index) =>
                        sy.expertId !== auth.expertId && (
                          <View key={'synonym' + index} style={{...styles.synonym, backgroundColor: index % 2 ? 'lightcyan' : 'rgb(200,224,240)'}}>
                            <Text>{sy.synonym}</Text>
                          </View>
                        ),
                    )}
                  </View>
                </View>
              }
            </View>
            <View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter or record comment"
                  style={{color: '#003458', width: '100%', paddingLeft: 10, paddingRight: 10, marginLeft: 5, height: 50}}
                  onChangeText={(txt) => {
                    setComment(txt);
                  }}>
                  {comment}
                </TextInput>
                <TouchableOpacity style={{position: 'absolute', left: '90%', top: '20%'}} onPress={() => start(1)}>
                  <FontAwesomeIcon icon={faMicrophone} size={25} color={'#000'} />
                </TouchableOpacity>
              </View>
              <View style={{borderWidth: 1, borderRadius: 4, width: 140, justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                <TouchableOpacity onPress={handleClickOtherComment}>
                  <Text style={{padding: 3}}>Other's comments</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <PrimaryButton
            enable={(termType == 'Character' && group != '') || (termType == 'Structure' && subclassOf != '')}
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
            bgColor={'#F4463A'}
            borderColor={'#F4463A'}
          />

          <PopupConfirm
            popupTitle="Are you sure to submit?"
            stateMessage={stateMessage}
            message={'You will not be able to change this decision after submit.'}
            isVisible={confirmModal}
            handleYes={() => {
              setConfirmModal(false);
              onConfirmSubmit();
            }}
            handleCancel={() => {
              setConfirmModal(false);
            }}
          />

          <CommentsModal
            popupTitle="Other's comments"
            comments={options.comments}
            term={task.term}
            isVisible={commentsModal}
            handleYes={() => {
              setCommentsModal(false);
            }}
            handleCancel={() => {
              setCommentsModal(false);
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <DeclineModal
        popupTitle="Are you sure to deline the term?"
        message={'You will not be able to change this decision after decline.'}
        isVisible={declineModal}
        task={task}
        handleYes={() => {
          setDeclineModal(false);
          api.getTasks(auth.expertId).then((result) => {
            dispatch(set_tasks(result.data.task_data));
            setTimeout(() => {
              props.navigation.goBack();
            }, 100);
          });
        }}
        handleCancel={() => {
          setDeclineModal(false);
        }}
      />
    </React.Fragment>
  );
};

const styles = {
  senctence: {
    textAlign: 'left',
    fontSize: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
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
    padding: 5,
    width: 35,
    height: 35,
    alignItems: 'center',
    alignContent: 'center',
  },
  modalContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  synonym: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    width: '100%',
    padding: 5,
    marginRight: 5,
  },
  dropdown1DropdownStyle: {
    width: 150,
    color: '#fff',
  },
  dropdown2BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
};
