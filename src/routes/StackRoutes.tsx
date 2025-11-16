import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Form } from "@/app/Form/Form";
import { Home } from "@/app/Home/Home";
import { Questions } from "@/app/Questions/Questions";
import { Score } from "@/app/Score/Score";
import { Users } from "@/app/Users/Users";
import { Admin } from "@/app/Admin/Admin";
import { Instructions } from "@/app/Instructions/Instructions";
import { Sorteio } from "@/app/Sorteio";
import { HomeCarrocel } from "@/app/HomeCarrocel/index";

export type StackRoutesList = {
  home: undefined;
  homeCarrocel: undefined;
  form: undefined;
  questions: undefined;
  score: { score: number };
  users: undefined;
  admin: undefined;
  instructions: undefined;
  sorteio: undefined;
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
      <Stack.Screen name="home" component={Home} />

      <Stack.Screen
        name="homeCarrocel"
        component={HomeCarrocel}
        options={{
          headerShown: false,
          title: "Home Carrocel",
        }}
      />
      <Stack.Screen
        name="form"
        component={Form}
        options={{
          headerShown: false,
          title: "Formulário",
        }}
      />

      <Stack.Screen name="questions" component={Questions} />

      <Stack.Screen name="score" component={Score} />

      <Stack.Screen
        name="users"
        component={Users}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="instructions"
        component={Instructions}
        options={{
          headerShown: false,
          title: "Regras",
        }}
      />
      <Stack.Screen
        name="admin"
        component={Admin}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="sorteio"
        component={Sorteio}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
