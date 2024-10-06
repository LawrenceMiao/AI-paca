// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraView from './components/camera';
import PhotoPreview from './components/imagePreview';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="CameraView">
                <Stack.Screen name="CameraView" component={CameraView} />
                <Stack.Screen name="PhotoPreview" component={PhotoPreview} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;