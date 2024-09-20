import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { UserRegister } from '@/typescript/user';
import { Input } from '@/components/Input';
import { authAPI } from '@/api/routes';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState('');
  const [userData, setUserData] = useState<UserRegister>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone_number: '',
  });

  const { email, first_name, last_name, password, phone_number } = userData;
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !first_name || !last_name || !password || !repeatPassword) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      router.replace('/login');
    } catch (error: any) {
      console.error('Register error:', error);
      Alert.alert('Registration Failed', error.response?.data?.message || 'An unexpected error occurred');
    }
    setLoading(false);
  };

  return (
    <View className="bg-white flex-1">
      <View className='bg-red-500 p-4'>
        <TouchableOpacity onPress={() => router.push('/login')} className="mt-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View className="mt-8">
          <Text className="text-3xl font-bold text-white">CREATE YOUR</Text>
          <Text className="text-3xl font-bold text-white">ACCOUNT</Text>
        </View>
      </View>

      <View className="mt-8 space-y-4 p-4">
        <Input
          value={email}
          onChangeText={(value) => setUserData({ ...userData, email: value })}
          placeholder="Email"
          className="bg-gray-100 p-3 rounded-md mb-4"
        />

        <Input
          value={first_name}
          onChangeText={(value) => setUserData({ ...userData, first_name: value })}
          placeholder="First Name"
          className="bg-gray-100 p-3 rounded-md mb-4"
        />

        <Input
          value={last_name}
          onChangeText={(value) => setUserData({ ...userData, last_name: value })}
          placeholder="Last Name"
          className="bg-gray-100 p-3 rounded-md mb-4"
        />

        <Input
          value={phone_number.toString()}
          keyboardType="numeric"
          onChangeText={(value) => setUserData({ ...userData, phone_number: value })}
          placeholder="Phone Number"
          className="bg-gray-100 p-3 rounded-md mb-4"
        />

        <View className="relative">
          <Input
            value={password}
            onChangeText={(value) => setUserData({ ...userData, password: value })}
            placeholder="Password"
            secureTextEntry={!showPassword}
            className="bg-gray-100 p-3 rounded-md"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View className="relative">
          <Input
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            placeholder="Repeat Password"
            secureTextEntry={!showRepeatPassword}
            className="bg-gray-100 p-3 rounded-md"
          />
          <TouchableOpacity
            onPress={() => setShowRepeatPassword(!showRepeatPassword)}
            className="absolute right-3 top-3"
          >
            <Ionicons
              name={showRepeatPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          className={`bg-red-600 p-3 rounded-md mt-8 ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold">
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
