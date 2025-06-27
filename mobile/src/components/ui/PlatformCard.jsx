import React from 'react';
import { View, Text, Image } from 'react-native';

export default function PlatformCard({
  name,
  logo,
  total,
  breakdown,
  className,
  subtitle = 'Problems Solved',
}) {
  return (
    <View className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className={`text-base font-semibold ${className}`}>{name}</Text>
        <Image source={logo} resizeMode="contain" className="h-12 w-12" />
      </View>

      <Text className="mb-1 text-3xl font-bold dark:text-white">{total}</Text>
      <Text className="mb-2 text-sm text-gray-500 dark:text-gray-300">{subtitle}</Text>

      {breakdown && (
        <View className="flex-row flex-wrap gap-2">
          {Object.entries(breakdown).map(([label, count]) => (
            <Text
              key={label}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-900 dark:text-white">
              {label}: {count}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
