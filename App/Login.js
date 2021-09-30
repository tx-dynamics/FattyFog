import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import { ActivityIndicator } from 'react-native-paper';
import { signIn } from '../App/firbase/firebaseFunctions';
import { connectFirebase } from "../App/firbase/firaseconfig";
export default class Login extends Component {
  state = {
    email: '',
    password: '',
    loader: false,
    secured: true,
    lat:'',
    lng:'',
    ErrorMessege:''
  };
  async componentDidMount() {
    connectFirebase()
  }
  async LoginFn() {
    let success = await signIn(this.state.email, this.state.password);
    if (success) {
     
     this.props.navigation.navigate('FlovourAdd');
    }
    else{
      await this.setState({loader: false})
    }

  }
  async ValidationFn() {
    this.setState({ loader: true, ErrorMessege: '' });
    let TempCheck = await this.CheckValidateFn();

    switch (TempCheck) {
      case 0:
        this.LoginFn();
        break;
      case 1:
        this.setState({ loader: false });
        // alert(this.state.ErrorMessege);
        break;
      default:
        break;
    }
  }
  async CheckValidateFn() {
    //EmailCheck
    let reg2 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg2.test(this.state.email) === false) {
      console.log('Email is Not Correct');
      this.state.email !== undefined && this.state.email !== ''
        ? this.setState({ ErrorMessege: 'Please enter proper Email Id' })
        : this.setState({ ErrorMessege: 'Email cannot be empty' });
      // this.setState({ email: text })
      return 1;
    }

    
    return 0;
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#000"
          barStyle="light-content"
          translucent
        />
        <ScrollView style={{ marginBottom: 10 }}>
          <View style={styles.header}>
            <Text style={styles.headertext1}>Login</Text>
          </View>
          <View style={styles.bottomView}>


            <TextInput
              style={styles.textinput}
              placeholder={'Email'}
              placeholderTextColor={'grey'}
              onSubmitEditing={() => this._password.focus()}
              returnKeyType="next"
              returnKeyLabel="next"
              value={this.state.email}
              onChangeText={(text) => {
                this.setState({ email: text });
              }}
            />

            <TextInput
              ref={(input) => this._password = input}

              style={styles.textinput}
              secureTextEntry={this.state.secured}
              placeholder={'password'}
              placeholderTextColor={'grey'}
              value={this.state.password}
              onChangeText={(text) => {
                this.setState({ password: text });
              }}
            />

            <Text style={{ textAlign: 'center', color: 'red', fontSize: responsiveFontSize(2) }}>{this.state.ErrorMessege}</Text>
          </View>

          <TouchableOpacity
            style={styles.button1}
            onPress={() => {
              this.ValidationFn();
           //   this.props.navigation.navigate('TabBar', { screen: 'Home' });
            }}>
            {
              this.state.loader ?
                <ActivityIndicator size={'small'} color={'black'} />
                :
                <Text style={[styles.buttonText, { color: '#000' }]}>Login</Text>
            }

          </TouchableOpacity>
         
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303030',
  },
  
  buttonImageIconStyle: {
    //padding: 10,
    //margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  buttonTextStyle: {
    color: '#fff',
    //marginBottom: 4,
    marginLeft: responsiveHeight(4),
    textAlign: 'center',
    fontSize: responsiveFontSize(1.7)
  },
  buttonIconSeparatorStyle: {
    backgroundColor: '#fff',
    width: 1,
    height: 40,
  },
  header: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: responsiveHeight(15),
    marginTop: responsiveHeight(10)
  },
  text: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#4f95e0',
  },
  text1: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#4f95e0',
  },
  headertext: {
    fontSize: responsiveFontSize(4),
    //fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white'
  },
  headertext1: {
    fontSize: 24,
    alignSelf: 'center',
    color:'white',
    fontWeight: '700'
  },
  bottomView: {
    //height: responsiveHeight(32),
    width: responsiveWidth(90),
    alignSelf: 'center',
    //borderRadius: responsiveWidth(2),
    //backgroundColor: '#fff',
    elevation: 1,
    marginTop: responsiveWidth(5),
  },
  label: {
    marginLeft: responsiveWidth(5),
    marginTop: responsiveWidth(5),
    fontSize: responsiveFontSize(1.8),
  },
  textInputContainer: {
    borderBottomWidth: responsiveWidth(0.3),
    borderColor: 'grey',
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textinput: {
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    height: responsiveHeight(7),
    margin: responsiveHeight(1),
    padding: responsiveHeight(2),
  },

  textView: {
    //flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveWidth(5),
    width: responsiveWidth(90),
    alignSelf: 'center',
  },

  button1: {
    height: responsiveHeight(7.5),
    width: responsiveWidth(42),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginTop: responsiveWidth(1),
  },
  buttonText: {
    fontSize: 18,
    color: 'grey',
    fontWeight: '400',
  },
  orText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: responsiveFontSize(3.4),
  }
});
