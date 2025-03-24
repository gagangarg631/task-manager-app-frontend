import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { router, useNavigation } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { signUp } from '@/redux/userSlice';
import ButtonV2 from '@/components/ButtonV2';
import { useSnackbar } from '@/context/SnackbarProvider';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ThemedText } from '@/components/ThemedText';

const schema = z.object({
  name: z.string().nonempty({ message: "Name is required." }),
  email: z.string().email({ message: "Invalid email "}).nonempty({ message: "Email is required." }),
  password: z.string()
    .nonempty({ message: "Password is required" })
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(20, { message: 'Password cannot exceed 20 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[\W_]/, { message: 'Password must contain at least one special character (!@#$%^&*)' }),
})

type FormData = z.infer<typeof schema>;

export default function SignupScreen() {
  const { handleSubmit, formState: { errors }, control } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.user);
  const { showSnackbar } = useSnackbar();

  const onSubmit = (data: FormData) => {
    dispatch(signUp(data))
    .unwrap()
    .then(goToLogin)
    .catch((error) => {
      showSnackbar(error);
    })
  }

  const goToLogin = () => {
    router.push('/(auth)/login');
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: Colors.light.background }}>
      <Text variant="headlineMedium" style={{ marginBottom: 30 }}>Sign Up</Text>

      <View style={styles.fields}>
        <View>
          <Controller 
            control={control}
            name="name"
            render={({ field: { onChange, value }}) => (
              <TextInput 
                mode='outlined' 
                label="Name" 
                value={value} 
                onChangeText={onChange} 
              />
            )}
          />
          {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
        </View>

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
                textContentType='password'
                onChangeText={onChange} 
              />
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        </View>

        <ButtonV2 onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }} loading={loading}>
          SignUp
        </ButtonV2>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10, gap: 2 }}>
          <ThemedText style={{ color: Colors.light.text, lineHeight: 16 }}>Already have user?</ThemedText>
        <Pressable onPress={goToLogin}>
          <ThemedText style={{ lineHeight: 16 }} type='link'>Login</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: 'red'
  },
  fields: {
    gap: 10
  }
})