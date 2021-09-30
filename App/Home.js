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
  Alert,
  ToastAndroid,
  Share,
} from "react-native";

import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import * as Print from "expo-print";
import Constants from "expo-constants";
import { Header, Avatar, colors } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import * as ScreenOrientation from "expo-screen-orientation";
import { Entypo } from "@expo/vector-icons";
import { connectFirebase } from "../App/firbase/firaseconfig";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      showRecipies: [],
      modelData: [],
    };
  }
  componentDidMount = async () => {
    connectFirebase();
    this.loadData();

    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.loadData();
      //Put your Data loading function here instead of my this.loadData()
    });
  };

  async loadData() {
    const allRecipie = await AsyncStorage.getItem("allRecipie");
    if (allRecipie) {
      let allRecipie1 = JSON.parse(allRecipie);
      let allRecipie2 = allRecipie1.reverse();
      let allRecipie3 = allRecipie2.slice(0, 5);
      this.setState({
        showRecipies: allRecipie3,
        modalVisible: false,
      });
      console.log("OKK pak", this.state.showRecipies);
    }
  }

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
                        {item.flavour}:{" "}
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
                    ml
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
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
                    onPress={() => this.delteMe(this.state.modelIndex)}
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
              leftComponent={
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Login");
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: responsiveFontSize(2),
                      fontWeight: "bold",
                    }}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>
              }
              rightComponent={
                <TouchableOpacity
                  style={{
                    alignContent: "flex-start",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("SavedRecipies");
                  }}
                >
                  <Image
                    source={require("../assets/FattyFogAssesst/fluent_save_24_filled.png")}
                    style={{
                      width: 25,
                      height: 25,
                      // marginTop: -25
                    }}
                  ></Image>
                </TouchableOpacity>
              }
              centerComponent={
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../assets/FattyFogAssesst/whitelogo1.png")}
                    style={{
                      width: 170,
                      height: 70,
                      marginTop: -25,
                    }}
                  ></Image>
                </View>
              }
              containerStyle={{
                borderBottomColor: "#85106a",
                borderBottomWidth: 0,
                color: "red",
              }}
              style={{ backgroundColor: "red", elevation: 5 }}
            />
          </View>

          <Text style={styles.toptext}>E-JUICE CALCULATOR</Text>
          <TouchableOpacity
            style={styles.flavorView}
            onPress={() => {
              this.props.navigation.navigate("CreateNewRecipie");
            }}
          >
            <View style={styles.roundView}>
              <Image
                source={require("../assets/FattyFogAssesst/bottle1.png")}
                style={{
                  width: 50,
                  height: 90,
                  alignSelf: "center",
                }}
              ></Image>
            </View>
            <Text style={styles.textbox1}>Flavor Calculation</Text>
          </TouchableOpacity>
          <View style={styles.bottomView}>
            <View style={styles.flatlistTop}>
              <Text style={styles.flatlistTopText}>Recently Saved</Text>
              <Text
                onPress={() => {
                  this.props.navigation.navigate("SavedRecipies");
                }}
                style={[
                  styles.flatlistTopText,
                  { paddingRight: responsiveWidth(6) },
                ]}
              >
                See all
              </Text>
            </View>
            <FlatList
              style={{ marginBottom: responsiveHeight(2) }}
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
                      onPress={() =>
                        this.props.navigation.navigate("EditRecipie", {
                          Item: item,
                          index: index,
                        })
                      }
                      style={{
                        alignSelf: "center",
                      }}
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
    opacity: 1,
  },
  toptext: {
    color: "white",
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(15),
    paddingLeft: responsiveWidth(6),
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
  },
  listViewText: {
    color: "white",
    fontSize: responsiveFontSize(2),
    paddingLeft: responsiveWidth(6),
    alignSelf: "center",
  },
});
