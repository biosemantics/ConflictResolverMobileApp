/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
// import {createStackNavigator} from '@react-navigation/stack';

// screens
import Splash from './screens/onboarding/Splash';
import Login from './screens/onboarding/Login';
import RegisterUser from './screens/onboarding/RegisterUser';
import HomeLayout from './screens/home/HomeLayout';
import Category from './screens/decision/Category';
import Approve from './screens/decision/Approve';
import AddTerm from './screens/decision/AddTerm';
import ExactTerm from './screens/decision/ExactTerm';
import EquivTerm from './screens/decision/EquivTerm';
import Disputed from './screens/decision/Disputed';



// import { NavigationContainer } from '@react-navigation/native';
// // import { createStackNavigator } from '@react-navigation/native';

// const Stack = createStackNavigator();

// const App1 =() =>{
//   return (
//       <Stack.Navigator initialRouteName="Splash">
//         <Stack.Screen name="Splash" component={Splash} />
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="RegisterUser" component={RegisterUser} />
//         <Stack.Screen name="HomeLayout" component={HomeLayout} />
//         <Stack.Screen name="Category" component={Category} />
//         <Stack.Screen name="Approve" component={Approve} />
//         <Stack.Screen name="AddTerm" component={AddTerm} />
//         <Stack.Screen name="ExactTerm" component={ExactTerm} />
//         <Stack.Screen name="EquivTerm" component={EquivTerm} />
//         <Stack.Screen name="Disputed" component={Disputed} />
//       </Stack.Navigator>
   
//   );
// }



const Root = createStackNavigator({
  Splash: {
    screen: Splash
  },
  Login: {
    screen: Login
  },
  RegisterUser: {
    screen: RegisterUser
  },
  HomeLayout: {
    screen: HomeLayout
  },
  Category: {
    screen: Category
  },
  Approve: {
    screen: Approve
  },
  AddTerm: {
    screen: AddTerm
  },
  ExactTerm: {
    screen: ExactTerm
  },
  EquivTerm: {
    screen: EquivTerm
  },
  Disputed: {
    screen: Disputed
  }
},
  {
    initialRouteName: 'Splash',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    },
  })
export default createAppContainer(Root);
// export default App1;