import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import {Audio} from 'expo-av';
import SongBtn from "./components/SongBtn";

const max_songs = 15;
let playing = false;

export default function App() {  
  const [currentlyPlaying, setCurrentlyPlaying] = useState("");
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
  // if songs in "snmusic" folder, takes songs from there
  // else if "snmusic" not exist, takes songs from "Music" folder
  // if "Music" folder is empty, no buttons in app
  const get_sounds = async() => {
    if (sounds.length === 0){
      const sn_albumi = await MediaLibrary.getAlbumAsync("snmusic");
      if(sn_albumi){
        const media = await MediaLibrary.getAssetsAsync({
          album: sn_albumi,
          mediaType: MediaLibrary.MediaType.audio
        });
        for (let i=0; i<media.assets.length; i++){
          if (i < max_songs){
            sounds.push(media.assets[i]);
          }
        }
        setCount(sounds.length);
      }
      else{
        const music_albumi = await MediaLibrary.getAlbumAsync("Music");
        if(music_albumi){
          const media = await MediaLibrary.getAssetsAsync({
            album: music_albumi,
            mediaType: MediaLibrary.MediaType.audio
          });
          for (let i=0; i<media.assets.length; i++){
            if (i < max_songs){
              sounds.push(media.assets[i]);
            }
          }
          setCount(sounds.length);
        }
        else{
          null
        }
      }
    }
  }

     
  //Push "sounds.length" times buttons to song_buttons array 
  const add_buttons = () => {
    for (let i=0;i<count;i++){
      song_buttons.push(<SongBtn button_id={i} key={i} play={(test) => play_sound(i)}/>);
    }
  }
  
  //Plays audio files, - MAKE ERROR CHECK
  const play_sound = async (song_index) => {
    if(!playing){
      // Audio.setIsEnabledAsync(true);
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(sounds[song_index]);
      setSound(sound);
      setCurrentlyPlaying(sounds[song_index]["filename"]);
      console.log('Playing Sound');
      await sound.playAsync();
      sound.setIsLoopingAsync(true);
      playing = true;
    }
    else{
      sound.unloadAsync(this);
      setCurrentlyPlaying("");
      playing = false;
    }
  }
    
  React.useEffect(() => {
    return sound 
    ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
      // Audio.setIsEnabledAsync(false);
      playing = false;
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
        {/* <Text style={{textAlign: "center"}}>Playing:</Text> */}
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
  textcontainer: {
    backgroundColor: "#bae1ff",
    justifyContent: "center",
    
  },
  currentSong:{
    textAlign: 'center',
    padding: 10,
  },
  bottom: {
    height: "72.5%",
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "center",
    padding: 1,
  },
  top:{
    height: "10%",
    marginTop: 25,
    justifyContent: "center",
  },
  headertext:{
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 40,
    textAlign: 'center',
    shadowColor: "#000",
    color: "#fff",
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 10,
    textShadowColor: "#000"
  },
  buttonstyle:{
    justifyContent: 'center',
    flex:1,
    backgroundColor: "steelblue",
    borderRadius: 2,
    elevation: 5
  },
});