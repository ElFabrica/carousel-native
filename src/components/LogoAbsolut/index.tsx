import { useState } from "react";
import { Image,ImageProps, View } from "react-native";
import {styles} from "./style"
import { StyleSheet } from "react-native";

type Props = ImageProps & {

}

export function LogoAbsolut({ ...rest}: Props) {
      const [isFocused, setIsFocused] = useState(false);

    return(
            <View style={styles.wrapper}>
       <Image source={require("../../assets/logo_nasa_letras_pretas.png")}
       style={styles.image}/>
        </View>
    )
    
}