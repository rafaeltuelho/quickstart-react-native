import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  TouchableHighlight,
  Modal
} from 'react-native';

// var RCTFH = require('rct-fh');
var RCTFH = require('rct-fh/RCTFH.android');

export default class HelloWorldRN extends React.Component {

  constructor(props) {
    console.log('App component constructor()');

    super(props);

    this.state = {
      text: 'Simple input',
      message: 'waiting...',
      initMessage: '',
      userInput: '',
      fhConfigParams: '',
      fhCloudHost: '',
      modalVisible: false,
      init: false
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount () {
    console.log('componentDidMount()');
    // After the component mounts we refresh to request data
    this.init();
  }

  sayHello = async () => {
      console.log('sayHello');
      try {
        const result = await RCTFH.cloud({
          "path": "/hello", //only the path part of the url, the host will be added automatically
          "method": "GET", //all other HTTP methods are supported as well. For example, HEAD, DELETE, OPTIONS
          "contentType": "application/json",
          "data": { "hello": this.state.userInput}, //data to send to the server
          "timeout": 25000 // timeout value specified in milliseconds. Default: 60000 (60s)
        });

        console.log('sayHello result', result);
        if (result && result.msg) {
          this.setState({message: result.msg + ' at ' + new Date(parseInt(result.timestamp)) });
          this.setModalVisible(true);
        }
        else {
          this.setState({message: JSON.stringify(result)});
          this.setModalVisible(true);
        }
      } catch (e) {
        console.log('Error: ', e);
        this.setModalVisible(true);
        this.setState({message: 'Error' + e});
      }
    }

    init = async () => {
        try {
          console.log('Initializing FH SDK...');
          this.setState({message: 'Initializing...'});
          // console.debug('init: ', RCTFH, RCTFH.prototype, RCTFH.__proto__);

          const result = await RCTFH.init();
          const cloudHost = await RCTFH.getCloudHost();
          const fhParams = await RCTFH.getFHParams();

          console.log('init result', result);
          //console.log('cloud host: ', cloudHost);
          console.log('fh params: ', fhParams);
          this.setState({initMessage: 'Ready to interact with Cloud Apps served from: '});
          this.setState({fhConfigParams: JSON.stringify(fhParams, null, 2) });
          this.setState({fhCloudHost: cloudHost });

          if (result === 'SUCCESS') {
            console.log('SUCCESS');
            this.setState({init: true});
          } else {
            console.error('Error');
          }
        } catch (e) {
          console.error('Exception', e);
        }
    }

    updateUserInput = async (userInput) => {
      this.setState({userInput: userInput});
    }

    render() {
      return (
        <View style={styles.container}>
          <Text style={styles.h1}>
            Feed Henry - React Native Template (Android)
          </Text>
          <TextInput key='2' style={styles.input} autoCapitalize = 'none'
            onSubmitEditing={(event) => this.updateUserInput(event.nativeEvent.text)}
            onEndEditing={(event) => this.updateUserInput(event.nativeEvent.text)}
            onChangeText={(text) => this.updateUserInput(text)}
            placeholder='Enter Your Name Here'
            placeholderTextColor='grey'
          />

          <Button style={styles.button}
          disabled={!this.state.init}
          onPress={this.sayHello}
          title="Say Hello From The Cloud"
          accessibilityLabel="Say Hello From The Cloud"
          />

          <View style={{flex: 2, flexDirection: 'row', alignItems: 'flex-start'}}>
            <Text style={styles.initMessage}>
              {this.state.initMessage}
              <Text>
                {`\n\n`}
                <Text style={styles.monoText}>
                  {this.state.fhCloudHost}
                </Text>
                <Text>
                  {`\n\n`} using the following params: {`\n\n`}
                  <Text style={styles.monoText}>
                    {this.state.fhConfigParams}
                  </Text>
                </Text>
              </Text>
            </Text>

          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
           <View style={{
              flex: 1,
              flexDirection: 'column',
              margin: 4,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <View style={styles.modal}>
              <Text style={styles.message}>
                {this.state.message}
              </Text>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible)
              }}>
                <Text style={{color:'black',}}>Close</Text>
              </TouchableHighlight>

            </View>
           </View>
          </Modal>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container_1: {
    paddingTop: 23,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    paddingTop: 23,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
      margin: 30,
      height: 60,
      width:240,
      padding: 4,
      fontSize: 18,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 8,
      color: 'black'
   },
  h1: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  message: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    color: 'grey',
  },
  initMessage: {
    flex: 1,
    height: 260,
    fontSize: 14,
    textAlign: 'left',
    margin: 10,
    color: 'grey',
    borderWidth: 1,
    borderColor: 'grey',
  },
  monoText: {
    fontSize: 10,
    fontFamily: 'monospace',
    textAlign: 'left',
    margin: 3,
    color: 'blue',
  },
  modal: {
    alignItems: 'center',
    margin: 4,
    height: 100,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('HelloWorldRN', () => HelloWorldRN);
