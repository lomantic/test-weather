import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import React, {useState, useEffect} from 'react';
//import reactDom from 'react-dom';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { Fontisto } from '@expo/vector-icons'; 
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY="4fcb3cd47ee1909c0625ec36c6ac6dfe";
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rain",
  Snow: "snows",
}

export default function App() {

  const [city, setCity] = useState("Loading ...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    setCity(location[0].city);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,alerts&appid=${API_KEY}&units=metric`)
    const json =await response.json();
    setDays(json.daily);
  }

  useEffect(() => {
    getWeather();
  },[])

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ContentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="black"/>
          </View>
        ) : (
          days.map((day) => (
            <View style={styles.day}>
              <Text style={styles.temp}>{(day.temp.day).toFixed(1)}</Text>
              <View style = {styles.descriptionRow}>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Fontisto name={icons[day.weather[0].main]} style={styles.icon} size={40} color="black" />
              </View>
              
            </View>
          )) 

        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
  city: {
    flex: 1,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "800",
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  day: {
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  weather: {
    backgroundColor: "orange",
  },
  temp: {
    fontSize: 160,
    marginTop: 30,

  },
  description: {
    marginTop: -30,
    fontSize: 50,
  },
  descriptionRow: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  icon: {
    marginTop: -10,
    marginLeft: 10,
  },  

});
