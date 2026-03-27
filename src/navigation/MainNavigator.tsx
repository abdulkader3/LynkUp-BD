import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import {
  DashboardScreen,
  WalletScreen,
  OrdersScreen,
  CommissionsScreen,
  ProfileScreen,
} from '../screens';
import { OffersNavigator } from './OffersNavigator';

export type MainTabParamList = {
  Dashboard: undefined;
  OffersStack: undefined;
  Wallet: undefined;
  Orders: undefined;
  Commissions: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function DashboardIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
        D
      </Text>
    </View>
  );
}

function OffersIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
        O
      </Text>
    </View>
  );
}

function WalletIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
        W
      </Text>
    </View>
  );
}

function OrdersIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
        Or
      </Text>
    </View>
  );
}

function CommissionIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
        C
      </Text>
    </View>
  );
}

function ProfileIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
        P
      </Text>
    </View>
  );
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E5E7EB',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: DashboardIcon,
        }}
      />
      <Tab.Screen
        name="OffersStack"
        component={OffersNavigator}
        options={{
          title: 'Offers',
          headerShown: false,
          tabBarIcon: OffersIcon,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: 'Wallet',
          tabBarIcon: WalletIcon,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Orders',
          tabBarIcon: OrdersIcon,
        }}
      />
      <Tab.Screen
        name="Commissions"
        component={CommissionsScreen}
        options={{
          title: 'Commission',
          tabBarIcon: CommissionIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFocused: {
    backgroundColor: '#4F46E5',
  },
  iconText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  iconTextFocused: {
    color: '#fff',
  },
});
