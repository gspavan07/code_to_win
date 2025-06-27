import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNavbar({ active, onTabPress }) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { key: 'dashboard', icon: 'home-outline', label: 'Dashboard' },
    { key: 'profile', icon: 'person-outline', label: 'Profile' },
    { key: 'settings', icon: 'settings-outline', label: 'Settings' },
  ];

  return (
    <View
      className="flex-row justify-around border-t border-gray-200 bg-white py-2 dark:border-gray-700 dark:bg-gray-900"
      style={{ paddingBottom: insets.bottom }}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabPress(tab.key)}
          className="flex-1 items-center">
          <Ionicons name={tab.icon} size={24} color={active === tab.key ? '#2563eb' : '#888'} />
          <Text className={`text-xs ${active === tab.key ? 'text-blue-600' : 'text-gray-500'}`}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
