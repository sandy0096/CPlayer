/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Dimensions,
  TouchableHighlight,
  Image,
  PermissionsAndroid
} from 'react-native';
// import Slider from '@react-native-community/slider';
import MusicFiles from 'react-native-get-music-files';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AlbumArt from './../assets/blank_album.jpg';
import { Container, Header, Content, Footer, FooterTab, Button, Text, Title, Left, Card, CardItem, Slider, Body } from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

var Sound = require('react-native-sound');
Sound.setCategory('Playback');

// var RNFS = require('react-native-fs');

const device_height = Math.round(Dimensions.get('window').height);
const device_width = Math.round(Dimensions.get('window').width);

async function requestExternalStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Cool External Storage Permission',
        message:
          'Cool Music App needs access to your storage ' +
          'so you can play music',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You have us Permission');
    } else {
      console.log('You not permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

function NowPlay(props){
  const {styles, fxnNext, fxnPrev, press, state} = props;
  return(
    <>
    <Content contentContainerStyle={styles.albumBox}>
              <Card style={{width: device_width - 50, height: device_height/3 }}>
                <CardItem>
                  <Body>
                    <Image source={AlbumArt} style={{width:device_width - 88, height:device_height/4}}/>
                  </Body>
                </CardItem>
              </Card>
            </Content>
          <Content contentContainerStyle={styles.playDesk}>
           
          <Card style={{width: device_width - 50}}>
          <CardItem style={{display:'flex', alignItems:'center', justifyContent:'center'}}>

        <TouchableHighlight onPress={fxnPrev} style={styles.controlChild}>
            <View>
              <Icon name={'step-backward'} size={30} color="black"/>
            </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={press} style={styles.controlChild}>
            <View>
              <Icon name={state.icon} size={40} color="black"/>
            </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={fxnNext} style={styles.controlChild}>
            <View>
              <Icon name={'step-forward'} size={30} color="black"/>
            </View>
        </TouchableHighlight>
    
          </CardItem>
        </Card>
          </Content>
          </>
  )
}

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      woosh: null,
      status: 'pause',
      icon: 'play',
      tracks:null,
      currentTrack:null,
      total:0,
      index:0
    }
  }
  
  componentDidMount(){
    
    check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          requestExternalStoragePermission();
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          this._getSongs();
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          
          break;
      }
    })
    .catch(error => {
      // …
    });
  }

  _copySongs = (array) => {

    let tracks = [];
    // console.log("Array in copy Songfs", array[0].path)
    array.map(it => {
      let x = it.path;
      let directoryPath = x.split('/');
      // console.log(directoryPath);

      //Small code for some work
      let spaces = 0;
      let address = '';
      let file_name = it.fileName;
      let title = it.title;
      let album = it.album;
      let duration = it.duration;

      while(spaces !== directoryPath.length - 1){
          if(directoryPath[spaces].length > 0){
            address = address + "/" + directoryPath[spaces];
        }
        spaces +=1;
      }
    let obj = {title:title, album:album, duration:duration, filename:file_name, address:address};
    tracks.push(obj);

    })

    this.setState({tracks:tracks, currentTrack:0, total:(tracks.length)-1});

    let whoosh = new Sound(tracks[0].filename, tracks[0].address, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
      this.setState({woosh:whoosh});
    })
  
  }

  _setWooshPlease = (itemNumber) => {
    let tracks = this.state.tracks;
    let whoosh = new Sound(tracks[itemNumber].filename, tracks[itemNumber].address, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
      this.setState({woosh:whoosh});
      this.state.woosh.play();
    })
  }

  _getSongs = () => {
    MusicFiles.getAll({
         }).then(tracks => {
           console.log(tracks);
           if(tracks && tracks.length > 0){
             this._copySongs(tracks);
            //  this.setState({currentTrack:0});
           }
           else{
             alert('Hah! No songs on this device looser!');
           }
         }).catch(error => {
         console.log(error);
         alert('Something went wrong:/')
    })
  }

  handlePress = () => {
    if(this.state.status == 'pause'){
      this.state.woosh.play();
      this.setState({
        status: 'play',
        icon: 'pause'
      })
    }
    else{
      this.state.woosh.pause();
      this.setState({
        status: 'pause',
        icon: 'play',
      })
    }
  }

  _playNextSong = () => {
    console.log('ran next');
    this.state.woosh.release();
    
      let total = this.state.total;
      let current = this.state.currentTrack;
      
        if(current < total){
          current += 1;
        }
        else if(current === total){
          current = 0;
        }
        this.setState({currentTrack:current, status:'play', icon:'pause'})
        console.log('States', current, total);
        this._setWooshPlease(current);
      
  };

  _playPreviousSong = () => {
    console.log('ran previous')
    this.state.woosh.release();
      let total = this.state.total;
      let current = this.state.currentTrack;
      if(current > 0){
        current -= 1;
      }
      else if(current === 0){
        current = total;
      }
      this.setState({currentTrack:current, status:'play', icon:'pause'});
      this._setWooshPlease(current);

  };

  render() {
    return (
      <Container>
          <Header style={styles.header}>
            <Title style={styles.title}>C Player</Title></Header>
            {this.state.index === 0 ? 
            <NowPlay 
               state={this.state}
               styles={styles}
               fxnPrev={this._playPreviousSong}
               fxnNext={this._playNextSong}
               press={this.handlePress}

            /> : null}
        <Footer>
          <FooterTab><Button onPress={() => this.setState({index:0})}><Text>Now Playing</Text></Button></FooterTab>
          <FooterTab><Button onPress={() => this.setState({index:1})}><Text>Select</Text></Button></FooterTab>
        </Footer>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  albumBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'center',
    justifyContent:'center'
  
  },
  header:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
  },
  title: {
    fontSize: 20,
  },
  playDesk:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  controlChild:{
    marginLeft:20,
    marginRight:20,    
  }
});