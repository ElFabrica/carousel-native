import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { styles } from "./style"
import { RFValue } from "react-native-responsive-fontsize";
import clsx from "clsx"

type Props = TouchableOpacityProps & {
    title: string
    size?: number
    disable?: boolean
}

export function Button({ title, size = 20, disable, ...rest }: Props) {

    return (
        <TouchableOpacity className={clsx(`rounded-3xl bg-Primary py-6 px-6 w-full justify-center items-center`, disable && `opacity-85`)}  {...rest} activeOpacity={0.85} >
            <Text style={[styles.title, { fontSize: RFValue(size) }]}>{title}</Text>
        </TouchableOpacity>
    )

}