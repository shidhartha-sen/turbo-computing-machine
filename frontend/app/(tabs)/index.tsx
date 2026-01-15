import React, { useState } from 'react';
import { Menu, Bell, Search, Heart, Plus, BookOpen, FlaskConical, Grid2X2 } from 'lucide-react-native';
import { View, Text, SafeAreaView } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View className='flex-1 py-4 items-center justify-center'>
        <Text className='text-2xl font-bold'>Home</Text>
      </View>
    </SafeAreaView>
  );
}
