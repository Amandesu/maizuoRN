

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Image, TextInput } from 'react-native';


type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            cities: [],
            hotCitys:[]
        }
    }
    componentDidMount() {
        return fetch("https://m.maizuo.com/gateway?k=5762869", {
            //body: JSON.stringify(data), // must match 'Content-Type' header
            headers: {
                'content-type': 'application/json',
                'X-Host': 'mall.film-ticket.city.list'
            },
            method: 'GET',
        })
            .then(response => response.json())
            .then(response => {
                let cities = response.data.cities;
                let arrayList = Array(26).fill(0).map(() => []);
                let hotCitys = [];
                cities.forEach(city => {
                    if (["北京", "上海", "广州", "深圳"].indexOf(city.name) > -1) {
                        hotCitys.push(city); 
                    }
                    // 城市列表
                    let c = city.pinyin.charCodeAt(0)-97;
                    arrayList[c].push(city);
                })
                this.setState({
                    cities:arrayList,
                    hotCitys
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    renderHotCity(){
        let hotCitys = this.state.hotCitys;
        let splitArr = [], temp = [];
        hotCitys.forEach(item => {
            if (temp.length >= 3) {
                splitArr.push(temp)
                temp = [];
            }
            temp.push(item);
        })
        temp.length && splitArr.push(temp);
        return (
            <View>
                {splitArr.map(hotCitys => {
                    return (
                    <View style={{ height: 30, flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
                        {hotCitys.map((city) => {
                            return (
                                <View style={{ width: 100, marginHorizontal: 10, backgroundColor: "#f4f4f4", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "#191a1b", fontSize: 14 }}>{city.name}</Text>
                                </View>
                            )
                        })}
                    </View>
                    )
                })}
            </View>
        )
    }
    renderCities(){
        const {state, props } = this;
        return (
            <View style={styles.list}>
                {state.cities.map((_, index) => {
                    let sublist = this.state.cities[index];
                    return sublist.length ? 
                    <View style={styles.item}> 
                        <View style={styles.title}>
                            <Text>{String.fromCharCode(index+65)}</Text>
                        </View>
                        <View style={styles.sublist}>
                            {sublist.map((city) => {
                                return (
                                    <View>
                                        <View style={styles.subtitle}>
                                            <Text style={{color:"#191a1b",fontSize:14}}>{city.name}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>:null
                })}
            </View>
        )
    }
    render() {
        const {state, props} = this;
        console.log(state.text)
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <View style={{ flex: 1.5, justifyContent: "center", marginLeft: 10 }}>
                        <Image
                            source={require("./images/delete.png")}
                            style={{ width: 20, height: 20 }}
                        />
                    </View>
                    <View style={{ flex: 7, alignItems: "center", justifyContent: "center", background: "#000000" }}>
                        <Text style={{ fontSize: 17 }}>当前城市</Text></View>
                    <View style={{ flex: 1.5 }}></View>
                </View>
                <View style={styles.inputContainer}>
                    <View style={{ backgroundColor: "#fff", flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <Image
                            source={require("./images/search.png")}
                            style={{ width: 20, height: 20, marginLeft: 10 }}
                        />
                        <TextInput
                            style={{ height: 20, flex: 1, paddingVertical: 0 }}
                            
                            value ={state.text}
                            placeholder="Type here to translate!"
                            editable={true}
                            onChangeText={(text) => {
                                
                                this.setState({ text })
                            }}
                        ></TextInput>
                    </View>
                </View>
                <ScrollView>
                    <View>
                        <View style={styles.hotCity}>
                            <View style={{ height: 20, marginBottom: 10 }}>
                                <Text style={{ color: "#797d82", fontSize: 13 }}>热门城市</Text>
                            </View>
                            {this.renderHotCity()}
                            {this.renderCities()}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        height: 44
    },
    inputContainer: {
        backgroundColor: "#f4f4f4",
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: "row",
        height: 49
    },
    hotCity: {
        backgroundColor: "#fff",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
    },
    list:{
        backgroundColor:"#fff"
    },
    title:{
        height:30,
        paddingLeft:15,
        backgroundColor:"#f4f4f4",
        justifyContent:"center"
    },
    sublist:{
        paddingLeft:20
    },
    subtitle:{
        justifyContent:"center",
        height:48,
        borderBottomWidth:1,
        borderBottomColor:"#ededed"
    }
});
