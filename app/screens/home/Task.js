import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, FlatList} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';

export default Tasks = (props) => {
    const auth = useSelector(state => state.main.auth);
    const tasks = useSelector(state => state.main.data.tasks);
    
    const [isUnCategory, setIsUnCategory] = useState(true);
    const [approveDefinition, setApproveDefinition] = useState(false);
    const [addTermDefinition, setAddTermDefinition] = useState(false);
    const [exactSynonym, setExactSynonym] = useState(false);
    const [equivTerm, setEquivTerm] = useState(false);


    const onTask = (termId) => {
        const task = tasks.find(t => t.termId == termId)
        const url = {
            category: 'Category',
            synonym: 'Approve',
            addTerm: 'AddTerm',
            exact: 'ExactTerm',
            equiv: 'EquivTerm'
        }
        console.log(task);
        // if (!task.isSolved){
            props.navigation.navigate(url[task.type], {task});
        // }
    }
    return (
        <ScrollView style={{backgroundColor:'#ffffff'}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{fontSize: 18}}>
                        Find right category
                    </Text>
                    <TouchableOpacity onPress={()=>{setIsUnCategory(!isUnCategory)}}>
                        {
                            isUnCategory?
                            <AntDesignIcon name="caretup" size={25}/>
                            :<AntDesignIcon name="caretdown" size={25}/>
                        }
                    </TouchableOpacity>
                </View>
                {
                    isUnCategory && (
                        <View style={{flexDirection: 'row',flexWrap: 'wrap',}}>
                        {
                            tasks.filter(task => (task.type == 'category' && (task.status == 'open' || task.status == 'tough'))).map((item, index)=>(
                                <TouchableOpacity key={'task_' + index} style={{width: '50%', alignContent: 'center', alignItems: 'center'}} onPress={()=>onTask(item.termId)}>
                                    <Text style={{color: item.isSolved?'green':'red', fontWeight:item.status == 'tough' ? 'bold' : 'normal'}}>
                                        {item.term}({item.count})
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                        </View>
                    )
                }
                <View style={styles.header}>
                    <Text style={{fontSize: 18}}>
                        Approve definitions
                    </Text>
                    <TouchableOpacity onPress={()=>{setApproveDefinition(!approveDefinition)}}>
                        {
                            approveDefinition?
                            <AntDesignIcon name="caretup" size={25}/>
                            :<AntDesignIcon name="caretdown" size={25}/>
                        }
                    </TouchableOpacity>
                </View>
                {
                    approveDefinition && (
                        <View style={{flexDirection: 'row',flexWrap: 'wrap',}}>
                        {
                            tasks.filter(task => (task.type == 'synonym' && (task.status == 'open' || task.status == 'tough'))).map((item, index)=>(
                                <TouchableOpacity key={'task_' + index} style={{width: '50%', alignContent: 'center', alignItems: 'center'}} onPress={()=>onTask(item.termId)}>
                                    <Text style={{color: item.isSolved?'green':'red', fontWeight:item.status == 'tough' ? 'bold' : 'normal'}}>
                                        {item.term}({item.count})
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                        </View>
                    )
                }
                <View style={styles.header}>
                    <Text style={{fontSize: 18}}>
                        Add a term
                    </Text>
                    <TouchableOpacity onPress={()=>{setAddTermDefinition(!addTermDefinition)}}>
                        {
                            addTermDefinition?
                            <AntDesignIcon name="caretup" size={25}/>
                            :<AntDesignIcon name="caretdown" size={25}/>
                        }
                    </TouchableOpacity>
                </View>
                {
                    addTermDefinition && (
                        <View style={{flexDirection: 'row',flexWrap: 'wrap',}}>
                        {
                            tasks.filter(task => (task.type == 'addTerm' && (task.status == 'open' || task.status == 'tough'))).map((item, index)=>(
                                <TouchableOpacity key={'task_' + index} style={{width: '50%', alignContent: 'center', alignItems: 'center'}} onPress={()=>onTask(item.termId)}>
                                    <Text style={{color: item.isSolved?'green':'red', fontWeight:item.status == 'tough' ? 'bold' : 'normal'}}>
                                        {item.term}({item.count})
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                        </View>
                    )
                }
                <View style={styles.header}>
                    <Text style={{fontSize: 18}}>
                        Exact synonyms
                    </Text>
                    <TouchableOpacity onPress={()=>{setExactSynonym(!exactSynonym)}}>
                        {
                            exactSynonym ?
                            <AntDesignIcon name="caretup" size={25}/>
                            :<AntDesignIcon name="caretdown" size={25}/>
                        }
                    </TouchableOpacity>
                </View>
                {
                    exactSynonym && (
                        <View style={{flexDirection: 'row',flexWrap: 'wrap',}}>
                        {
                            tasks.filter(task => (task.type == 'exact' && (task.status == 'open' || task.status == 'tough'))).map((item, index)=>(
                                <TouchableOpacity key={'task_' + index} style={{width: '50%', alignContent: 'center', alignItems: 'center'}} onPress={()=>onTask(item.termId)}>
                                    <Text style={{color: item.isSolved?'green':'red', fontWeight:item.status == 'tough' ? 'bold' : 'normal'}}>
                                        {item.term}({item.count})
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                        </View>
                    )
                }
                <View style={styles.header}>
                    <Text style={{fontSize: 18}}>
                        Equivalent Terms
                    </Text>
                    <TouchableOpacity onPress={()=>{setEquivTerm(!equivTerm)}}>
                        {
                            equivTerm ?
                            <AntDesignIcon name="caretup" size={25}/>
                            :<AntDesignIcon name="caretdown" size={25}/>
                        }
                    </TouchableOpacity>
                </View>
                {
                    equivTerm && (
                        <View style={{flexDirection: 'row',flexWrap: 'wrap',}}>
                        {
                            tasks.filter(task => (task.type == 'equiv' && (task.status == 'open' || task.status == 'tough'))).map((item, index)=>(
                                <TouchableOpacity key={'task_' + index} style={{width: '50%', alignContent: 'center', alignItems: 'center'}} onPress={()=>onTask(item.termId)}>
                                    <Text style={{color: item.isSolved?'green':'red', fontWeight:item.status == 'tough' ? 'bold' : 'normal'}}>
                                        {item.term}({item.count})
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                        </View>
                    )
                }
                <View style={styles.header}>
                    <Text style={{fontSize: 18}}>
                        Miscellaneous
                    </Text>
                    <TouchableOpacity onPress={()=>{}}>
                        {
                            false?
                            <AntDesignIcon name="caretup" size={25}/>
                            :<AntDesignIcon name="caretdown" size={25}/>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles={
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    unsolvedPanel: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    text: {
        fontSize: 24,
        color: '#003458',
        fontStyle: 'italic',
    },
}