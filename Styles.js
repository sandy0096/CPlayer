import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({

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