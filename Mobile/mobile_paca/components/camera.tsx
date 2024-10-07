import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, PhotoFile } from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';

const CameraView = ({ navigation }) => {
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [locationPermission, setLocationPermission] = useState(false);
    const [photo, setPhoto] = useState<{ file: PhotoFile | null; location: { latitude: number; longitude: number } | null }>({ file: null, location: null });

    const camera = useRef<Camera>(null);

    useEffect(() => {
        const requestPermissions = async () => {
            const cameraGranted = await requestPermission();
            if (cameraGranted) {
                // Request location permission only after the camera permission is granted
                Geolocation.requestAuthorization('whenInUse')
                    .then((status) => {
                        if (status === 'granted') {
                            setLocationPermission(true);
                        } else {
                            setLocationPermission(false);
                            Alert.alert('Location Permission Denied', 'Please enable location access to use this feature.');
                        }
                    });
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
                        // Alert.alert('Picture taken', `Photo captured successfully at (${latitude}, ${longitude})!`);

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

    if (!device || !hasPermission || !locationPermission) {
        return <Text>Camera not available or location permission not granted</Text>;
    }

    return (
        <View style={styles.container}>
            <Image source={require('../src/alpaca.png')} style={styles.title} />
            {/* <Text style={styles.title}>AI-paca</Text> */}
            <View style={styles.cameraView}>
                <Camera
                    ref={camera}
                    style={styles.camera}
                    resizeMode="cover"
                    device={device}
                    isActive={true}
                    photo={true}
                />
            </View>
            <Pressable onPress={onTakePicture} style={styles.button}>
                <View style={styles.innerButton} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Adjust this for a better layout
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
    camera: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#648f8d',
    },
    button: {
        marginTop: 30,
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerButton: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 50,
        borderWidth: 5,
        borderColor: '#648f8d',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CameraView;