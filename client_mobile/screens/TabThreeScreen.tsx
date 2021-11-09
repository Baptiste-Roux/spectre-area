import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet } from 'react-native';
import * as AppAuth from 'expo-app-auth';
import { google } from 'react-native-simple-auth';
import * as GoogleSignIn from 'expo-google-sign-in';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      ip: '',
      uid: '',
      jwt: '',
      user: null,
    };
  }
  auth_id = '';
  componentDidMount() {
    this.initAsync();
  }

  fetchregister(usernames, passwords) {
        return fetch("http://" + this.state.ip + ":8080/api/v1/users", {
         method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           username: usernames,
           password: passwords
         })
       }).then(response => {
         if(response.status >= 400) {
           this.fetchlogin(usernames, passwords).then(test => {
             if (test == null) {
               return(null);
            }
               this.setState({uid: test.uid, jwt: test.token});
               let mtoken = this.state.jwt;
               let ipp = this.state.ip;
               const setLoginLocal = async () => {
                 try {
                   await AsyncStorage.setItem('jwt', mtoken);
                   await AsyncStorage.setItem('ip', ipp);
                 } catch (err) {
                   console.log(err);
                 }
               };
               setLoginLocal().then(this.props.navigation.replace('tabthree'));
             });
           }
          return(response.json())
      })
      // .catch(err => {
      //   Alert.alerte("Login")
      //   this.fetchlogin(usernames, passwords).then(test => {
      //     this.setState({uid: test.uid, jwt: test.token});
      //     let mtoken = this.state.token;
      //     let ipp = this.state.ip;
      //     const setLoginLocal = async () => {
      //       try {
      //         await AsyncStorage.setItem('jwt', mtoken);
      //         await AsyncStorage.setItem('ip', ipp);
      //       } catch (err) {
      //         console.log(err);
      //       }
      //     };
      //     // setLoginLocal().then(this.props.navigation.replace('tabthree'));
      //   });
  }
  fetchlogin(usernames, passwords) {
      return fetch("http://" + this.state.ip + ":8080/api/v1/login", {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         username: usernames,
         password: passwords
       })
     }).then(response => {
       if(response.status >= 400) {
         this.fetchregister(usernames, passwords).then(test => {
           if (test == null) {
             return(null);
          }
             this.setState({uid: test.uid, jwt: test.token});
             let mtoken = this.state.jwt;
             let ipp = this.state.ip;
             const setLoginLocal = async () => {
               try {
                 await AsyncStorage.setItem('jwt', mtoken);
                 await AsyncStorage.setItem('ip', ipp);
               } catch (err) {
                 console.log(err);
               }
             };
             setLoginLocal().then(this.props.navigation.replace('tabthree'));
           });
         }
        return(response.json())
    })
  }

  onLogin() {
    const { username, password } = this.state;
    if (username =="" || password == "")
        Alert.alert('Credentials null');
    else {
      this.fetchlogin(this.state.username, this.state.password).then(test => {
        if (test == null) {
          return(null);
       }
        this.setState({uid: test.uid, jwt: test.token});
        let mtoken = this.state.jwt;
        let ipp = this.state.ip;
        const setLoginLocal = async () => {
          try {
            await AsyncStorage.setItem('jwt', mtoken);
            await AsyncStorage.setItem('ip', ipp);
          } catch (err) {
            console.log(err);
          }
        };
        setLoginLocal().then(this.props.navigation.replace('tabthree'));
      });
    }
  }

  onRegister() {
    const { username, password } = this.state;
    if (username =="" || password == "")
        Alert.alert('Credentials null');
    else{
        this.fetchregister(username, password).then(test => {
          if (test == null) {
           return(null);
         }
          this.setState({uid: test.uid, jwt: test.token});
          let mtoken = this.state.jwt;
          let ipp = this.state.ip;
          const setLoginLocal = async () => {
            try {
              await AsyncStorage.setItem('jwt', JSON.stringify(mtoken));
              await AsyncStorage.setItem('ip', JSON.stringify(ipp));
            } catch (err) {
              console.log(err);
            }
          };
          setLoginLocal().then(this.props.navigation.replace('tabthree'));
      });
    }
  }

    initAsync = async () => {
        await GoogleSignIn.initAsync({
          // You may ommit the clientId when the firebase `googleServicesFile` is configured
          clientId: '992865628420-r8jabc51mcm60711nv53btvdhh5vnpu6.apps.googleusercontent.com',
        });
        this._syncUserWithStateAsync();
      };

      _syncUserWithStateAsync = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync();
        this.setState({ user });
      };

      signOutAsync = async () => {
        await GoogleSignIn.signOutAsync();
        this.setState({ user: null });
      };

      signInAsync = async () => {
        try {
          await GoogleSignIn.askForPlayServicesAsync();
          const { type, user } = await GoogleSignIn.signInAsync();
          if (type === 'success') {
            this._syncUserWithStateAsync()
          }
        } catch ({ message }) {
          alert('login: Error:' + message);
        }
      };

      onPress = () => {
         if (this.state.user) {
           this.signOutAsync();
         } else {
           this.signInAsync();
         }
       };
       onConnect = () => {
         let myvar =  GoogleSignIn.getCurrentUser();
         let mvalue = JSON.stringify(myvar);
         user = JSON.parse(mvalue);
         this.fetchregister(user.uid, user.uid).then(test => {
           if (test == null) {
             Alert.alert("null")
            return;
          }
           this.setState({uid: test.uid, jwt: test.token});
           let mtoken = this.state.jwt;
           let ipp = this.state.ip;
           const setLoginLocal = async () => {
             try {
               await AsyncStorage.setItem('jwt', JSON.stringify(mtoken));
               await AsyncStorage.setItem('ip', JSON.stringify(ipp));
             } catch (err) {
               console.log(err);
               Alert.alert(err);
             }
           };
           // setLoginLocal().then(this.props.navigation.replace('tabthree'));
         });
       }

  render() {

    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.ip}
          onChangeText={(ip) => this.setState({ ip })}
          placeholder={'server ip'}
          style={styles.input}
        />
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />

        <Button
          title={'Login'}
          style={styles.input}
          onPress={this.onLogin.bind(this)}
        />
        <Button
          title={'register'}
          style={styles.submitButton}
          onPress={this.onRegister.bind(this)}
        />
        <Button
          title={'google link'}
          style={styles.input}
          onPress={this.onPress.bind(this)}
        />
        <Button
          title={'google connect'}
          style={styles.input}
          onPress={this.onConnect.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
