import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import { Input } from '@/components/Input';
import { Checkbox } from '@/components/Checkbox';
import { Button } from '@/components/Button';
import { Link, useRouter } from 'expo-router';
import useAuthStore from '@/store/authStore';
import { authAPI } from '@/api/routes';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const response = await authAPI.login({ email, password });
      setAuth(response.data)
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.response?.data?.message || 'An unexpected error occurred');
    }
    setLoading(false)

  };

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center h-50">
      <View className="items-center mb-5">
        <Image
          source={{ uri: 'https://scontent.xx.fbcdn.net/v/t1.15752-9/457496668_931293689045037_1004172138103515310_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeHGxW1drSExspZ9DAXOUe4VGvbGKVR-GFwa9sYpVH4YXK8JmIzBFffABIPzU8b2j35IjqSBW40_0ZzAwV6AEOd8&_nc_ohc=LzZfryeriuEQ7kNvgHznlE_&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&_nc_gid=AHTFBarJbiCOsQ9GqFX1YDM&oh=03_Q7cD1QF_8-sbbEjNaMJ4NhSBfCRrpW4yrsuYx2uA2gJyx7gPuQ&oe=67143884' }}
          className="w-52 h-52 mb-2.5"
        />
        <Text className="text-3xl font-bold text-red-600">BOSS</Text>
        <Text className="text-lg text-red-600">CRISPY PATA</Text>
      </View>

      <View className="absolute bg-red-600 w-[550px] h-[300px] bottom-[50px] -z-10 rounded-t-[90px]"></View>

      <View className="w-4/5 bg-white space-y-4 p-5 rounded-lg shadow-md">
        <Input
          editable={!loading}
          className='mb-5'
          inputMode='email'
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          editable={!loading}
          placeholder="Enter your password"
          secureTextEntry
          value={password} rounded-lg p-4 mb-5 w-full
          onChangeText={setPassword}
        />

        <View className="flex-row justify-between mb-5">
          <Checkbox />
          <Text className="text-sm text-gray-500">Remember Me</Text>
          <TouchableOpacity>
            <Text className="text-sm text-gray-500">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-red-600 rounded items-center mb-2.5"
          onPress={handleLogin}
        >
          {loading ? (<ActivityIndicator size="large" color="white" />) : (
            <Button disabled={loading} labelClasses="text-white text-base" label="Login" />
          )}
        </TouchableOpacity>

        <TouchableOpacity>
          <Text className="text-sm text-center">
            <Link href={'/register'}>
              Don't have an account? <Text className="text-red-600 font-bold">Create an account</Text>
            </Link>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;