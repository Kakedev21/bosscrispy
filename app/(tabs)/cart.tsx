import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import useCartStore from '@/store/cartStore';
import useOrderStore from '@/store/orderStore';
import { Button } from '@/components/Button';
import { IMAGE_BASE_URL } from '@/lib/constant';
import { Link } from 'expo-router';
import * as ImagePicker from "expo-image-picker";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();
  const { addOrder } = useOrderStore();
  const [image, setImage] = useState<any>(null);

  const cartTotal = cartItems.reduce(
    (total, { item, quantity }) => total + item.price * quantity,
    0
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 && !image) {
      Alert.alert("Cart is empty or no proof of payment.");
      return;
    }

    const items = cartItems.map(({ item, quantity }) => ({
      itemId: item.id,
      quantity,
      payment_image: image ? JSON.stringify(image) : ''
    }));
    console.log(items)

    try {
      await addOrder(items, cartTotal);
      Alert.alert("Checkout successful!", "Your order has been placed.");
    } catch (error) {
      Alert.alert("Checkout failed", "There was an issue placing your order. Please try again.");
    }
  };

  return (
    <View className='flex-1 bg-red-600 px-5'>
      <Text className='text-white text-xl font-bold mt-8'>Your Cart</Text>

      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {cartItems.length === 0 ? (
          <Text className='text-white text-center mt-10'>Your cart is empty</Text>
        ) : (
          cartItems.map(({ item, quantity }, index) => (
            <View key={index} className='bg-white rounded-lg p-4 mb-5 flex-row items-center'>
              <Image
                source={{ uri: `${IMAGE_BASE_URL}${item.image.uri}` }}
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
          <View className="justify-center items-center rounded-md space-y-5 w-full">
            {image && (
              <View style={styles.imageContainer}>
                {/* Display the image */}
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />

                {/* X button to remove the image */}
                <TouchableOpacity style={styles.removeButton} onPress={() => setImage(null)}>
                  <Text style={styles.removeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Button to upload image */}
            <Button className='bg-white my-4 w-[60%]' label="proof of payment" onPress={pickImage} />
          </View>
          <View className='bg-white p-4 rounded-lg my-5'>
            <Text className='text-lg font-bold'>Grand Total: PHP {cartTotal.toFixed(2)}</Text>
            <Link className='bg-white rounded border items-center mb-2.5 mt-5' href={'/(tabs)/home'} asChild>
              <Button label='Add more' />
            </Link>
            <Button
              className='bg-red-600 rounded items-center mb-2.5 mt-5'
              labelClasses='text-white'
              label='Checkout'
              onPress={handleCheckout}
            />
          </View>
        </>

      )}

    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Cart;
