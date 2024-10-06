import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, PhotoFile } from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';

const CameraView = () => {
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
            // Check if photoTaken is defined before setting the state
            if (photoTaken) {
                // Get the current location
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setPhoto({ file: photoTaken, location: { latitude, longitude } });
                        Alert.alert('Picture taken', `Photo captured successfully at (${latitude}, ${longitude})!`);
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

            {photo.file && (
                <View style={{ position: 'absolute', top: 50, left: 20 }}>
                    <Image
                        source={{ uri: photo.file.path }}
                        style={{ width: 100, height: 100 }}
                    />
                    <Text>Location: {photo.location?.latitude.toFixed(4)}, {photo.location?.longitude.toFixed(4)}</Text>
                </View>
            )}
        </View>
    );
};

export default CameraView;