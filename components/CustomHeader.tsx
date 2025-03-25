import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/userSlice";
import { router } from "expo-router";
import { Appbar } from "react-native-paper";
import { useDispatch } from "react-redux";

export interface HeaderProps {
  title?: String;
  showLogout?: Boolean;
  showPlus?: Boolean;
  showBack?: Boolean;
}

const CustomHeader = (props: HeaderProps) => {
  const { title, showLogout = true, showPlus, showBack } = props;
    const dispatch = useDispatch<AppDispatch>();

    const logoutApp = () => {
      dispatch(logout());
      router.replace('/(auth)/Login');
    }

    return (
      <Appbar.Header>
        {showBack && <Appbar.Action icon="arrow-left" onPress={router.back} />}
        <Appbar.Content title={title || 'Tasks App'} />
        {showLogout && <Appbar.Action icon="logout" onPress={logoutApp} />}
        {showPlus && <Appbar.Action icon="plus" onPress={() => {
          router.push('/(tasks)/taskform')
        }} />}
      </Appbar.Header>
    );
  };

export default CustomHeader;