import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import useCartStore from '@/store/cartStore';
import useOrderStore from '@/store/orderStore';
import useAuthStore from '@/store/authStore';
import { orders } from '@/api/routes';
import { Button } from '@/components/Button';
import { IMAGE_BASE_URL } from '@/lib/constant';
import { Link } from 'expo-router';
import { payment } from '@/api/routes';
import { WebView } from 'react-native-webview';
import { Picker } from '@react-native-picker/picker';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCartStore();
  const { addOrder, getOrdersByUser } = useOrderStore();
  const { email, phone_number, name } = useAuthStore.getState()

  const [loading, setIsloading] = useState(false)
  const [isRedirect, setIsRedirect] = useState(false)
  const [checkOutURL, setcheckOutURL] = useState<string>('')
  const [availableTimes, setavailableTimes] = useState<string[]>([])
  const [selectedTime, setSelectedtime] = useState('10 AM')

  const cartTotal = cartItems.reduce(
    (total, { item, quantity }) => total + item.price * quantity,
    0
  );

  const handleCheckout = async () => {
    if (!cartItems.length) {
      Alert.alert("Cart is empty or no proof of payment.");
      return;
    }

    const paymentData = {
      name,
      email,
      phone_number,
      item_name: 'order',
      quantity: 1,
      price: cartTotal * 100,
    }

    try {
      setIsloading(true)
      const response = await payment.forTest(paymentData)
      setIsRedirect(true)
      setcheckOutURL(response.data.checkout_url)
      setIsloading(false)
    } catch (error) {
      console.log(error)
    }
  };

  const handleWebViewNavigationStateChange = async (navState: any) => {
    const { url } = navState;

    if (url.includes('success') || navState.title === 'Payment successful') {
      setIsRedirect(false);
      Alert.alert("Payment Successful", "Your payment was processed successfully.");

      const items = cartItems.map((item) => {
        return {
          ...item,
          time: selectedTime
        };
      });

      try {
        const result = await addOrder(items, cartTotal);
        Alert.alert("Checkout successful!", "Your order has been placed.");
        clearCart()
        getOrdersByUser()
      } catch (error) {
        Alert.alert("Checkout failed", "There was an issue placing your order. Please try again.");
        clearCart()
      }
    }
  };

  useEffect(() => {
    const getTime = async () => {
      const data = await orders.getAvailableTime()
      setavailableTimes(data.data.available_times)
    }

    getTime()
  }, [])

  return (
    <View className='flex-1 bg-red-600'>
      {isRedirect && checkOutURL ? <View className='pt-9' style={{ flex: 1 }}>
        <WebView source={{ uri: checkOutURL }} onNavigationStateChange={handleWebViewNavigationStateChange} style={{ flex: 1 }} />
      </View> :
        <View className='px-5'>
          <Text className='text-white text-xl font-bold mt-8'>Your Cart</Text>

          <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
            {cartItems.length === 0 ? (
              <Text className='text-white text-center mt-10'>Your cart is empty</Text>
            ) : (
              cartItems.map(({ item, quantity }, index) => (
                <View key={index} className='bg-white rounded-lg p-4 mb-5 flex-row items-center'>
                  <Image
                    source={{ uri: `${IMAGE_BASE_URL}${item.thumbnail}` }}
                    className='w-20 h-20 mr-4 rounded-lg'
                  />

                  <View className='flex-1'>
                    <Text className='text-lg font-bold'>{item.name}</Text>
                    <Text>PHP {item.price} x {quantity}</Text>
                    <Text>Total: PHP {(item.price * quantity)}</Text>

                    <View className='flex-row items-center mt-2'>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, Math.max(1, quantity - 1))}
                        className='bg-gray-200 px-2 py-1 rounded'
                      >
                        <Text>-</Text>
                      </TouchableOpacity>
                      <Text className='mx-3'>{quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, quantity + 1)}
                        className='bg-gray-200 px-2 py-1 rounded'
                      >
                        <Text>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => removeFromCart(item.id)} className='ml-4'>
                    <Text className='text-red-600'>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          {cartItems.length > 0 && (
            <>
              <View className="rounded-xl bg-white border border-border z-50">
                <Picker
                  selectedValue={selectedTime}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedtime(itemValue)
                  }>
                  {availableTimes.map((time) => (
                    <Picker.Item label={time} value={time} />
                  ))}
                </Picker>

              </View>
              <View className='bg-white p-4 rounded-lg my-5'>
                <Text className='text-lg font-bold'>Grand Total: PHP {cartTotal.toFixed(2)}</Text>
                <Link className='bg-white rounded border items-center mb-2.5 mt-5' href={'/(tabs)/home'} asChild>
                  <Button label='Add more' />
                </Link>
                <TouchableOpacity>
                  {loading ? (<ActivityIndicator size="large" color="red" />) : (
                    <Button
                      className='bg-red-600 rounded items-center mb-2.5 mt-5'
                      labelClasses='text-white'
                      label='Checkout'
                      onPress={() => handleCheckout()}
                    />
                  )}
                </TouchableOpacity>

              </View>
            </>
          )}
        </View>}
    </View>
  )
};

export default Cart;
