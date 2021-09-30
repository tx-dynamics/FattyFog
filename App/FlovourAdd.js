import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Image,
    TextInput,
    Dimensions,
    ScrollView,
    FlatList,
    Modal,
    Alert,
} from 'react-native';

import {
    responsiveWidth,
    responsiveHeight,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Constants from 'expo-constants';
import { Header, Avatar, colors } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllOfCollection, getData, deleteData,saveData } from '../App/firbase/utility'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Ionicons } from '@expo/vector-icons';
import { ToastAndroid } from 'react-native';
export default class FlovourAdd extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            modalVisible1:false,
            showRecipies: [],
            modelData: [],
            flavourName:'',
        }
    }
    componentDidMount = async () => {
        this.loadData();
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.loadData();
        });

    };

    async loadData() {
        let data = await getAllOfCollection('Flavour')
        console.log(data)
        this.setState({
            showRecipies: data,
            modalVisible: false,
        })

    }
    delteMe = async (index) => {
        const { showRecipies } = this.state;
        const data = showRecipies[index];
        showRecipies.splice(index, 1);
        this.setState({ showRecipies, modalVisible: false });
        ToastAndroid.show("Flavour is deleted", ToastAndroid.SHORT)
       
        await deleteData('Flavour', data.id)
    }
editme=async (item) =>{
    this.setState({flavourName:item.name,
        modalVisible1:true,
        flavourId:item.id,
    })
}
updateFlavourName= async() => {
    this.setState({modalVisible1: false });
    ToastAndroid.show("Flavour is updated successfully", ToastAndroid.SHORT)
    let data={"name":this.state.flavourName,
    id:this.state.flavourId,}
    await  saveData('Flavour',this.state.flavourId,data)
}

    uniqueID() {
        // this.setState({indicator: true});
        function chr4() {
          return Math.random()
            .toString(16)
            .slice(-4);
        }
        return (
          chr4() +
          chr4() +
          '-' +
          chr4() +
          '-' +
          chr4() +
          '-' +
          chr4() +
          '-' +
          chr4() +
          chr4() +
          chr4()
        );
      }
    saveFlavourName=async () =>{
        let productId = this.uniqueID();
        const { showRecipies } = this.state;
        let data={"name":this.state.flavourName,
    id:productId,}
        showRecipies.push(data)
        this.setState({ showRecipies, modalVisible: false });
        ToastAndroid.show("New flavour is added ", ToastAndroid.SHORT)
        await  saveData('Flavour',productId,data)
    }


    render() {
        return (

            <ScrollView style={styles.container} >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}>

                    <View style={{
                        width: windowWidth - 30,
                        height: windowHeight / 1.5,
                        borderRadius: responsiveHeight(4),
                        alignSelf: 'center', backgroundColor: '#303030',
                        elevation: 20,
                        marginTop: responsiveHeight(20)
                    }}>
                        <View style={{
                            width: '95%', marginTop: responsiveHeight(4),
                            height: '90%', borderColor: '#F6CB5A', borderWidth: 1,
                            alignSelf: 'center', borderRadius: responsiveHeight(4)
                        }}>
                            
                            <Text style={{
                                fontSize: 16, fontWeight: '500',
                                paddingLeft: responsiveHeight(2), color: '#F6CB5A',
                                marginTop:responsiveHeight(3),
                            }}>Flavor Name:</Text>

                            <TextInput
                                style={{
                                    color: 'white',
                                    fontSize: responsiveFontSize(2),
                                    margin: responsiveHeight(2),
                                }}
                                placeholder={'Flavour Name '}
                                placeholderTextColor={'grey'}
                                returnKeyType="next"
                                returnKeyLabel="next"
                                value={this.state.flavourName}
                                onChangeText={(text) => {
                                    this.setState({ flavourName: text });
                                }}
                            /> 
                            <View style={{
                                flexDirection: 'row', 
                                justifyContent: 'space-around'
                            }}>
                              
                                <TouchableOpacity style={{
                                    flexDirection: 'row', backgroundColor: '#202020', width: responsiveWidth(25), height: responsiveHeight(6),
                                    justifyContent: 'center', alignContent: 'center', alignItems: 'center',
                                    borderRadius: responsiveHeight(2), marginBottom: responsiveHeight(2)
                                }}
                                    onPress={
                                        () => this.saveFlavourName()}
                                >
                                    <Image
                                        source={require('../assets/FattyFogAssesst/fluent_save_24_filled.png')}
                                        style={{ width: 20, height: 20, margin: 5 }}
                                    />
                                    <Text style={{ color: 'white', fontSize: 14 }}>Save</Text>
                                </TouchableOpacity>

                            </View>


                        </View>
                    </View>
                </Modal>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible1}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}>

                    <View style={{
                        width: windowWidth - 30,
                        height: windowHeight / 1.5,
                        borderRadius: responsiveHeight(4),
                        alignSelf: 'center', backgroundColor: '#303030',
                        elevation: 20,
                        marginTop: responsiveHeight(20)
                    }}>
                        <View style={{
                            width: '95%', marginTop: responsiveHeight(4),
                            height: '90%', borderColor: '#F6CB5A', borderWidth: 1,
                            alignSelf: 'center', borderRadius: responsiveHeight(4)
                        }}>
                            
                            <Text style={{
                                fontSize: 16, fontWeight: '500',
                                paddingLeft: responsiveHeight(2), color: '#F6CB5A',
                                marginTop:responsiveHeight(3),
                            }}>Flavor Name:</Text>

                            <TextInput
                                style={{
                                    color: 'white',
                                    fontSize: responsiveFontSize(2),
                                    margin: responsiveHeight(2),
                                }}
                                placeholder={'Flavour Name '}
                                placeholderTextColor={'grey'}
                                returnKeyType="next"
                                returnKeyLabel="next"
                                value={this.state.flavourName}
                                onChangeText={(text) => {
                                    this.setState({ flavourName: text });
                                }}
                            /> 
                            <View style={{
                                flexDirection: 'row', 
                                justifyContent: 'space-around'
                            }}>
                              
                                <TouchableOpacity style={{
                                    flexDirection: 'row', backgroundColor: '#202020', width: responsiveWidth(25), height: responsiveHeight(6),
                                    justifyContent: 'center', alignContent: 'center', alignItems: 'center',
                                    borderRadius: responsiveHeight(2), marginBottom: responsiveHeight(2)
                                }}
                                    onPress={
                                        () => this.updateFlavourName()}
                                >
                                    <Image
                                        source={require('../assets/FattyFogAssesst/fluent_save_24_filled.png')}
                                        style={{ width: 20, height: 20, margin: 5 }}
                                    />
                                    <Text style={{ color: 'white', fontSize: 14 }}>Update</Text>
                                </TouchableOpacity>

                            </View>


                        </View>
                    </View>
                </Modal>

                <View style={{ marginTop: Constants.statusBarHeight, backgroundColor: '#202020' }}>
                    <Header
                        statusBarProps={{ barStyle: 'light', backgroundColor: 'black' }}
                        barStyle="light-content" // or d
                        backgroundColor={'#202020'}
                        leftComponent=

                        {
                            <TouchableOpacity
                                onPress={() => { this.props.navigation.navigate('Home') }}
                            >
                                <Text style={{

                                    color: '#fff', fontSize: responsiveFontSize(2), fontWeight: 'bold'

                                }}>Logout</Text>

                            </TouchableOpacity>
                        }


                        centerComponent={
                            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../assets/FattyFogAssesst/whitelogo1.png')}
                                    style={{
                                        width: 122, height: 60,
                                        marginTop: -25
                                    }}></Image>

                            </View>

                        }
                        containerStyle={{ borderBottomColor: '#85106a', borderBottomWidth: 0, color: 'red' }}
                        style={{ backgroundColor: 'red', elevation: 5 }}
                    />
                </View>
                <Text style={styles.toptext}>Availble Flavours</Text>
                <View style={styles.bottomView}>
                    <FlatList
                        data={this.state.showRecipies}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity style={styles.listView}
                                onPress={() => {
                                    this.setState({
                                        modalVisible: true,
                                        modelData: item,
                                        modelIndex: index
                                    })
                                }}
                            >
                                <Text style={styles.listViewText}>{item.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={{

                                            alignSelf: 'center',
                                        }}
                                        onPress={
                                            () => this.editme(item)
                                            }
                                    >
                                        <Image
                                            source={require('../assets/FattyFogAssesst/clarity_edit_solid.png')}
                                            style={{
                                                width: 20, height: 21,
                                                alignSelf: 'center',
                                            }}></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{

                                            alignSelf: 'center',
                                        }}
                                        onPress={() => this.delteMe(index)}>
                                        <Image
                                            source={require('../assets/FattyFogAssesst/fluent_delete_dismiss_24_filled.png')}
                                            style={{
                                                width: 20, height: 21,
                                                alignSelf: 'center',
                                                margin: responsiveHeight(2),
                                            }}></Image>
                                    </TouchableOpacity>
                                </View>

                            </TouchableOpacity>

                        }
                        ItemSeparatorComponent={this.renderSeparator}
                    />

                    <TouchableOpacity
                        onPress={() => this.setState({
                            modalVisible:true,
                        })}
                        style={{
                            flexDirection: 'row',
                            backgroundColor: '#202020',
                            width: responsiveWidth(45),
                            height: responsiveHeight(7.5),
                            alignSelf: 'flex-end',
                            margin: responsiveHeight(2),
                            justifyContent: 'center', alignContent: 'center', alignItems: 'center',
                            borderRadius: responsiveHeight(2), marginBottom: responsiveHeight(2)
                        }}>
                        <Image
                            source={require('../assets/FattyFogAssesst/fluent_save_24_filled.png')}
                            style={{ width: 25, height: 25, padding: 5 }}
                        />
                        <Text style={{ color: 'white', fontSize: 17 }}>Add Flavour</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>

        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#303030',
        opacity: 1,
    },
    toptext: {
        color: 'white',
        fontSize: responsiveFontSize(2),
        padding: responsiveWidth(3),
        fontSize: responsiveFontSize(2.5)
    },
    flatlistTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flatlistTopText: {
        color: 'white',
        fontSize: responsiveFontSize(2),
        marginTop: responsiveHeight(10),
        paddingLeft: responsiveWidth(6),
    },
    flavorView: {
        backgroundColor: '#424242',
        width: windowWidth - 40,
        height: windowHeight / 3,
        borderRadius: responsiveWidth(5),
        alignSelf: 'center',
        elevation: 20,
        marginTop: responsiveHeight(2),
        justifyContent: 'center',
    },
    roundView: {
        backgroundColor: 'white',
        width: 130,
        height: 130,
        borderRadius: 130 / 2,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    textbox1: {
        color: 'white',
        fontSize: responsiveFontSize(2.2),
        textAlign: 'center',
        marginTop: responsiveHeight(2)
    },
    listView: {
        flexDirection: 'row',
        backgroundColor: '#424242',
        width: windowWidth - 40,
        height: windowHeight / 11,
        borderRadius: responsiveWidth(5),
        alignSelf: 'center',
        elevation: 25,
        opacity: 1,
        marginTop: responsiveHeight(2),
        justifyContent: 'space-between',
        alignContent: 'center',
    },
    listViewText: {
        color: 'white',
        fontSize: responsiveFontSize(2),
        paddingLeft: responsiveWidth(6),
        alignSelf: 'center',
    },
    bottomView: {
        marginBottom: responsiveHeight(2),
    }

});
