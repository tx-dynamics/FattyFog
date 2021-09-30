import React, { Component } from "react";
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
  Share,
} from "react-native";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import Constants from "expo-constants";
import { Header, Avatar, colors } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { ToastAndroid } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
export default class SavedRecipies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      modelData: [],
    };

    this.arrayNew = [];
  }
  componentDidMount = async () => {
    this.loadData();
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.loadData();
    });
  };
  async loadData() {
    const allRecipie = await AsyncStorage.getItem("allRecipie");
    if (allRecipie) {
      let allRecipie1 = JSON.parse(allRecipie);
      let allRecipie2 = allRecipie1.reverse();

      this.setState({
        showRecipies: allRecipie2,
      });
      this.arrayNew = allRecipie2;
    }
  }

  searchItems = (text) => {
    let newData = this.arrayNew.filter((item) => {
      const itemData = `${item[0].recipieName.toUpperCase()}`;
      const textData = text.toUpperCase();
      if (text.length > 0) {
        return itemData.indexOf(textData) > -1;
      }
    });
    this.setState({
      showRecipies: newData,
      value: text,
    });
    if (text.length < 1) {
      this.setState({
        showRecipies: this.arrayNew,
      });
    }
  };

  onShare = async (item, index) => {
    try {
      let datahtml = `
Recipie name : ${item[0].recipieName} 
`;
      let data = "";
      {
        item.map((element, index) => {
          data =
            data +
            "\n" +
            "Flavour  " +
            [index + 1] +
            " : " +
            element.flavour +
            "\nFlavour Amount : " +
            (element.Famount / 100) * 30 +
            "ml";
        });
      }

      const result = await Share.share({
        message: datahtml + data,
      });
      console.log("Test", item);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  delteMe = async (index) => {
    const { showRecipies } = this.state;
    showRecipies.splice(index, 1);
    this.setState({ showRecipies, modalVisible: false });
    ToastAndroid.show("Recipie is deleted", ToastAndroid.SHORT);
    let allRecipie2 = showRecipies.reverse();
    await AsyncStorage.setItem("allRecipie", JSON.stringify(allRecipie2));
  };

  render() {
    return (
      <>
        <ScrollView style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({ modalVisible: false });
            }}
          >
            <View
              style={{
                width: windowWidth - 30,
                height: windowHeight / 1.5,
                borderRadius: responsiveHeight(4),
                alignSelf: "center",
                backgroundColor: "#303030",
                elevation: 20,
                marginTop: responsiveHeight(20),
              }}
            >
              <View
                style={{
                  width: "95%",
                  marginTop: responsiveHeight(4),
                  height: "90%",
                  borderColor: "#F6CB5A",
                  borderWidth: 1,
                  alignSelf: "center",
                  borderRadius: responsiveHeight(4),
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 22,
                    fontWeight: "500",
                    padding: responsiveHeight(2),
                    marginTop: responsiveHeight(0),
                  }}
                >
                  Recipe Name
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    paddingLeft: responsiveHeight(2),
                    color: "#F6CB5A",
                  }}
                >
                  Flavor:
                </Text>

                <FlatList
                  data={this.state.modelData}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        marginLeft: windowWidth / 7,
                        marginTop: responsiveHeight(2),
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "white" }}>
                        {item.flavour}:
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "white",
                          paddingRight: responsiveWidth(3),
                        }}
                      >
                        {(item.Famount / 100) * 30}ml{" "}
                      </Text>
                    </View>
                  )}
                  ItemSeparatorComponent={this.renderSeparator}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: responsiveHeight(8),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      paddingLeft: responsiveHeight(2),
                      color: "#F6CB5A",
                    }}
                  >
                    Total:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "white",
                      paddingRight: responsiveWidth(3),
                    }}
                  >
                    {" "}
                    {this.state.modelData.length > 0
                      ? (
                          (this.state.modelData.reduce(
                            (acc, curr) => acc + parseFloat(curr.Famount),
                            0
                          ) /
                            100) *
                          30
                        ).toFixed(2)
                      : 0}
                    ml{" "}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.delteMe(this.state.modelIndex)}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#202020",
                      width: responsiveWidth(25),
                      height: responsiveHeight(6),
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: responsiveHeight(2),
                      marginBottom: responsiveHeight(2),
                    }}
                  >
                    <Image
                      source={require("../assets/FattyFogAssesst/fluent_delete_dismiss_24_filled.png")}
                      style={{ width: 20, height: 20, margin: 5 }}
                    />
                    <Text style={{ color: "white", fontSize: 14 }}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#202020",
                      width: responsiveWidth(25),
                      height: responsiveHeight(6),
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: responsiveHeight(2),
                      marginBottom: responsiveHeight(2),
                    }}
                    onPress={() =>
                      this.props.navigation.navigate("EditRecipie", {
                        Item: this.state.modelData,
                      })
                    }
                  >
                    <Image
                      source={require("../assets/FattyFogAssesst/Edit_icon_yellow.png")}
                      style={{ width: 20, height: 20, margin: 5 }}
                    />
                    <Text style={{ color: "white", fontSize: 14 }}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View
            style={{
              marginTop: Constants.statusBarHeight,
              backgroundColor: "#202020",
            }}
          >
            <Header
              statusBarProps={{ barStyle: "light", backgroundColor: "black" }}
              barStyle="light-content" // or d
              backgroundColor={"#202020"}
              containerStyle={{
                borderBottomWidth: 0,
              }}
              leftComponent={
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    width: windowWidth / 2,
                  }}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                >
                  <Image
                    source={require("../assets/FattyFogAssesst/eva_arrow_back_fill.png")}
                    style={{
                      width: 25,
                      height: 25,
                      alignSelf: "center",
                    }}
                  ></Image>
                  <Text style={styles.toptext}>Saved Recipes</Text>
                </TouchableOpacity>
              }
            />
          </View>

          <View style={styles.bottomView}>
            <View
              style={{
                flexDirection:'row',
                width: windowWidth - 40,
                height: windowHeight / 11,
                borderColor: "#000",
                alignSelf: "center",
                backgroundColor: "#424242",
                borderRadius: responsiveWidth(5),
                elevation: 25,
                marginTop: responsiveHeight(2),
                marginBottom: responsiveHeight(2),
                justifyContent: "space-between",
                alignContent: "center",
              }}
            >
              <TextInput
                style={{
                  color: "white",
                  //alignSelf: "center",
                  fontSize: responsiveFontSize(2),
                  padding: responsiveHeight(2),
                }}
                placeholder="Type Recipie Name Here..."
                placeholderTextColor={"white"}
                onChangeText={(text) => this.searchItems(text)}
                value={this.state.value}
              />
                <FontAwesome name="search" 
                size={24} color="white" 
                style={{alignSelf:'center',marginRight:responsiveHeight(2)}}
                />

            </View>
            <FlatList
              data={this.state.showRecipies}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.listView}
                  onPress={() => {
                    this.setState({
                      modalVisible: true,
                      modelData: item,
                      modelIndex: index,
                    });
                  }}
                >
                  <Text style={styles.listViewText}>{item[0].recipieName}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={() => this.onShare(item, index)}
                      style={{
                        marginRight: responsiveWidth(2),
                        alignSelf: "center",
                      }}
                    >
                      <Entypo name="share" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        alignSelf: "center",
                      }}
                      onPress={() =>
                        this.props.navigation.navigate("EditRecipie", {
                          Item: item,
                        })
                      }
                    >
                      <Image
                        source={require("../assets/FattyFogAssesst/clarity_edit_solid.png")}
                        style={{
                          width: 20,
                          height: 21,
                          alignSelf: "center",
                        }}
                      ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        alignSelf: "center",
                      }}
                      onPress={() => this.delteMe(index)}
                    >
                      <Image
                        source={require("../assets/FattyFogAssesst/fluent_delete_dismiss_24_filled.png")}
                        style={{
                          width: 20,
                          height: 21,
                          alignSelf: "center",
                          margin: responsiveHeight(2),
                        }}
                      ></Image>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
            />
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
  },
  toptext: {
    color: "white",
    fontSize: responsiveFontSize(2.5),
    paddingLeft: responsiveWidth(3),
    alignSelf: "center",
  },
  flatlistTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flatlistTopText: {
    color: "white",
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(10),
    paddingLeft: responsiveWidth(6),
  },
  flavorView: {
    backgroundColor: "#424242",
    width: windowWidth - 40,
    height: windowHeight / 3,
    borderRadius: responsiveWidth(5),
    alignSelf: "center",
    elevation: 20,
    marginTop: responsiveHeight(2),
    justifyContent: "center",
  },
  roundView: {
    backgroundColor: "white",
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    alignSelf: "center",
    justifyContent: "center",
  },
  textbox1: {
    color: "white",
    fontSize: responsiveFontSize(2.2),
    textAlign: "center",
    marginTop: responsiveHeight(2),
  },
  listView: {
    flexDirection: "row",
    backgroundColor: "#424242",
    width: windowWidth - 40,
    height: windowHeight / 11,
    borderRadius: responsiveWidth(5),
    alignSelf: "center",
    elevation: 25,
    opacity: 1,
    marginTop: responsiveHeight(2),
    justifyContent: "space-between",
    alignContent: "center",
    marginBottom: responsiveHeight(2),
  },
  listViewText: {
    color: "white",
    fontSize: responsiveFontSize(2),
    paddingLeft: responsiveWidth(6),
    alignSelf: "center",
  },
  bottomView: {
    marginBottom: responsiveHeight(2),
  },
});
