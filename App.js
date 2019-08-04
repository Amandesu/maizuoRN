/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Module from "./src"


console.log(Module)
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
        marginTop:15,
        flex:1
    }
});
