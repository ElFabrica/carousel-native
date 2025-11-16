import { Image, ImageProps, View } from "react-native";
import { styles } from "./style"

type Props = ImageProps & {

}

export function Logo({ ...rest }: Props) {

  return (
    <View style={styles.wrapper}>
      <Image source={require("../../assets/logo_nasa_letras_pretas.png")}
        style={styles.image} />
    </View>
  )

}