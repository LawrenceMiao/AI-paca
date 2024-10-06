// CameraView.js

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, PhotoFile } from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';

const CameraView = ({ navigation }) => {
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [photo, setPhoto] = useState<{ file: PhotoFile | null; location: { latitude: number; longitude: number } | null }>({ file: null, location: null });

    const camera = useRef<Camera>(null);
    
    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission]);

    const onTakePicture = async () => {
        try {
            const photoTaken = await camera.current?.takePhoto();
            console.log(photoTaken);
            if (photoTaken) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        // Navigate to PhotoPreview with photo and location data
                        navigation.navigate('PhotoPreview', {
                            photo: photoTaken,
                            location: { latitude, longitude },
                        });
                    },
                    (error) => {
                        console.error('Failed to get location:', error);
                        Alert.alert('Error', 'Failed to get location');
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            } else {
                Alert.alert('Error', 'Failed to take picture');
            }
        } catch (error) {
            console.error('Failed to take picture:', error);
            Alert.alert('Error', 'Failed to take picture');
        }
    };

    console.log("has permissions:", hasPermission);

    if (!device || !hasPermission) {
        return <Text>Camera not available</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <Camera 
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device} 
                isActive={true}
                photo={true}
            />

            <Pressable 
                onPress={onTakePicture}
                style={{    
                    position: 'absolute', 
                    alignSelf: 'center', 
                    bottom: 50, 
                    width: 75, 
                    height: 75, 
                    backgroundColor: 'white',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Snap</Text>
            </Pressable>
        </View>
    );
};

export default CameraView;