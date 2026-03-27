import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { apiClient } from '../../services/api';
import { Card, Loading } from '../../components';
import type { Wallet, Transaction } from '../../types';

export function WalletScreen() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [walletData, transactionsData] = await Promise.all([
        apiClient.getWallet(),
        apiClient.getTransactions(),
      ]);
      setWallet(walletData);
      setTransactions(transactionsData.data);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          item.type === 'credit' ? styles.credit : styles.debit,
        ]}
      >
        {item.type === 'credit' ? '+' : '-'}${item.amount.toFixed(2)}
      </Text>
    </View>
  );

  if (loading) {
    return <Loading message="Loading wallet..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <Card style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceValue}>
                ${(wallet?.balance || 0).toFixed(2)}
              </Text>
              <View style={styles.balanceRow}>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceItemLabel}>Pending</Text>
                  <Text style={styles.balanceItemValue}>
                    ${(wallet?.pendingBalance || 0).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceItemLabel}>Total Earned</Text>
                  <Text style={styles.balanceItemValue}>
                    ${(wallet?.totalEarnings || 0).toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card>

            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No transactions yet</Text>
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
  balanceCard: {
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceItemLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  balanceItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  credit: {
    color: '#10B981',
  },
  debit: {
    color: '#EF4444',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
