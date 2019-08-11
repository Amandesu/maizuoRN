

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, InteractionManager } from 'react-native';


type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    componentWillMount(){
        
    }
    componentDidUpdate(){
        console.log("componentDidUpdate")
    }
    render() {
        console.log("render")
        const {state, props} = this;
        return (
            <View style={styles.container}>

               <Text onPress={() => {
                  // let handle1 = InteractionManager.createInteractionHandle();
                   
                  // InteractionManager.clearInteractionHandle(handle1)
                  
                   
                   
               
                  
                    setTimeout(() => {
                        console.log(2)
                    })
                    InteractionManager.runAfterInteractions(() => {
                        console.log(3)
                    }) 
                    new Promise((resolve) => {
                        resolve();
                    }).then(() => {
                        console.log(5)
                    })
                    setImmediate(() => {
                        console.log(1)
                    } )
                   
                   this.setState({})
                  
                    
               }}>123</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
