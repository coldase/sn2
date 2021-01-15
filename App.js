import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import {Audio} from 'expo-av';
import SongBtn from "./components/SongBtn";

const max_songs = 15;

// Make "snmusic" folder under Music

export default function App() {  
  const [nimi, setNimi] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState("-");
  const [sound, setSound] = useState();
  const [count, setCount] = useState(0);
  const [permissionStatus, setStatus] = useState();
  const song_buttons = [];
  const sounds = [];
  

  //Get permissions for MEDIA_LIBRARY
  const getPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status === 'granted')  {
      setStatus("granted");
    }
    else {
      console.log('Permissions denied!');
    }
  }
  
  // Get audio files from MediaLibrary                                                                         
  const get_sounds = async() => {
    
    if (sounds.length === 0){
      const albumi = await MediaLibrary.getAlbumAsync("snmusic");
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        album: albumi
      });
      for (let i=0; i<media.assets.length; i++){
        if (i < max_songs){
          sounds.push(media.assets[i]);
        }
      }
      setCount(sounds.length);
    }
  } 
  
  //Push "sounds.length" times buttons to song_buttons array - MAKE ERROR CHECK 
  const add_buttons = () => {
    for (let i=0;i<count;i++){
      song_buttons.push(<SongBtn button_id={i} key={i} play={(test) => play_sound(i)}/>);
    }
  }
  
  //Plays audio files, - MAKE ERROR CHECK
  const play_sound = async (song_index) => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(sounds[song_index]);
    setSound(sound);
    setCurrentlyPlaying(sounds[song_index]["filename"])
    console.log('Playing Sound');
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound 
    ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
    }
    : undefined;
  }, [sound]);
  
  if (permissionStatus === 'granted'){
    get_sounds();
    add_buttons();
  }
  else if (permissionStatus !== 'granted'){
    getPermissions();
  }
  
  return (
    <View style={styles.container}>
        <StatusBar/>
        <View style={styles.top}>
          <Text style={styles.headertext}>Sävelnappi</Text>
        </View>
        
        <Text style={{textAlign: "center"}}>Playing:</Text>
        <Text style={styles.currentSong}>{currentlyPlaying}</Text>
        <View style={styles.bottom}>
          {song_buttons}
        </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#bae1ff",
    flex: 1,
  },
  currentSong:{
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 20
  },
  bottom: {
    height: "50%",
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "center",
    padding: 1,
  },
  top:{
    marginTop: 30,
    justifyContent: "center",
  },
  headertext:{
    paddingTop: "5%",
    fontWeight: "bold",
    fontSize: 50,
    textAlign: 'center',
    shadowColor: "#000",
    color: "#fff",
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 10,
    textShadowColor: "#000"
  }
});