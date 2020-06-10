import * as React from 'react';
import Home from './screens/Home';
import Save from './screens/Save';
import Search from './screens/Search';
import Setting from './screens/Setting';
import Splash from './screens/Splash';
import StartPage from './screens/StartPage';
import MapV from './screens/mapV';
import CreateAccount from './screens/CreateAccount';
import Admin from './admin/Admin';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Test from './screens/test';
import {AuthContext} from './screens/context';

const Tab = createBottomTabNavigator();

function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            size = focused ? 20 : 19;
          } else if (route.name === 'Search') {
            iconName = 'map-marker-alt';
            size = focused ? 20 : 19;
          } else if (route.name === 'Save') {
            iconName = 'bookmark';
            size = focused ? 20 : 19;
          } else if (route.name === 'Profil') {
            iconName = 'user';
            size = focused ? 20 : 19;
          } else if (route.name === 'Setting') {
            iconName = 'cog';
            size = focused ? 20 : 19;
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#3B5998',
        inactiveTintColor: 'gray',

        labelStyle: {
          fontFamily: 'CoreSansAR-55Medium',
          paddingBottom: 10, // paddingTop: 10, //paddingBottom: 10,
          fontSize: 10,
        },

        style: {
          height: '10%', //60
          margin: 0,
        },
        tabStyle: {margin: 0, padding: 0, height: 60, paddingTop: 10},
        /* */
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={MapV} />
      <Tab.Screen name="Save" component={Save} />
      <Tab.Screen name="Setting" component={Setting} />

      {/*<Tab.Screen name="Profil" component={Profil} /> */}
    </Tab.Navigator>
  );
}

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={StartPage}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="CreateAccount"
      component={CreateAccount}
      options={{title: 'Create Account'}}
    />
  </AuthStack.Navigator>
);

const RootStack = createStackNavigator();

const RootStackScreen = ({userToken}) => (
  <RootStack.Navigator headerMode="none">
    {userToken === 'admin' ? (
      <RootStack.Screen name="val" component={Admin} />
    ) : userToken === 'user' ? (
      <RootStack.Screen
        name="App"
        component={TabRoutes}
        options={{
          animationEnabled: false,
        }}
      />
    ) : (
      <RootStack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{
          animationEnabled: false,
        }}
      />
    )}
  </RootStack.Navigator>
);

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const authContext = React.useMemo(() => {
    return {
      admin: () => {
        setIsLoading(false);
        setUserToken('admin');
      },
      signIn: () => {
        setIsLoading(false);
        setUserToken('user');
      },
      signUp: () => {
        setIsLoading(false);
        setUserToken('asdf');
      },
      signOut: () => {
        setIsLoading(false);
        setUserToken(null);
      },
    };
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Splash />;
  }
  return (
    /** 
       <Admin /> 
        <TabRoutes />
        <Test />
     */
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={MyTheme}>
        <RootStackScreen userToken={userToken} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
  },
};
