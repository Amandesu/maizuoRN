

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Image, Dimensions, ImageBackground, TouchableOpacity, Animated, FlatList, NativeModules} from 'react-native';

let window = Dimensions.get("window");
console.log(window)


type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.film = {}
        this.state = {
            cinemaInfo:{},
            films:[],
            schedules:[],
            index:0,
            dateKey:0
        }
    }
    componentDidMount() {
       
        NativeModules.BridgeModule.getDataFromIntent((cinemaId) => {
            this.cinemaId = cinemaId || 8506;
            this.getCinemaInfo()
            this.getFilmList()
        });
        
    }
    getCinemaInfo(){
        return fetch(`https://m.maizuo.com/gateway?k=7793615&cinemaId=${this.cinemaId}`, {
            //body: JSON.stringify(data), // must match 'Content-Type' header
            headers: {
                'content-type': 'application/json',
                'X-Host': 'mall.film-ticket.cinema.info'
            },
            method: 'GET',
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    cinemaInfo:response.data.cinema
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    getFilmList(){
        return fetch(`https://m.maizuo.com/gateway/?cinemaId=${this.cinemaId}&k=8604433`, {
            //body: JSON.stringify(data), // must match 'Content-Type' header
            headers: {
                'content-type': 'application/json',
                'X-Host': 'mall.film-ticket.film.cinema-show-film'
            },
            method: 'GET',
        })
            .then(response => response.json())
            .then(response => {
                let films = response.data.films;
                this.film = films[0];
                this.setState({ films, index:0, dateKey:this.film.showDate[0] });
                this.getSchedules();
                
            })
            .catch(err => {
                console.log(err)
            })
    }
    getSchedules(){
        return fetch(`https://m.maizuo.com/gateway/?cinemaId=${this.cinemaId}&filmId=${this.film.filmId}&k=8604433&date=${this.state.dateKey}`, {
            //body: JSON.stringify(data), // must match 'Content-Type' header
            headers: {
                'content-type': 'application/json',
                'X-Host': 'mall.film-ticket.schedule.list'
            },
            method: 'GET',
        })
            .then(response => response.json())
            .then(response => {
                let schedules = response.data.schedules;
                this.setState({
                    schedules
                }) 
            })
            .catch(err => {
                console.log(err)
            })
    }
    render() {
        const {state, props} = this;
        const cinemaInfo = state.cinemaInfo;
        const film = this.film;
        const films = state.films;
        const showDate = this.film.showDate ?[...film.showDate].map((date) => {
            let mapDay = {
                0:"周日", 1:"周一", 2:"周二", 3:"周三", 4:"周四", 5:"周五", 6:"周六"
            }
            let dateObj =  new Date(date*1000);
            let m = dateObj.getMonth()+1;
            let d = dateObj.getDate();
            let day = mapDay[dateObj.getDay()]
            return {
                value:`${day}${m}月${d}日`,
                key:date
            }
        }) :[];
        let dateKey = state.dateKey;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() =>  NativeModules.BridgeModule.closeWindow()}>
                    <Image source={require("./images/leftArrow.png")} style={{width:11, height:18}} />
                    </TouchableOpacity>
                    
                    <View style={{flex:1, alignContent:"center", alignItems:"center"}}>
                     <Text style={{fontSize: 17,color:"#191a1b"}}>深圳中影开元国际影城</Text>
                    </View>
                    <View style={{width:11}}></View>
                </View>
                <ScrollView>
                    <View>
                        <View style={styles.address}>
                            <Image source={require("./images/address.png")} style={{width:14, height:21}}/>
                            <View style={{paddingHorizontal:12, flex:1}}>
                                <Text style={{color:"#2c3e50"}}>{cinemaInfo.address}</Text>
                            </View>
                            <Image source={require("./images/tel.png")} style={{width:17, height:18, marginRight:25}}/>
                        </View>
                        <ImageBackground  style={{width: '100%', height: 160,backgroundColor:"#aaa"}}>
                            <View style={styles.filmList}>
                                 <ScrollView 
                                    ref = {ref => this._scrollView = ref}
                                    horizontal 
                                    showsHorizontalScrollIndicator={false}
                                    scrollEventThrottle={200}
                                    onScroll={e =>  this.scrollPosition = e.nativeEvent.contentOffset.x}
                                    snapToInterval={108} 
                                    snapToAlignment="center"
                                    snapToStart={true}
                                    snapToEnd={true}
                                    onScrollEndDrag={e => {
                                    }} 
                                    onMomentumScrollEnd={e => {
                                        this.scrollIndex = Math.round(this.scrollPosition/108);
                                        this.setState({index:this.scrollIndex})
                                    }}
                                 >
                                     <View style={{flexDirection:"row", paddingTop:8}}>
                                        <View style={{width:window.width/2-(108)/2}}></View>
                                        {films.map((film, index) => {
                                            return (
                                                <TouchableOpacity key={index} onPress={() => {
                                                    this.film = films[index];
                                                    this._scrollView.scrollTo({x: index*108, y: 0, animated: true})
                                                    this.setState({index, dateKey:this.film.showDate[0]}, this.getSchedules)
                                                }}>
                                                <View style={{width:108, height:130, paddingHorizontal:8}}>
                                                    <Image source={{uri:film.poster}} 
                                                        style={{
                                                            height:104, width:72, 
                                                            transform: [{scale:state.index==index?1.3:1}]
                                                        }} />
                                                   
                                                </View>
                                                </TouchableOpacity>
                                            )
                                        })}
                                         <View style={{width:window.width/2-(108)/2}}></View>
                                     </View>
                                 </ScrollView>
                            </View>
                        </ImageBackground>
                        
                        <TouchableOpacity onPress={() => {NativeModules.BridgeModule.openLink(`links://filmDetail?filmId=${this.film.filmId}`)}}>
                            <View style={styles.filmDetail}>
                                <View style={{flexDirection:"row", justifyContent:"center"}}>
                                    <Text style={{color:"#191a1b", fontSize:15, marginRight:8}}>{film.name}</Text>
                                    <Text style={{color:"#ffb232", fontSize:16}}>{film.grade}</Text>
                                    <Text style={{color:"#ffb232", fontSize:10, marginTop:5}}>分</Text>
                                </View>
                                <View style={{height:10}}></View>
                                <View style={{paddingHorizontal:"12%"}}>
                                    <Text style={{color:"#797d82", fontSize:13}} ellipsizeMode="tail" numberOfLines={1}>
                                        {film.category} | {film.runtime}分钟 | {film.director} | {film.actors && film.actors.map(actor=>actor.name).join(" ")}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        
                        <FlatList
                        ref = {ref => this._FlatList = ref}
                            horizontal
                            style={{height:49, borderBottomWidth:1,borderColor:"#ededed"}}
                            data={showDate}
                            renderItem={({item, index}) => <View key={index} style={{justifyContent:"center", paddingHorizontal:15}}  >
                                <Text onPress={() => {
                                    this.setState({
                                        dateKey:item.key
                                    },  this.getSchedules)
                                }} style={{color:item.key == dateKey ? "#ff5f16":"#191a1b"}}>{item.value}</Text>
                            </View>}
                            />
                        <View style={styles.scheduleList}>
                            {state.schedules.map(schedule => {
                                let showAt = new Date(schedule.showAt*1000);
                                let endAt = new Date(schedule.endAt*1000);
                                let showAt_Minutes = showAt.getMinutes() < 10 ? "0"+showAt.getMinutes():showAt.getMinutes();
                                let endAt_Minutes = endAt.getMinutes() < 10 ? "0"+endAt.getMinutes():endAt.getMinutes();
                                return (
                                    <View style={{padding:15, flexDirection:"row"}}>
                                        <View style={{flexBasis:100}}>
                                            <View ><Text style={{fontSize:15, color:"#191a1b"}}>{`${showAt.getHours()}:${showAt_Minutes}`}</Text></View>
                                            <View><Text style={{fontSize:13, color:"#797d82", marginTop:2}}>{`${endAt.getHours()}:${endAt_Minutes}`}散场</Text></View>
                                        </View>
                                        <View style={{flex:1,  flexShrink:0}}>
                                            <View><Text style={{fontSize:15, color:"#191a1b"}}>{schedule.filmLanguage}{schedule.imagery}</Text></View>
                                            <View><Text style={{fontSize:13, color:"#797d82", marginTop:2}}>{schedule.hallName}</Text></View>
                                        </View>
                                        <View style={{flexBasis:100, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                            <View ><Text style={{fontSize:15, color:"#ff5f16"}}>￥{schedule.salePrice/100}</Text></View>
                                            <View style={{borderColor:"#ff5f16", borderWidth:1, height:25, width:50, justifyContent:"center", alignItems:"center"}}><Text style={{fontSize:13, color:"#ff5f16"}}>购票</Text></View>
                                        </View>
                                    </View>
                                )
                            })}
                            
                        </View>
                    </View>
                    
                </ScrollView>
                
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor:"red"
    },
    header: {
       height:44,
       flexDirection:"row",
       alignItems:"center",
       paddingLeft:15,
       paddingRight:15
    },
    address:{
        height:50,
        flexDirection:"row",
        alignItems:"center",
        paddingLeft:17,
        borderTopWidth:1,
        borderColor:"#ededed"
    },
    filmList:{
        height:160,
        paddingVertical:15
    },
    filmDetail:{
        height:80,
        paddingVertical:15,
        borderBottomWidth:1,
        borderColor:"#ededed"
    }
});
