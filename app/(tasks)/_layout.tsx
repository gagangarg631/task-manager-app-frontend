import { Redirect, Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppLayout() {

  const { token } = useSelector((state: RootState) => state.user);

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsAuthenticated(!!token);
  }

  useEffect(() => {
    checkAuth();
  }, [token])

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/Login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
