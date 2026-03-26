import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { apiClient } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { StatCard, Card, Loading } from '../../components';
import type { DashboardStats } from '../../types';

export function DashboardScreen() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await apiClient.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'Merchant'}!</Text>
        <Text style={styles.subtitle}>Here's your overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          color="#4F46E5"
          style={styles.statCard}
        />
        <StatCard
          title="Revenue"
          value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
          color="#10B981"
          style={styles.statCard}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Commission"
          value={`$${(stats?.totalCommission || 0).toFixed(2)}`}
          color="#F59E0B"
          style={styles.statCard}
        />
        <StatCard
          title="Wallet Balance"
          value={`$${(stats?.walletBalance || 0).toFixed(2)}`}
          color="#8B5CF6"
          style={styles.statCard}
        />
      </View>

      <Card title="Quick Actions" style={styles.quickActions}>
        <View style={styles.actionRow}>
          <View style={styles.actionItem}>
            <Text style={styles.actionNumber}>{stats?.activeOffers || 0}</Text>
            <Text style={styles.actionLabel}>Active Offers</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
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
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    marginBottom: 0,
  },
  quickActions: {
    marginTop: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionItem: {
    alignItems: 'center',
  },
  actionNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4F46E5',
  },
  actionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
