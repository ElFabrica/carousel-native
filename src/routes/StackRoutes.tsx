import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Admin } from "@/app/Admin/Admin";
import { HomeCarrocel } from "@/app/HomeCarrocel/index";

export type StackRoutesList = {
  homeCarrocel: undefined;
  admin: undefined;
};

export type StackRoutesProps<T extends keyof StackRoutesList> =
  NativeStackScreenProps<StackRoutesList, T>;

const Stack = createNativeStackNavigator<StackRoutesList>();

export function StacksRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="homeCarrocel"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="admin" component={Admin} />
      <Stack.Screen name="homeCarrocel" component={HomeCarrocel} />
    </Stack.Navigator>
  );
}
