import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { apiClient } from '../../services/api';
import { Card, Loading } from '../../components';
import type { Offer } from '../../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OffersStackParamList = {
  OffersList: undefined;
  BuyOffer: { offer: Offer };
};

interface OffersScreenProps {
  navigation: NativeStackNavigationProp<OffersStackParamList, 'OffersList'>;
}

export function OffersScreen({ navigation }: OffersScreenProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffers = async () => {
    try {
      const data = await apiClient.getOffers();
      setOffers(data);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
      Alert.alert('Error', 'Failed to load offers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOffers();
  };

  const renderOffer = ({ item }: { item: Offer }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('BuyOffer', { offer: item })}
      activeOpacity={0.7}
    >
      <Card style={styles.offerCard}>
        <View style={styles.offerHeader}>
          <Text style={styles.offerName}>{item.name}</Text>
          <Text style={styles.offerPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.offerDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.offerFooter}>
          <View style={styles.offerInfo}>
            <Text style={styles.infoLabel}>Commission:</Text>
            <Text style={styles.infoValue}>${item.commission.toFixed(2)}</Text>
          </View>
          <View style={styles.offerInfo}>
            <Text style={styles.infoLabel}>Stock:</Text>
            <Text style={styles.infoValue}>{item.stock}</Text>
          </View>
          {!item.isActive && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveText}>Inactive</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading message="Loading offers..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={offers}
        renderItem={renderOffer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No offers available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  list: {
    padding: 16,
  },
  offerCard: {
    marginBottom: 12,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
  },
  offerDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  offerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  offerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  inactiveBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inactiveText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
