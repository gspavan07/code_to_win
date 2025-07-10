import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const colorStyles = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
};

export default function StatsCard({ icon, title, value, color = 'blue' }) {
  const iconColor = colorStyles[color] || colorStyles.blue;

  return (
    <View className="w-[48%] flex-row items-center rounded-xl bg-white p-4 shadow ">
      <View className={`h-12 w-12 items-center justify-center rounded-lg ${iconColor}`}>
        <Ionicons name={icon} size={24} />
      </View>
      <View className="ml-4">
        <Text className="text-sm text-gray-600">{title}</Text>
        <Text className="text-xl font-bold text-gray-900 ">{value}</Text>
      </View>
    </View>
  );
}
