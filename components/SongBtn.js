import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const SongBtn = (props) => {
    return (
        <View style={styles.bottomItem}>
            <TouchableOpacity style={styles.bottomInnerNo} onPress={props.play}>
                <View style={styles.button}>
                <Text style={styles.buttontext}>{props.button_id+1}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    bottomItem: {
        width: '32%',
        height: '30%',
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
      buttontext: {
        fontSize: 50,
        textAlign: 'center',
        shadowColor: "#000",
        color: "#fff",
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 10,
        textShadowColor: "#000"
      }
})

export default SongBtn;