import { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useMenuStore from '@/store/menuStore';
import { MenuItemType } from '@/typescript/menus';
import useCartStore from '@/store/cartStore';
import { IMAGE_BASE_URL } from '@/lib/constant';
import { Link, useRouter } from 'expo-router';
import useAuthStore from '@/store/authStore';

const Home = () => {
  const addToCart = useCartStore((state) => state.addItemToCart)
  const router = useRouter()
  const { logout } = useAuthStore()

  const [showLogout, setShowLogout] = useState(false);

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const { menuItems, isLoading, fetchMenuItems } = useMenuStore();
  const [isAddCart, setIsAddCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>();
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const totalPrice = selectedItem ? selectedItem.price * quantity : 0;

  return (
    <View className="flex-1 bg-red-600 px-5">
      <View className="flex-row justify-between items-center mt-8">
        <Text className="text-white text-xl font-bold">MENU</Text>

        <TouchableOpacity onPress={toggleLogout}>
          <Image
            source={{ uri: 'https://th.bing.com/th/id/OIP.qWvJh1xJywU_rTD_3e-YmwHaEK?w=306&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7' }}
            className="w-10 h-10 rounded-full"
          />
        </TouchableOpacity>

        {showLogout && (
          <TouchableOpacity onPress={() => {
            logout()
            router.push("/login")
          }} className="absolute top-16 right-4 z-10 bg-gray-500 p-2 rounded">
            <Text className="text-white text-lg">Logout</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row items-center bg-white rounded-lg px-3 py-2 my-5">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search here"
          className="ml-2 flex-1"
        />
      </View>

      <Text className="text-white text-center text-2xl font-bold">Enjoy Your Food</Text>

      <View className="flex-row justify-center my-4">
        <TouchableOpacity className="bg-white px-4 py-2 rounded-full mx-2">
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white px-4 py-2 rounded-full mx-2">
          <Text>Drink</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: 'center' }} className="mb-20">
        {isLoading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          menuItems.map((item) => (
            <TouchableOpacity disabled={item.stock === 0} onPress={() => {
              setSelectedItem(item);
              setIsAddCart(true);
            }} key={item.id} className={`${item.stock >= 1 ? 'bg-white' : 'bg-gray-400'} rounded-lg p-4 mb-5 w-full`}>
              <Image
                source={{ uri: `${IMAGE_BASE_URL}${item.image}` }}
                className="w-full h-40 rounded-lg mb-3 object-cover"
              />
              {item.stock >= 1 ? (
                <>
                  <Text className="text-lg font-bold text-center">{item.name}</Text>
                  <Text className="text-gray-600 text-center">PHP {item.price}</Text>
                </>
              ) : (
                <Text>Out of stock</Text>
              )}

            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal animationType='slide' transparent={true} visible={isAddCart} onRequestClose={() => {
        setIsAddCart(!isAddCart);
      }}>
        {selectedItem && (
          <View className="flex-1 bg-red-600">
            <TouchableOpacity onPress={() => {
              setIsAddCart(false);
              setSelectedItem(null);
            }} className="absolute top-10 left-5 z-10">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Image source={{ uri: `${IMAGE_BASE_URL}${selectedItem?.image}` }} className="w-full h-72 object-cover" />

            <View className="bg-white rounded-t-3xl p-5 flex-1 -mt-5">
              <Text className="text-2xl font-bold text-orange-500">PHP {selectedItem?.price.toFixed(2)}</Text>
              <Text className="text-3xl font-bold my-2">{selectedItem?.name}</Text>
              <Text className='text-base'>{selectedItem?.description}</Text>

              <View className='mt-20'>
                <View className="flex-row items-center justify-center my-5">
                  <TouchableOpacity onPress={decrementQuantity} className="bg-red-600 w-10 h-10 rounded-full items-center justify-center">
                    <Text className="text-white text-2xl font-bold">-</Text>
                  </TouchableOpacity>
                  <Text className="text-2xl font-bold mx-5">{quantity}</Text>
                  <TouchableOpacity onPress={incrementQuantity} className="bg-red-600 w-10 h-10 rounded-full items-center justify-center">
                    <Text className="text-white text-2xl font-bold">+</Text>
                  </TouchableOpacity>
                </View>

                <Text className="text-2xl font-bold text-center mb-4">Total: PHP {totalPrice.toFixed(2)}</Text>

                <TouchableOpacity onPress={() => {
                  addToCart(selectedItem, quantity)
                  setSelectedItem(null)
                  setIsAddCart(false)
                  router.push('/(tabs)/cart')
                  setQuantity(1)
                }} className="bg-red-600 p-4 rounded-xl items-center">
                  <Text className="text-white text-lg font-bold">Add to Cart</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default Home;
