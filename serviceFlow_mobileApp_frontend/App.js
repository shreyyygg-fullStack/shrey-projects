import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import RequestDetailsScreen from './src/screens/RequestDetailsScreen';
import UpdateStatusScreen from './src/screens/UpdateStatusScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { token, loading } = useAuth();

    if (loading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {token == null ? (
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                ) : (
                    <>
                        <Stack.Screen name="Dashboard" component={DashboardScreen} />
                        <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} options={{ title: 'Request Details' }} />
                        <Stack.Screen name="UpdateStatus" component={UpdateStatusScreen} options={{ title: 'Update Status' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}
