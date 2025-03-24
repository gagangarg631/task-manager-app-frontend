import { Stack } from 'expo-router';

const DashboardStack = () => (
    <Stack
      initialRouteName="home"
      screenOptions={{
        headerStyle: {
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
      }}>
      <Stack.Screen name="home" options={{ title: "Tasks" }} />
      <Stack.Screen name="details" />
    </Stack>
)

export default function HomeLayout() {

  return (
    <DashboardStack />
  );
}
