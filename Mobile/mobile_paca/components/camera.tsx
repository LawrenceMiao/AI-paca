import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Dimensions } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, PhotoFile } from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';

const CameraView = ({ navigation }) => {
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [locationPermission, setLocationPermission] = useState(false);
    const [photo, setPhoto] = useState<{ file: PhotoFile | null; location: { latitude: number; longitude: number } | null }>({ file: null, location: null });

    const camera = useRef<Camera>(null);

    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        const requestPermissions = async () => {
            const cameraGranted = await requestPermission();
            if (cameraGranted) {
                const locationGranted = await Geolocation.requestAuthorization('whenInUse');
                setLocationPermission(locationGranted === 'granted');
            }
        };
        requestPermissions();
    }, []);

    const onTakePicture = async () => {
        if (!locationPermission) {
            Alert.alert('Location Permission Required', 'Please enable location access to take photos with location data.');
            return;
        }

        try {
            const photoTaken = await camera.current?.takePhoto();
            if (photoTaken) {
                // Get the current location
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setPhoto({ file: photoTaken, location: { latitude, longitude } });
                        Alert.alert('Picture taken', `Photo captured successfully at (${latitude}, ${longitude})!`);

                        // Navigate to the PhotoPreview screen with the photo and location
                        navigation.navigate('PhotoPreview', {
                            photo: photoTaken,
                            location: { latitude, longitude }
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

    if (!device || !hasPermission || !locationPermission) {
        return <Text>Camera not available or location permission not granted</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={camera}
                style={styles.camera}
                device={device}
                isActive={true}
                photo={true}
            />

            <Pressable 
                onPress={onTakePicture}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Snap</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '90%',
        height: '70%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    button: {
        marginTop: 20, // Space between camera and button
        width: 75,
        height: 75,
        backgroundColor: 'white',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CameraView;