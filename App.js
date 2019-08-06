/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Module from "./src/modules"


console.disableYellowBox = false;
type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Module />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    }
});
