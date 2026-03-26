import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { apiClient } from '../../services/api';
import { Button, Input, Card } from '../../components';
import type { Offer } from '../../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type OffersStackParamList = {
  OffersList: undefined;
  BuyOffer: { offer: Offer };
};

interface BuyOfferScreenProps {
  navigation: NativeStackNavigationProp<OffersStackParamList, 'BuyOffer'>;
  route: RouteProp<OffersStackParamList, 'BuyOffer'>;
}

export function BuyOfferScreen({ navigation, route }: BuyOfferScreenProps) {
  const { offer } = route.params;
  const [quantity, setQuantity] = useState('1');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const qty = parseInt(quantity, 10) || 0;
  const totalPrice = offer.price * qty;
  const totalCommission = offer.commission * qty;

  const handleBuy = async () => {
    if (!customerPhone.trim()) {
      Alert.alert('Error', 'Please enter customer phone number');
      return;
    }

    if (qty < 1 || qty > offer.stock) {
      Alert.alert('Error', `Quantity must be between 1 and ${offer.stock}`);
      return;
    }

    setLoading(true);
    try {
      await apiClient.buyOffer(offer.id, qty, customerPhone.trim());
      Alert.alert('Success', 'Order placed successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to place order',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.offerDetails}>
          <Text style={styles.offerName}>{offer.name}</Text>
          <Text style={styles.offerDescription}>{offer.description}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price:</Text>
            <Text style={styles.priceValue}>${offer.price.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Commission:</Text>
            <Text style={styles.priceValue}>
              ${offer.commission.toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Available Stock:</Text>
            <Text style={styles.priceValue}>{offer.stock}</Text>
          </View>
        </Card>

        <Card title="Order Details" style={styles.orderForm}>
          <Input
            label="Quantity"
            placeholder="Enter quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <Input
            label="Customer Phone Number"
            placeholder="Enter customer phone"
            value={customerPhone}
            onChangeText={setCustomerPhone}
            keyboardType="phone-pad"
          />

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Price:</Text>
              <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Commission Earned:</Text>
              <Text style={styles.commissionValue}>
                +${totalCommission.toFixed(2)}
              </Text>
            </View>
          </View>

          <Button
            title="Place Order"
            onPress={handleBuy}
            loading={loading}
            disabled={!offer.isActive || offer.stock <= 0}
            style={styles.buyButton}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  offerDetails: {
    marginBottom: 16,
  },
  offerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  orderForm: {
    marginBottom: 16,
  },
  summary: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  commissionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  buyButton: {
    marginTop: 16,
  },
});
