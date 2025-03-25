import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import ButtonV2 from '@/components/ButtonV2';
import { useSnackbar } from '@/context/SnackbarProvider';
import { ThemedText } from '@/components/ThemedText';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email({ message: "Invalid email "}).nonempty({ message: "Email is required" }),
  password: z.string().nonempty({ message: "Password is required" })
})

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  const dispatch = useDispatch<AppDispatch>();
  const { showSnackbar } = useSnackbar();
  const { loading } = useSelector((state: RootState) => state.user);

  const onSubmit = async (data: FormData) => {
    dispatch(login(data)).unwrap()
    .then(() => {
      router.push('/(tasks)')
    })
    .catch((error) => {
      showSnackbar(error)
    })
  };

  const goToSignup = () => {
    router.push('/(auth)/Signup');
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: Colors.light.background }}>
      <Text style={{ marginBottom: 30 }}>Login</Text>

      <View style={styles.fields}>
        <View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value }}) => (
              <TextInput 
                mode='outlined' 
                label="Email" 
                textContentType='emailAddress' 
                value={value} 
                onChangeText={onChange} 
              />
            )}
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
        </View>

        <View>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }}) => (
              <TextInput 
                mode='outlined' 
                label="Password" 
                secureTextEntry 
                value={value} 
                onChangeText={onChange} 
              />
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        </View>
        
        <ButtonV2 
          style={{ marginTop: 20 }} 
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        >Login</ButtonV2>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10, gap: 2 }}>
          <ThemedText style={{ color: Colors.light.text, lineHeight: 16 }}>Don't have an account?</ThemedText>
        <Pressable onPress={goToSignup}>
          <ThemedText style={{ lineHeight: 16 }} type='link'>Sign up</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 10
  },
  error: {
    color: 'red'
  }
})
