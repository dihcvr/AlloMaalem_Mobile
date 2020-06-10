import * as React from 'react';
import {View, Text, AsyncStorage} from 'react-native';
import {
  Appbar,
  DefaultTheme,
  Provider as PaperProvider,
  configureFonts,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Setting from '../screens/Setting';
import ArtisanEnAttente from './ArtisanEnAttente';
import ArtisanValide from './ArtisanValide';
import Services from './Services';

const Tab = createBottomTabNavigator();
function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Services') {
            iconName = 'calendar';
            size = focused ? 20 : 19;
          } else if (route.name === 'Valide') {
            iconName = 'check-circle';
            size = focused ? 20 : 19;
          } else if (route.name === 'En Attente') {
            iconName = 'hourglass-half'; //times-circle
            size = focused ? 20 : 19;
          } else if (route.name === 'Profil') {
            iconName = 'user';
            size = focused ? 20 : 19;
          } else if (route.name === 'Setting') {
            iconName = 'cog';
            size = focused ? 20 : 19;
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={30} color={color} light />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#3B5998',
        inactiveTintColor: 'gray',

        labelStyle: {
          fontFamily: 'CoreSansAR-55Medium',
          paddingTop: 10,
          fontSize: 10,
        },

        style: {
          height: 90,
          margin: 0,
        },
        tabStyle: {marginBottom: 10, padding: 0, height: 60, paddingTop: 10},
        /**/
      }}>
      <Tab.Screen name="Services" component={Services} />
      <Tab.Screen name="Valide" component={ArtisanValide} />
      <Tab.Screen name="En Attente" component={ArtisanEnAttente} />
      <Tab.Screen name="Setting" component={Setting} />

      {/*<Tab.Screen name="Profil" component={Profil} /> */}
    </Tab.Navigator>
  );
}
export default class Admin extends React.Component {
  render() {
    return <TabRoutes />;
  }
}
