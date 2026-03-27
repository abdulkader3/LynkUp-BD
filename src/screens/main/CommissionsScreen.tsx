import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { apiClient } from '../../services/api';
import { Card, StatCard, Loading } from '../../components';
import type { Commission } from '../../types';

export function CommissionsScreen() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommissions = async () => {
    try {
      const data = await apiClient.getCommissions();
      setCommissions(data.data);
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCommissions();
  };

  const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0);
  const averageRate =
    commissions.length > 0
      ? commissions.reduce((sum, c) => sum + c.rate, 0) / commissions.length
      : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderCommission = ({ item }: { item: Commission }) => (
    <Card style={styles.commissionCard}>
      <View style={styles.commissionHeader}>
        <Text style={styles.orderId}>
          Order #{item.order?.slice(-8) || item._id.slice(-8)}
        </Text>
        <Text style={styles.commissionAmount}>+${item.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.commissionDetails}>
        <Text style={styles.rateLabel}>Rate: {item.rate}%</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
    </Card>
  );

  if (loading) {
    return <Loading message="Loading commissions..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={commissions}
        renderItem={renderCommission}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <View style={styles.statsRow}>
              <StatCard
                title="Total Commission"
                value={`$${totalCommission.toFixed(2)}`}
                color="#10B981"
                style={styles.statCard}
              />
              <StatCard
                title="Avg. Rate"
                value={`${(averageRate * 100).toFixed(1)}%`}
                color="#8B5CF6"
                style={styles.statCard}
              />
            </View>

            <Text style={styles.sectionTitle}>Commission History</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No commissions yet</Text>
            <Text style={styles.emptySubtext}>
              Complete orders to earn commission
            </Text>
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  commissionCard: {
    marginBottom: 8,
  },
  commissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  commissionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  commissionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
