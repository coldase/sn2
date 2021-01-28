import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';


const SongBtn = (props) => {

    const [currentStyle, setStyle] = useState(styles.bottomInnerNo);

    const things = () => {
      setStyle(styles.bottomInnerNo);
      if(currentStyle === styles.bottomInnerYes){
        setStyle(styles.bottomInnerNo);
      }else{
        setStyle(styles.bottomInnerYes);
      }
      props.play();
    }
    
   return (
      <View style={styles.bottomItem}>
          <TouchableOpacity style={currentStyle} onPress={things}>
              <View>
              <Text style={styles.buttontext}>{props.button_id+1}</Text>
              </View>
          </TouchableOpacity>
      </View>
  )
};

const styles = StyleSheet.create({
    bottomItem: {
        width: '32%',
        height: '28%',
        padding: 4,
        margin: 2,
      },
      bottomInnerNo:{
        justifyContent: 'center',
        flex:1,
        backgroundColor: "steelblue",
        borderRadius: 2,
        elevation: 5
      },
      bottomInnerYes:{
        justifyContent: 'center',
        backgroundColor: "green",
        flex:1,
        borderRadius: 2,
        elevation: 5
      },
      buttontext: {
        fontSize: 30,
        textAlign: 'center',
        shadowColor: "#000",
        color: "#fff",
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 10,
        textShadowColor: "#000"
      }
})

export default SongBtn;