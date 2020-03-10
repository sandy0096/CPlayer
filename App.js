
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Home from './Home/home';

import { NativeRouter, Route, Link } from "react-router-native";

const App: () => React$Node = () => {
  return (
    <NativeRouter>
      <Route exact path="/" component={Home} />
      {/* <Route path="/about" component={About} /> */}
      {/* <Route path="/topics" component={Topics} /> */}

    </NativeRouter>
    
  );
};

export default App;
