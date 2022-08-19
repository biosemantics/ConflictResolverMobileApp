import React, { useState, useEffect } from 'react';

import { Dimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';

import NavTabs from '../../components/NavTabs';

import Home from './Home';
import Task from './Task';


import api from '../../api/tasks';
import { set_disputed_options, set_tasks } from '../../store/actions'
import { set_quality } from '../../store/actions'
import { set_structure } from '../../store/actions'

import { useDispatch, useSelector } from 'react-redux';

import { withNavigationFocus } from 'react-navigation';

const getStructure = (data, structures, index) => {
    structures.push({
        id: index,
        url:data.data.details[0].IRI,
        name: data.text
    });
    if (data.children){
        data.children.map(child => {
            index = getStructure(child, structures, ++index);
        })
    }
    return index;
}
  
const getQuality = (data, qualities, index) => {
    qualities.push({
        id: index,
        url:data.data.details[0].IRI,
        name: data.text
    });
    if (data.children){
        data.children.map(child => {
            index = getQuality(child, qualities, ++index);
        })
    }
    return index;
}

const HomeLayout = (props) => {
    const [tabID, setTabID] = useState(0);
    const auth = useSelector(state => state.main.auth);
    const [completedCount, setCompletedCount] = useState(0);
    const dispatch = useDispatch();

    const [qualityItems, setQualityItems] = useState([]);

    const deviceHeight = Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

    const onChangTab = (id) => {
       
        if (id == 0) {
            api.getCount(auth.expertId).then(result=>{
                if (result.data.count != completedCount) {
                    setCompletedCount(result.data.count);
                }
                setTabID(id);
            })
        }
        else if (id == 1){
            api.getTasks(auth.expertId).then(result=>{
                dispatch(set_tasks(result.data.task_data));
                setTabID(id);
            });
            api.getDisputed(auth.expertId).then(result=>{
                dispatch(set_disputed_options(result.data));
                setTabID(id);
            });
        }
    }
    const [message, setMessage] = useState('');
    const [errorInfoModal, setErrorInfoModal] = useState(false);

    

    useEffect(() => {
        // const focusListener = props.navigation.addListener('didFocus', () => {
        //     console.log("Focused", props.navigation.isFocused());

        //     console.log("useEffect call");
        api.getCount(auth.expertId).then(result=>{
            if (result.data.count != completedCount) {
                console.log("completed task ",result.data.count );
                setCompletedCount(result.data.count);
            }
        });
        api.getTasks(auth.expertId).then(result=>{
            dispatch(set_tasks(result.data.task_data));
        });
        api.getDisputed(auth.expertId).then(result=>{
            dispatch(set_disputed_options(result.data));
        });
        api.getStructure().then(result => {
            let structures = [];
            structures.push({
                id: 1,
                url: "",
                name: ""
            });
            getStructure(result.data, structures, 2);
            dispatch(set_structure(structures));
        });
        api.getQuality().then(result => {
            let qualities = [];
            qualities.push({
                id: 1,
                url: "",
                name: ""
            });
            getQuality(result.data, qualities, 2);
            dispatch(set_quality(qualities));
        });

    // });
    // return () => {
    //   // clean up event listener
    //   focusListener.remove();
    // };
    }, []);

    const renderContent =  () => {
      if(tabID == 0)
      {
          return (
            <Home navigation={props.navigation} completedCount={completedCount}/>
          );
      } 
      else if (tabID == 1){
          return (
            <Task navigation={props.navigation}/>
          );
      }
    }
    return (
      <View style={styles.container}>
        
      
        <View style={{height: 112, display: 'flex', justifyContent: 'center', zIndex: 99999}}>
          <NavTabs active={tabID} changeFunc={onChangTab} navigation={props.navigation} />
        </View>
        <ScrollView nestedScrollEnabled={true}>
          <View style={{marginTop: 18, width: '100%', height: deviceHeight - 220}}>{renderContent()}</View>
        </ScrollView>
        <PopupAlert
          popupTitle="Error"
          message={message}
          isVisible={errorInfoModal}
          handleOK={() => {
            setErrorInfoModal(false);
          }}
        />
      </View>
    );
}

export default HomeLayout

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#fff'
    },
    text: {
        marginTop: 30,
        marginBottom: 15,
        color: "#003458",
        fontSize: 30,
        textAlign: 'center',
    },
};