// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isGuest = useAuthStore((s) => s.isGuest);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn && !isGuest ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
}
