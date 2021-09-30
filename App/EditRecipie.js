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
    TouchableHighlight,
} from 'react-native';

import {
    responsiveWidth,
    responsiveHeight,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import ModalDropdown from 'react-native-modal-dropdown';
const DEMO_OPTIONS_1 = ['Doddles', 'Aussies Doddles', 'Aussies',];
import Constants from 'expo-constants';
import { Header, Avatar, colors } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const DEMO_OPTIONS_2 = [
    { "name": "Flavour 1", },
    { "name": "Flavour 2", },
    { "name": "Flavour 3", },
    { "name": "Flavour 4", },
    { "name": "Flavour 5", },
    { "name": "Flavour 6", },
];

import { Ionicons } from '@expo/vector-icons';
import { ToastAndroid } from 'react-native';
import { TabRouter } from '@react-navigation/routers';
import { getAllOfCollection } from './firbase/utility';
export default class EditRecipie extends Component {
    constructor(props) {
        super(props);
        this.state = {
           data:[],
            comments: this.props.route.params.Item,
            dropdown_4_options: null,
            dropdown_4_defaultValue: 'loading...',
            recipieName: '',
            Delindex:this.props.route.params.index,
            pageHeight: Dimensions.get('window').height,
            pageWidth:Dimensions.get('window').width,
        }
    }
    componentDidMount = async () => {
        Dimensions.addEventListener('change',({window:{width,height}}) =>{
            if(width<height){
                console.log("View 1")
               // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
               
             this.setState({
                    pageHeight: Dimensions.get('window').height,
                    pageWidth:Dimensions.get('window').width,
                  })
               // ScreenOrientation.unlockAsync()
            }
            else{
                console.log("View 2")
                //ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                 this.setState({
                    pageHeight: Dimensions.get('window').height,
                    pageWidth:Dimensions.get('window').width,
                  })
               // ScreenOrientation.unlockAsync()
            }
        
        })
        this.setState({
            recipieName:this.state.comments[0].recipieName
        })
        let  data = await getAllOfCollection('Flavour')
        await this.setState({
            data:data,
        })
        console.log("TETS TSTS TS ",data)
        

    };
    _dropdown_2_renderButtonText(rowData) {
        const { name } = rowData;
        return `${name}`;
    }

    _dropdown_2_renderRow(rowData, rowID, highlighted) {
        return (
            <TouchableOpacity
                onPress={() => this.addReplyfromDrop(rowData.name)}
            >
                <View style={styles.dropdown_2_row}>
                    <Text style={styles.dropdown_2_row_text}>
                        {`${rowData.name}`}
                    </Text>
                    <Image style={styles.dropdown_2_image}
                        mode='contain'
                        source={require('../assets/FattyFogAssesst/pluseRed.png')}
                    />

                </View>
            </TouchableOpacity>
        );
    }
    _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == DEMO_OPTIONS_1.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_2_separator}
            key={key}
        />);
    }
    addReply() {
        const { comments } = this.state;
        comments.unshift({ flavour: this.state.flavour, Famount: this.state.Famount });
        console.log(comments);
        this.setState({ comments: comments.slice(0) });
    }
    addReplyfromDrop(rowdata) {
        const { comments } = this.state;
        comments.unshift({ flavour: rowdata });
        console.log(comments);
        this.setState({ comments: comments.slice(0) });
    }

    delteMe = async (index) => {
        console.log(index)
        const { comments } = this.state;
        comments.splice(index, 1);
        this.setState({ comments });
    }

    saveRecipie = async () => {
        const { comments } = this.state;
        
        this.setState({ comments,recipieName:'' });

        comments[0].recipieName=this.state.recipieName
        this.setState({ comments });
        const dellRecipie1 = await AsyncStorage.getItem('allRecipie');
        let dellRecipie = JSON.parse(dellRecipie1)
        dellRecipie.splice(this.state.Delindex, 1);
        await AsyncStorage.setItem('allRecipie', JSON.stringify(dellRecipie))
        const total = this.state.comments.reduce((acc, curr) =>
            acc + parseFloat(curr.Famount), 0) / 100 * 30
        if (total) {
            if (total > 30) {
                ToastAndroid.show("Recipie flavour should be less then 30ml", ToastAndroid.SHORT)
            }
            else {
                const allRecipie = await AsyncStorage.getItem('allRecipie');
                if (allRecipie) {
                    const allRecipie1 = JSON.parse(allRecipie)
                    console.log("first")
                    allRecipie1.push(this.state.comments)
                    await AsyncStorage.setItem('allRecipie', JSON.stringify(allRecipie1))
                    await this.setState({ comments: [] })
                    ToastAndroid.show("Recipie is edited", ToastAndroid.SHORT)
                }
                else {
                    const allRecipie = [];
                    allRecipie.push(this.state.comments)
                    await AsyncStorage.setItem('allRecipie', JSON.stringify(allRecipie))
                    await this.setState({ comments: [] })
                    ToastAndroid.show("Recipie is edited", ToastAndroid.SHORT)
                }
            }
        }
        else {
            ToastAndroid.show("No flavour is added in recipie yet", ToastAndroid.SHORT)

        }
 
        
    }


    render() {


        return (
            <>
                <ScrollView style={styles.container} >

                    <View style={{ marginTop: Constants.statusBarHeight, backgroundColor: '#202020' }}>
                        <Header
                            statusBarProps={{ barStyle: 'light', backgroundColor: 'black' }}
                            barStyle="light-content" // or d
                            backgroundColor={'#202020'}
                            leftComponent={
                                <TouchableOpacity style={{
                                    alignContent: 'flex-start',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start'
                                }}
                                    onPress={() => { this.props.navigation.goBack(); }}
                                >
                                    <Image
                                        source={require('../assets/FattyFogAssesst/eva_arrow_back_fill.png')}
                                        style={{
                                            width: 25, height: 25,
                                            alignSelf: 'center',
                                        }}></Image>
                                </TouchableOpacity>
                            }
                            centerComponent={
                                <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../assets/FattyFogAssesst/whitelogo1.png')}
                                        style={{
                                            width: 170, height: 70,
                                            marginTop: -25
                                        }}></Image>

                                </View>

                            }
                            containerStyle={{ borderBottomColor: '#85106a', borderBottomWidth: 0, color: 'red' }}
                            style={{ backgroundColor: 'red', elevation: 5 }}
                        />
                    </View>

                    <View style={{
                        width: this.state.pageWidth,
                        height: responsiveHeight(6), backgroundColor: '#202020'
                    }}>
                         <Text style={{
                            color: 'white', 
                            textAlign:'center',
                        }}>PLEASE SELECT UP TO 5 FLAVOURS AND ENTER YOUR PERCENTAGE PER FLAVOUR </Text>
                    </View>

                    <View style={styles.topView}>
                        <View>
                            <Text style={styles.textTop}>Target amount Liquid</Text>
                            <Text style={styles.textTop2}>Amount of liquid you want to make</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.textTop3}>30 </Text>
                            <Text style={[styles.textTop3, { textDecorationLine: 'none' }]}>ml</Text>
                        </View>
                    </View>

                    <View style={styles.flatListViewTotal}>
                        <View style={[styles.flatListEdit2,{width:this.state.pageWidth}]}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: responsiveFontSize(2),
                                    marginLeft: responsiveHeight(2),
                                    fontSize: responsiveFontSize(2)
                                }}

                            >
                                Recipe name 
                                    </Text>

                            <View style={{
                                flexDirection: 'row',
                                marginRight: responsiveHeight(2),
                                width: responsiveWidth(35),
                                height: responsiveHeight(5),
                                alignContent: 'center',
                                justifyContent: 'center', alignItems: 'center',
                                borderRadius: responsiveHeight(1.5),
                            }}>
                                
                                <TextInput
                                    style={{
                                        color: 'white',
                                        fontSize: responsiveFontSize(2),
                                        fontSize: responsiveFontSize(2)
                                    }}
                                
                                     placeholder={'Type here'}
                                        placeholderTextColor={'grey'}
                                        //onSubmitEditing={() => this._password.focus()}
                                        returnKeyType="next"
                                        returnKeyLabel="next"
                                        value={this.state.recipieName}
                                        onChangeText={(text) => {
                                            

                                            this.setState({ recipieName:text });
                                        }}
                                    
                                    />
                            </View>
                        </View>

                    </View>
           

                    <FlatList
                        contentContainerStyle={styles.paragraph}
                        data={this.state.comments}
                        renderItem={({ item, index }) =>
                            // <Text>{item.reply}</Text>
                            <View style={styles.flatListView}>
                                <Image
                                    source={require('../assets/FattyFogAssesst/clarity_edit_solid.png')}
                                    style={{
                                        width: 20, height: 20,
                                        marginLeft: responsiveHeight(2),
                                        marginTop: responsiveHeight(2),
                                    }}></Image>
                                <View style={[styles.flatListEdit,{width:this.state.pageWidth-110}]}>
                                    <TextInput
                                        style={{
                                            color: 'white',
                                            fontSize: responsiveFontSize(2),
                                        }}
                                        placeholder={'Flavor Name'}
                                        placeholderTextColor={'grey'}
                                        //onSubmitEditing={() => this._password.focus()}
                                        returnKeyType="next"
                                        returnKeyLabel="next"
                                        value={item.flavour}
                                        onChangeText={(text) => {
                                            item.flavour = text;

                                            this.setState({ item });
                                        }}
                                    />

                                    <View style={{ flexDirection: 'row', }}>
                                        <TouchableOpacity onPress={() => this.delteMe(index)}>
                                            <Image
                                                source={require('../assets/FattyFogAssesst/fluent_delete_dismiss_24-filled_whitw_colour.png')}
                                                style={{
                                                    width: 18, height: 18,
                                                    marginRight: responsiveHeight(5),
                                                    marginTop: responsiveHeight(2)
                                                }}></Image>
                                        </TouchableOpacity>
                                        <TextInput
                                            style={{
                                                color: 'white',
                                                fontSize: responsiveFontSize(2),
                                                marginRight: responsiveHeight(2),
                                            }}
                                            placeholder={'Amount'}
                                            placeholderTextColor={'grey'}
                                            keyboardType={'numeric'}
                                            returnKeyType="next"
                                            returnKeyLabel="next"
                                            value={item.Famount}
                                            onChangeText={(text) => {
                                                // item.Famount=parseFloat(text);
                                                item.Famount = text;
                                                this.setState({ item });
                                            }}
                                        />

                                        <Text style={{
                                            color: 'white',
                                            fontSize: responsiveFontSize(2),
                                        }}>
                                            %
                                </Text>
                                    </View>
                                </View>

                            </View>

                        }
                    />

                    <View style={{
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                        marginTop: responsiveHeight(5),
                    }}>
                        {/* <View>
                            <TouchableOpacity style={{
                                backgroundColor: '#FB5554',
                                flex: 1, width: 104, height: 42, alignItems: 'center',
                                justifyContent: 'center', alignSelf: 'flex-end',
                                flexDirection: 'row'
                            }}
                                onPress={this.addReply.bind(this)}>
                                <Image
                                    source={require('../assets/FattyFogAssesst/pluse.png')}
                                    style={{ width: 13, height: 13, margin: 5 }}
                                />
                                <Text style={{ fontSize: 16, color: 'white' }}>Flavor</Text>
                            </TouchableOpacity>
                        </View> */}


                        <View style={{ marginRight: responsiveHeight(1) }}>

                        <ModalDropdown ref="dropdown_2"
                                style={styles.dropdown_2}
                                textStyle={styles.dropdown_2_text}
                                dropdownStyle={styles.dropdown_2_dropdown}
                                options={this.state.data}
                                renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                                renderRow={this._dropdown_2_renderRow.bind(this)}
                                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                            >
                                <View style={{
                                    backgroundColor: '#FB5554',
                                    flex: 1, width: 104, height: 42, alignItems: 'center',
                                    justifyContent: 'center', alignSelf: 'flex-end',
                                    flexDirection: 'row'
                                }}
                                // onPress={this.addReply.bind(this)}
                                >
                                     <Image
                                    source={require('../assets/FattyFogAssesst/pluse.png')}
                                    style={{ width: 13, height: 13, margin: 5 }}
                                />
                                <Text style={{ fontSize: 16, color: 'white' }}>Flavor</Text>

                                    <Image
                                        source={require('../assets/FattyFogAssesst/bi_caret_down_fill.png')}
                                        style={{ width: 15, height: 15, margin: 5 }}
                                    />

                                </View>
                            </ModalDropdown>

                        </View>


                    </View>

                    <FlatList
                        contentContainerStyle={styles.paragraph}
                        data={this.state.comments}
                        renderItem={({ item }) =>
                            // <Text>{item.reply}</Text>
                            <View style={styles.flatListViewTotal}>

                                <View style={[styles.flatListEdit2,{width:this.state.pageWidth}]}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: responsiveFontSize(2),
                                            marginLeft: responsiveHeight(2),
                                            fontSize: responsiveFontSize(2)
                                        }}

                                    >
                                        {item.flavour}
                                    </Text>

                                    <View style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#606060', marginRight: responsiveHeight(2),
                                        width: responsiveWidth(35),
                                        height: responsiveHeight(5),
                                        alignContent: 'center',
                                        justifyContent: 'center', alignItems: 'center',
                                        borderRadius: responsiveHeight(1.5),
                                    }}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: responsiveFontSize(2),
                                                fontSize: responsiveFontSize(2)
                                            }}
                                        >
                                            {item.Famount ? (item.Famount / 100 * 30).toFixed(2) : 0}ml
                                    </Text>


                                    </View>
                                </View>

                            </View>
                        }
                    />

                    <View style={styles.flatListViewTotal}>
                        <View style={[styles.flatListEdit2,{width:this.state.pageWidth}]}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: responsiveFontSize(2),
                                    marginLeft: responsiveHeight(2),
                                    fontSize: responsiveFontSize(2)
                                }}

                            >
                                Total
                                    </Text>

                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: '#606060', marginRight: responsiveHeight(2),
                                width: responsiveWidth(35),
                                height: responsiveHeight(5),
                                alignContent: 'center',
                                justifyContent: 'center', alignItems: 'center',
                                borderRadius: responsiveHeight(1.5),
                            }}>
                                {


                                }
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: responsiveFontSize(2),
                                        fontSize: responsiveFontSize(2)
                                    }}
                                >
                                    {

                                        this.state.comments.length > 0
                                            ?


                                            (this.state.comments.reduce((acc, curr) =>

                                                acc + parseFloat(curr.Famount), 0) / 100 * 30
                                            ).toFixed(2)
                                            : 0

                                    }
                                    ml
                                        </Text>
                            </View>
                        </View>

                    </View>

                    <TouchableOpacity
                        onPress={() => this.saveRecipie()}
                        style={{
                            flexDirection: 'row', backgroundColor: '#202020',
                            width: responsiveWidth(25),
                            height: responsiveHeight(7),
                            alignSelf: 'flex-end',
                            margin: responsiveHeight(2),
                            justifyContent: 'center', alignContent: 'center', alignItems: 'center',
                            borderRadius: responsiveHeight(2), marginBottom: responsiveHeight(2)
                        }}>
                        <Image
                            source={require('../assets/FattyFogAssesst/fluent_save_24_filled.png')}
                            style={{ width: 25, height: 25, padding: 5 }}
                        />
                        <Text style={{ color: 'white', fontSize: 17 }}>Save</Text>
                    </TouchableOpacity>
                </ScrollView>
            </>
        );
    }


}

const styles = StyleSheet.create({
    dropdown_2_image: {
        marginRight: responsiveHeight(2),
        width: 15,
        height: 15,
    },
    dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: 'black',
        textAlignVertical: 'center',
    },
    dropdown_2_separator: {
        height: 1,
        backgroundColor: '#959595',
    },
    dropdown_2: {
        alignSelf: 'flex-end',
        width: responsiveWidth(15),
        marginTop: 32,
        right: 8,
        borderWidth: 0,
        borderRadius: 3,
        backgroundColor: '#959595',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
        width: responsiveWidth(10),
        height: 400,
        borderColor: '#959595',
        borderWidth: 2,
        borderRadius: 3,
    },
    dropdown_2_row: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    container: {
        flex: 1,
        backgroundColor: '#303030',
        opacity: 1,
    },
    topView: {
        justifyContent: 'space-between',
        margin: responsiveHeight(2),
        flexDirection: 'row',
    },
    textTop: {
        color: 'white',
        fontSize: responsiveFontSize(2.8),
    },
    textTop2: {
        color: 'white',
        fontSize: responsiveFontSize(1.5),
        marginTop: responsiveHeight(1),
    },
    textTop3: {
        color: 'white',
        fontSize: responsiveFontSize(2.8),
        marginTop: responsiveHeight(1),
        textDecorationLine: 'underline'
    },
    flatListEdit: {
        borderBottomWidth: 1,
        borderBottomColor: '#979797',
       // width: windowWidth - 70,
        marginLeft: responsiveWidth(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flatListEdit2: {
        borderBottomWidth: 1,
        borderBottomColor: '#F6CB5A',
        //width: windowWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flatListView: {
        flexDirection: 'row',
        marginBottom: responsiveHeight(4)
    },
    flatListViewTotal: {
        flexDirection: 'row',
        marginBottom: responsiveHeight(2),
        marginTop: responsiveHeight(2),
    },
    dropdown_2: {
        alignSelf: 'flex-start',
        flexDirection: 'row',

    },
    dropdownIn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown_3_dropdownTextStyle: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: responsiveFontSize(2),
        borderBottomWidth: 1,
        borderColor: '#979797',
    },
    dropdown_2_dropdown: {
        width: responsiveWidth(40),
        height: 200,
        borderWidth: 2,
        borderRadius: 3,
        alignSelf: 'flex-start',
        marginTop: -20,
    },

});
