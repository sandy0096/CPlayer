
import React from 'react';

import Main from './Main';

import { NativeRouter, Route } from "react-router-native";

const App: () => React$Node = () => {
  return (
    <NativeRouter>
        <Route exact path="/" component={Main} />
    </NativeRouter>
    
  );
};

export default App;
