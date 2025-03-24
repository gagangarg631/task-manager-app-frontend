import { Colors } from "@/constants/Colors";
import { ReactElement } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

interface Props {
    children: ReactElement | String;
    onPress: Function;
    loading?: Boolean,
    style?: any
}

function ButtonV2(props: Props) {
    const { children, onPress, loading = false, style = {} } = props;

    return (
        <Pressable style={[styles.button, style]} onPress={() => onPress()} >
            <Text style={{ fontSize: 18, color: 'white' }}>{children}</Text>
            {loading && <ActivityIndicator color="white" style={{ marginLeft: 10 }} />}
        </Pressable>
    )

}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.light.tint,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        height: 50,
        borderRadius: 12
    }
})

export default ButtonV2;