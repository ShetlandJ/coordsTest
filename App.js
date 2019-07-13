import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

export default class App extends Component {
    state = {
        location: null,
        errorMessage: null,
        loading: false,
        lat: '',
        lon: '',
    };

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };

    render() {
        let text = 'Waiting..';
        let latlon = ''
        if (this.state.errorMessage) {
            text = this.state.errorMessage;
            this.satetloading = true;
        } else if (this.state.location) {
            latlon = this.state.location;
            lat = this.state.location.coords.latitude
            lon = this.state.location.coords.longitude
        }

        let loadingDivs = <Text>Loading</Text>

        if (!this.state.location) {
            return (
                <View>{loadingDivs}</View>
            )
        } else {
            return (
                <View>

                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{ height: 400 }}>
                            <MapView
                                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                style={styles.map}
                                region={{
                                    latitude: lat,
                                    longitude: lon,
                                    latitudeDelta: 0.015,
                                    longitudeDelta: 0.0121,
                                }}
                            >
                                <MapView.Marker
                                    coordinate={this.state.location.coords}
                                    title="My Marker"
                                    description="Some description"
                                />

                            </MapView>
                        </View>
                        <View>
                            <Text>{this.state.location.coords.longitude}</Text>
                            <Text>{this.state.location.coords.latitude}</Text>
                        </View>
                    </View>

                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});