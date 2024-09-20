import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import useOrderStore from '@/store/orderStore';
import { IMAGE_BASE_URL } from '@/lib/constant';

const Orders = () => {
  const { getOrdersByUser, orders, isLoading } = useOrderStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getOrdersByUser();
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [getOrdersByUser, orders.length]);


  return (
    <View className='flex-1 bg-red-600 px-5'>
      <Text className='text-xl font-bold mt-8 text-white'>Your Orders</Text>

      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {isLoading ? <ActivityIndicator size="large" color="white" /> : orders.length ? (
          orders.map((order) => (
            <View key={order.id} className='mb-6 bg-white rounded-md p-4'>
              <Image
                source={{ uri: `${IMAGE_BASE_URL}${order.item_image}` }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
                className='mb-3'
              />
              <Text className='text-lg font-bold'>{order.item_name}</Text>
              <Text>Total: PHP {order.total_price}</Text>
              <Text>Status: {order.status}</Text>
            </View>
          ))
        ) : (
          <Text className='text-center mt-10'>You have no orders yet</Text>
        )}

      </ScrollView>
    </View>
  );
};

export default Orders;
