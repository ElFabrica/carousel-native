import { NavigationContainer } from "@react-navigation/native";
import { StacksRoutes } from "./StackRoutes";
import { StatusBar } from "react-native";

export function Routes() {
    return (

        <NavigationContainer>
            <StacksRoutes />
            <StatusBar hidden />
        </NavigationContainer>
    )

}