// PhotoPreview.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const descriptions = [
    { label: "coyote",      value: "coyote"},
    { label: "deer",        value: "deer"},
    { label: "fox",         value: "fox"},
    { label: "hummingbird", value: "hummingbird"},
    { label: "owl",         value: "owl"},
    { label: "possum",      value: "possum"},
    { label: "raccoon",     value: "raccoon"},
    { label: "snake",       value: "snake"},
    { label: "squirrel",    value: "squirrel"},
    { label: "woodpecker",  value: "woodpecker"},
];

const PhotoPreview = ({ route, navigation }) => {
    const { photo, location } = route.params;
    const [selectedDescription, setSelectedDescription] = useState<string | null>(null);

    const handleSubmit2 = () => {
        Alert.alert('Success', 'Photo and description submitted successfully!');
        navigation.goBack();
    };

    const handleSubmit = async () => {
        const data = new FormData();
        data.append('coordinate_x', location.latitude);
        data.append('coordinate_y', location.longitude);
        data.append('animal_label_human', selectedDescription || '');
    
        if (photo && photo.path) {
            const uri = photo.path;
            const type = photo.type || 'image/jpeg';
            const name = photo.name || 'photo.jpg';
    
            data.append('image_taken', {
                uri: uri,
                type: type,
                name: name,
            } as any);
        } else {
            Alert.alert("Error", "No photo provided");
            return;
        }
    
        try {
            const response = await fetch('https://lawrencemiao.info/add_animal', {
                method: 'POST',
                body: data,
            });
    
            const statusCode = response.status;
    
            const responseBodyText = await response.text();
            let responseBody;
    
            try {
                responseBody = JSON.parse(responseBodyText);
            } catch (jsonError) {
                console.warn('Response is not JSON, falling back to text:', jsonError);
                responseBody = responseBodyText;
            }
    
            console.log('Response Status Code:', statusCode);
            console.log('Parsed Response Body:', responseBody);
    
            if (response.ok) {
                Alert.alert('Success', 'Photo and description submitted successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', `Failed to submit data. Status Code: ${statusCode}, Message: ${responseBody}`);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            Alert.alert('Error', 'Failed to submit data');
        }
    };
            
    return (
        <View style={styles.container}>
            <Image source={require('../src/alpaca.png')} style={styles.title} />
            <View style={styles.cameraView}>
                <Image source={{ uri: photo.path }} style={styles.image} />
            </View>

            {/* <Text style={styles.label}>Select a description:</Text> */}

            <Dropdown
                data={descriptions}
                labelField="label"
                valueField="value"
                value={selectedDescription}
                onChange={(item) => setSelectedDescription(item.value)}
                style={styles.dropdown}
                placeholder="Choose a description"
            />

            <Pressable onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 75,
    },
    title: {
        // color: '#648f8d',
        // fontSize: 40,
        // fontWeight: 'bold',

        width: 200,
        height: 60,
        marginBottom: 20,
        // paddingBottom: 20,
    },
    cameraView: {
        width: '90%',
        height: '65%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#648f8d',
    },
    label: {
        marginTop: 30,
        marginBottom: 10,
        color: 'black',

        fontSize: 18,
    },
    dropdown: {
        height: 50,
        width: '85%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        // marginBottom: 10,
        marginTop: 20,
    },
    button: {
        backgroundColor: '#648f8d',
        borderRadius: 5,

        marginTop: 20,
        padding: 10,
        width: '85%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },
});

export default PhotoPreview;