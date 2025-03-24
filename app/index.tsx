import { RootState } from "@/redux/store";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {

    const { token } = useSelector((state: RootState) => state.user);

    return <Redirect href={token ? "/(tasks)/home" : "/(auth)/login" } />
    
}