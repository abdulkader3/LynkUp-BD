import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OffersScreen, BuyOfferScreen } from '../screens';
import type { Offer } from '../types';

export type OffersStackParamList = {
  OffersList: undefined;
  BuyOffer: { offer: Offer };
};

const Stack = createNativeStackNavigator<OffersStackParamList>();

export function OffersNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="OffersList"
        component={OffersScreen}
        options={{ title: 'Offers' }}
      />
      <Stack.Screen
        name="BuyOffer"
        component={BuyOfferScreen}
        options={{ title: 'Buy Offer' }}
      />
    </Stack.Navigator>
  );
}
