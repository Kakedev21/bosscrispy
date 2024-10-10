import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import useOrderStore from '@/store/orderStore';
import { IMAGE_BASE_URL } from '@/lib/constant';
import useCartStore from '@/store/cartStore';
import { Picker } from '@react-native-picker/picker';

const Orders = () => {
  const { getOrdersByUser, orders, isLoading } = useOrderStore();
  const { clearCart } = useCartStore();

  // State for sorting
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getOrdersByUser();
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      clearCart();
    };

    fetchOrders();
  }, [getOrdersByUser, orders.length]);

  // Filter and sort orders based on status
  const filteredOrders = selectedStatus === 'All'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  return (
    <View className='flex-1 bg-red-600 px-5'>
      <Text className='text-xl font-bold mt-8 text-white'>Your Orders</Text>

      {/* Dropdown for sorting by status */}
      <Picker
        selectedValue={selectedStatus}
        style={{ height: 50, width: '100%', backgroundColor: 'white', marginTop: 10 }}
        onValueChange={(itemValue) => setSelectedStatus(itemValue)}
      >
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Pending" value="PENDING" />
        <Picker.Item label="Ready for Pickup" value="READY FOR PICKUP" />
        <Picker.Item label="Preparing" value="PREPARING" />
        <Picker.Item label="Rejected" value="REJECTED" />
      </Picker>

      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {isLoading ? <ActivityIndicator size="large" color="white" /> : filteredOrders.length ? (
          filteredOrders.map((order) => (
            <View key={order.id} className='mb-6 bg-white rounded-md p-4'>
              <Image
                source={{ uri: `${IMAGE_BASE_URL}${order.item.thumbnail}` }}
                style={{ width: '100%', height: 150, borderRadius: 8 }}
                className='mb-3 object-contain'
              />
              <Text className='text-lg font-bold'>{order.item.name}</Text>
              <Text>Total: PHP {Number(order.item.price * order.quantity)}</Text>
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
