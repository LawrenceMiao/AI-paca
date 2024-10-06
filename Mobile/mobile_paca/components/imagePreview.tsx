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

    const handleSubmit = async () => {
        const data = {
            coordinate_x: location.latitude,      
            coordinate_y: location.longitude,     
            imag_uri: photo.path,
            description: selectedDescription || '', 
        };

        try {
            await fetch('/animal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            Alert.alert('Success', 'Photo and description submitted successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error submitting data:', error);
            Alert.alert('Error', 'Failed to submit data');
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: photo.path }} style={styles.image} />
            <Text style={styles.label}>Select a description:</Text>
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
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    label: {
        marginBottom: 10,
    },
    dropdown: {
        height: 50,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default PhotoPreview;