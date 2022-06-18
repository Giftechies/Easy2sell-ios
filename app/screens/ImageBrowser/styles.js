
import { StyleSheet } from "react-native";
import { BaseColor, Typography, FontWeight } from "@config";
const styles = StyleSheet.create({
    flex: {
      flex: 1,
      height:"100%"
    },
    container: {
      position: 'relative'
    },
    emptyStay:{
      textAlign: 'center',
    },
    countBadge: {
      paddingHorizontal: 8.6,
      paddingVertical: 5,
      borderRadius: 50,
      position: 'absolute',
      right: 3,
      bottom: 3,
      justifyContent: 'center',
      backgroundColor: '#0580FF'
    },
    countBadgeText: {
      fontWeight: 'bold',
      alignSelf: 'center',
      padding: '20',
      backgroundColor: '#000000',
      paddingHorizontal: 2,
      paddingVertical: 2,
      borderRadius: 50,
      color: '#ffffff'
    }
  });