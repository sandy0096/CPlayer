/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {styles} from './Styles';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    Dimensions,
    TouchableHighlight,
    Image,
    ToastAndroid,
    PermissionsAndroid,
    ImageBackground,
} from 'react-native';

import Slider from 'react-native-slider';

import MusicFiles from 'react-native-get-music-files';

import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AlbumArt from './assets/blank_album.jpg';
import Heat from './assets/Heat.png';

import {
    Container,
    Header,
    Content,
    Footer,
    FooterTab,
    Button,
    Text,
    Title,
    Left,
    Card,
    CardItem,
    Body,
    H3,
    H2,
    List,
    ListItem,
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';

let Sound = require('react-native-sound');
Sound.setCategory('Playback');

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

function Playlist(props) {
    const {state, setSong} = props;
    return (
        <>
            <Content>
                {state.tracks ? (
                    state.tracks.map((x, index) => {
                        return (
                            <ListItem key={index} onPress={() => setSong(index)}>
                                {state.currentTrack === index ? (
                                    <Icon name="play" size={20} />
                                ) : null}
                                <Body>
                                <Text>{x.title}</Text>
                                </Body>
                            </ListItem>
                        );
                    })
                ) : (
                    <H2>No Songs Found</H2>
                )}
            </Content>
        </>
    );
}

function NowPlay(props) {
    const {styles, fxnNext, fxnPrev, press, state, onSlideChange, onShufflerClick} = props;
    console.log("Now Play", state.slider.maxValue, state.slider.currentValue);

    const decidetosetinfiniteloop = () => {
        console.log("Loop Settings ON/OFF", state.setLoop);
        if(state.setLoop){
            state.setLoop = 0;
            state.woosh.stop();
            ToastAndroid.showWithGravity('Loop On', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
        else{
            state.setLoop = 1;
            state.woosh.setNumberOfLoops(-1);
            ToastAndroid.showWithGravity('Loop Off', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
    }

    const setShuffler = () => {
        if(state.setShuffle){
            state.setShuffle = 0;
            // state.woosh.release();
        }
        else{
            state.setShuffle = 1;
            let total = state.total;
            // onShufflerClick(total);
        }
    };

    return (
        <>
            <Content contentContainerStyle={styles.albumBox}>
                <Card style={{width: device_width - 50, height: device_height / 3}}>
                    <CardItem>
                        <Body>
                        <Image
                            source={AlbumArt}
                            style={{width: device_width - 88, height: device_height / 3.4}}
                        />
                        </Body>
                    </CardItem>
                </Card>
                {state.tracks ? (
                    <H3>{state.tracks[state.currentTrack].title}</H3>
                ) : (
                    <H3>No title</H3>
                )}

                <Content contentContainerStyle={styles.seekBar}>
                    <Slider
                        style={{width: device_width - 50, height: 20}}
                        thumbTouchSize={{width: 40, height: 30}}
                        minimumValue={0}
                        step={1}
                        onSlidingComplete={(sec) => onSlideChange(sec)}
                        maximumValue={state.slider.maxValue}
                        value={state.slider.currentValue}
                        minimumTrackTintColor="#000000"
                        maximumTrackTintColor="#f50049"
                        thumbImage={Heat}
                        trackStyle={styles.trackStyle}
                        thumbStyle={styles.thumStyle}
                    />
                </Content>
                <Card style={{width: device_width - 50}}>
                    <CardItem style={{display: 'flex', justifyContent: 'center'}}>
                        <TouchableHighlight
                            onPress={ setShuffler }
                            style={styles.controlChild}>
                            <View>
                                <IconMaterial name={'shuffle'} size={30} color="purple" />
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight onPress={fxnPrev} style={styles.controlChild}>
                            <View>
                                <Icon name={'step-backward'} size={30} color="black" />
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight onPress={press} style={styles.controlChild}>
                            <View>
                                <Icon name={state.icon} size={40} color="black" />
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight onPress={fxnNext} style={styles.controlChild}>
                            <View>
                                <Icon name={'step-forward'} size={30} color="black" />
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            onPress={decidetosetinfiniteloop}
                            style={styles.controlChild}>
                            <View>
                                <IconMaterial name={'loop'} size={30} color="#00C469" />
                            </View>
                        </TouchableHighlight>
                    </CardItem>
                </Card>
            </Content>
        </>
    );
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            woosh: null,
            status: 'pause',
            icon: 'play',
            tracks: null,
            currentTrack: null,
            slider: {maxValue:100, minValue:0, currentValue:0},
            total: 0,
            index: 0,
            setLoop: 0,
            interval:null,
            setShuffle: 0,
        };
    }

    componentDidMount() {
        check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
            .then(result => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        console.log('The permission has not been requested / is denied but requestable');
                        requestExternalStoragePermission();
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        this._getSongs();
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not request able anymore');
                        break;
                }
            })
            .catch(error => {
                console.log('There is some error in requesting permission')
            });
    }

    _shuffler = max => {
        let rand = Math.floor(Math.random() * Math.floor(max));
        this._setWooshPlease(rand);
        this.resetSeek();
    };

    _copySongs = array => {
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

            while (spaces !== directoryPath.length - 1) {
                if (directoryPath[spaces].length > 0) {
                    address = address + '/' + directoryPath[spaces];
                }
                spaces += 1;
            }
            let obj = {
                title: title,
                album: album,
                duration: duration,
                filename: file_name,
                address: address,
            };
            tracks.push(obj);
        });

        this.setState({tracks: tracks, currentTrack: 0, total: tracks.length - 1});

        let whoosh = new Sound(tracks[0].filename, tracks[0].address, error => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            console.log(
                'duration in seconds: ' +
                whoosh.getDuration() +
                'number of channels: ' +
                whoosh.getNumberOfChannels(),
            );
            this.setState({woosh: whoosh});
        });
    };

    _runSeconds = () => {

        let seconds = this.state.slider.currentValue;
        let maxValue = Math.floor(this.state.woosh.getDuration());

        if(seconds >= maxValue){
            this._playNextSong();
        }
        else{
            seconds = seconds += 1;
            let obj = {minValue:0, maxValue:maxValue, currentValue:seconds};
            console.log("These are seconds", this.state.slider.currentValue);
            this.setState({slider:obj});
        }
    }

    _onSlideChange = (seconds) => {
        let maxValue = Math.floor(this.state.woosh.getDuration());
        let obj = {minValue:0, maxValue:maxValue, currentValue:seconds};
        this.state.woosh.setCurrentTime(seconds);
        this.setState({slider:obj});
    }

    _seekStart = () => {
        let interest_interval = setInterval(this._runSeconds, 1000);
        this.setState({interval:interest_interval});
    };

    _seekPause = () => {
        let interval = this.state.interval;
        clearInterval(interval);
        this.setState({interval:null});
    }

    _setWooshPlease = itemNumber => {
        let tracks = this.state.tracks;
        let whoosh = new Sound(
            tracks[itemNumber].filename,
            tracks[itemNumber].address,
            error => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                }
                console.log(
                    'duration in seconds: ' +
                    whoosh.getDuration() +
                    'number of channels: ' +
                    whoosh.getNumberOfChannels(),
                );
                this.setState({woosh: whoosh});
                this.state.woosh.play();
            },
        );
    };

    _playSongUsingIndex = itemNumber => {
        this.state.woosh.release();
        let tracks = this.state.tracks;
        let whoosh = new Sound(
            tracks[itemNumber].filename,
            tracks[itemNumber].address,
            error => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                }
            },
        );
        console.log(
            'duration in seconds: ' +
            whoosh.getDuration() +
            'number of channels: ' +
            whoosh.getNumberOfChannels(),
        );
        this.setState({icon: 'pause', status: 'play', currentTrack: itemNumber});
        // this.state.woosh.play();
        this._setWooshPlease(itemNumber);
        this.resetSeek();
    };

    _getSongs = () => {
        MusicFiles.getAll({})
            .then(tracks => {
                console.log(tracks);
                if (tracks && tracks.length > 0) {
                    this._copySongs(tracks);
                    //  this.setState({currentTrack:0});
                } else {
                    alert('Hah! No songs on this device looser!');
                }
            })
            .catch(error => {
                console.log(error);
                alert('Something went wrong:/');
            });
    };

    handlePress = () => {
        if (this.state.status == 'pause') {
            this.state.woosh.play();
            this._seekStart();

            this.setState({
                status: 'play',
                icon: 'pause',
            });
        } else {
            this.state.woosh.pause();
            this._seekPause();
            this.setState({
                status: 'pause',
                icon: 'play',
            });
        }
    };

    resetSeek = () => {
        let maxValue = Math.floor(this.state.woosh.getDuration());
        let obj = {minValue:0, maxValue:maxValue, currentValue:0};
        this.setState({slider:obj});
    };

    _playNextSong = () => {
        console.log('ran next');
        this.state.woosh.release();

        let total = this.state.total;
        let current = this.state.currentTrack;

        if(this.state.setShuffle){
            this._shuffler(total);
        }

        else{
            if (current < total) {
                current += 1;
            } else if (current === total) {
                current = 0;
            }
            this.setState({currentTrack: current, status: 'play', icon: 'pause'});
            console.log('States', current, total);
            this._setWooshPlease(current);

            this.resetSeek();
        }

    };

    _playPreviousSong = () => {
        this.state.woosh.release();
        let total = this.state.total;
        let current = this.state.currentTrack;


        if(this.state.setShuffle){
            this._shuffler(total);
        }

        else{
            if (current > 0) {
                current -= 1;
            } else if (current === 0) {
                current = total;
            }
            this.setState({currentTrack: current, status: 'play', icon: 'pause'});
            this._setWooshPlease(current);

            this.resetSeek();
        }
    };

    render() {
        return (
            <>
                <Container>
                    <Header style={styles.header}>
                        <Title style={styles.title}>T Player</Title>
                    </Header>
                    {this.state.index === 0 ? (
                        <NowPlay
                            state={this.state}
                            styles={styles}
                            fxnPrev={this._playPreviousSong}
                            fxnNext={this._playNextSong}
                            press={this.handlePress}
                            onSlideChange={this._onSlideChange}
                            onShufflerClick={this._shuffler}
                        />
                    ) : (
                        <Playlist state={this.state} setSong={this._playSongUsingIndex} />
                    )}
                    <Footer>
                        <FooterTab>
                            <Button vertical onPress={() => this.setState({index: 0})}>
                                <Text>Now Playing</Text>
                            </Button>
                        </FooterTab>
                        <FooterTab>
                            <Button vertical onPress={() => this.setState({index: 1})}>
                                <Text>Playlist</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </>
        );
    }
}

export default Main;





