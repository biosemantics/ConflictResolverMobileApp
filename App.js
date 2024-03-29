/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { StyleSheet, SafeAreaView} from 'react-native';
import Root from './app/Root';
// import App1 from './app/Root';
import { Provider } from 'react-redux';
import initStore from './app/store';
// import { NavigationContainer } from "@react-navigation/native";

const App: () => React$Node = () => {
  const [store, setStore] = useState(initStore());
  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <Root />

      {/* <NavigationContainer>
          <App1/>
        </NavigationContainer> */}
      </Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
