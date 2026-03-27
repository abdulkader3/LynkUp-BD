import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { Loading } from '../../components';
import type {
  DashboardStats,
  OfferPerformance,
  NextSettlement,
} from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function DashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [offerPerformance, setOfferPerformance] =
    useState<OfferPerformance | null>(null);
  const [nextSettlement, setNextSettlement] = useState<NextSettlement | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const [statsData, performanceData, settlementData] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getOfferPerformance().catch(() => null),
        apiClient.getNextSettlement().catch(() => null),
      ]);
      setStats(statsData);
      setOfferPerformance(performanceData);
      setNextSettlement(settlementData);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ', ' +
      date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return { bg: '#dcfce7', text: '#166534' };
      case 'pending':
      case 'processing':
        return { bg: '#ffdbcf', text: '#812800' };
      case 'failed':
      case 'reversed':
      case 'refunded':
        return { bg: '#ffdad6', text: '#93000a' };
      default:
        return { bg: '#e5e7eb', text: '#374151' };
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  const transactions = stats?.lastTransactions || [];
  const pendingOrdersCount = stats?.pendingOrders || 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>LynkUp</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.merchantName}>
                {user?.name || 'Merchant'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate('Profile' as never)}
            >
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'M'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.walletCard}>
          <View style={styles.walletContent}>
            <Text style={styles.walletLabel}>Available Ledger Balance</Text>
            <Text style={styles.walletBalance}>
              {formatCurrency(stats?.walletBalance || 0)}
            </Text>
            <View style={styles.walletTrend}>
              <Text style={styles.trendIcon}>↑</Text>
              <Text style={styles.trendText}>+12.5% from last month</Text>
            </View>
          </View>
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.walletButtonPrimary}>
              <Text style={styles.walletButtonTextPrimary}>Withdraw Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletButtonSecondary}>
              <Text style={styles.walletButtonTextSecondary}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionItem}>
            <View
              style={[styles.quickActionIcon, { backgroundColor: '#dae2ff' }]}
            >
              <Text style={[styles.quickActionIconText, { color: '#001848' }]}>
                🛒
              </Text>
            </View>
            <Text style={styles.quickActionLabel}>Buy Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <View
              style={[styles.quickActionIcon, { backgroundColor: '#b4c5fb' }]}
            >
              <Text style={[styles.quickActionIconText, { color: '#021945' }]}>
                💳
              </Text>
            </View>
            <Text style={styles.quickActionLabel}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <View
              style={[styles.quickActionIcon, { backgroundColor: '#dce9ff' }]}
            >
              <Text style={[styles.quickActionIconText, { color: '#003d9b' }]}>
                📋
              </Text>
            </View>
            <Text style={styles.quickActionLabel}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <View
              style={[styles.quickActionIcon, { backgroundColor: '#ffb59b' }]}
            >
              <Text style={[styles.quickActionIconText, { color: '#380d00' }]}>
                📊
              </Text>
            </View>
            <Text style={styles.quickActionLabel}>Reports</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { borderLeftColor: '#7b2600' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Today's Sales</Text>
              <View style={styles.metricBadge}>
                <Text style={styles.metricBadgeText}>+5.2%</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>
              {formatCurrency(stats?.todaySales?.amount || 0)}
            </Text>
          </View>

          <View style={[styles.metricCard, { borderLeftColor: '#003d9b' }]}>
            <Text style={styles.metricLabel}>Commission Earned</Text>
            <Text style={styles.metricValue}>
              {formatCurrency(stats?.commissionEarned || 0)}
            </Text>
          </View>

          <View style={[styles.metricCard, { borderLeftColor: '#a33500' }]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Pending Orders</Text>
              {pendingOrdersCount > 0 && (
                <View
                  style={[styles.metricBadge, { backgroundColor: '#ffb59b' }]}
                >
                  <Text style={[styles.metricBadgeText, { color: '#380d00' }]}>
                    Action Needed
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.metricValue}>{pendingOrdersCount}</Text>
          </View>
        </View>

        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyText}>No recent transactions</Text>
            </View>
          ) : (
            <View style={styles.transactionsTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { width: '35%' }]}>
                  Reference
                </Text>
                <Text style={[styles.tableHeaderText, { width: '25%' }]}>
                  Type
                </Text>
                <Text style={[styles.tableHeaderText, { width: '20%' }]}>
                  Status
                </Text>
                <Text
                  style={[
                    styles.tableHeaderText,
                    { width: '20%', textAlign: 'right' },
                  ]}
                >
                  Amount
                </Text>
              </View>

              {transactions.slice(0, 5).map((transaction, index) => {
                const statusStyle = getStatusStyle(transaction.status);
                return (
                  <View
                    key={transaction.reference}
                    style={[
                      styles.tableRow,
                      index % 2 === 1 && styles.tableRowAlternate,
                    ]}
                  >
                    <View style={styles.referenceCell}>
                      <Text style={styles.referenceId}>
                        #{transaction.reference}
                      </Text>
                      <Text style={styles.referenceDate}>
                        {formatDate(transaction.createdAt)}
                      </Text>
                    </View>
                    <Text style={styles.typeText} numberOfLines={1}>
                      {transaction.subtype || transaction.type}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.bg },
                      ]}
                    >
                      <Text
                        style={[styles.statusText, { color: statusStyle.text }]}
                      >
                        {transaction.status}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.amountText,
                        {
                          textAlign: 'right',
                          color:
                            transaction.type === 'credit'
                              ? '#166534'
                              : '#0f1c2c',
                        },
                      ]}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.offerPerformanceSection}>
          <Text style={styles.sectionTitle}>Offer Performance</Text>

          <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
              {offerPerformance?.dailyStats &&
              offerPerformance.dailyStats.length > 0
                ? offerPerformance.dailyStats.map((stat, index) => (
                    <View
                      key={index}
                      style={[
                        styles.chartBar,
                        {
                          height: `${Math.min(
                            100,
                            (stat.amount / 10000) * 100,
                          )}%`,
                          backgroundColor: index === 4 ? '#003d9b' : '#dae2ff',
                        },
                      ]}
                    />
                  ))
                : [40, 65, 85, 50, 95, 45, 60].map((height, index) => (
                    <View
                      key={index}
                      style={[
                        styles.chartBar,
                        {
                          height: `${height}%`,
                          backgroundColor: index === 4 ? '#003d9b' : '#dae2ff',
                        },
                      ]}
                    />
                  ))}
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabelText}>Mon</Text>
              <Text style={styles.chartLabelText}>Tue</Text>
              <Text style={styles.chartLabelText}>Wed</Text>
              <Text style={styles.chartLabelText}>Thu</Text>
              <Text style={styles.chartLabelText}>Fri</Text>
              <Text style={styles.chartLabelText}>Sat</Text>
              <Text style={styles.chartLabelText}>Sun</Text>
            </View>
          </View>

          <View style={styles.bestPerforming}>
            <Text style={styles.bestPerformingLabel}>Best Performing</Text>
            <Text style={styles.bestPerformingValue}>Summer Promo #4</Text>
          </View>
        </View>

        <View style={styles.settlementCard}>
          <View style={styles.settlementHeader}>
            <Text style={styles.settlementIcon}>🏦</Text>
            <Text style={styles.settlementTitle}>Next Settlement</Text>
          </View>
          <Text style={styles.settlementDate}>
            {nextSettlement?.nextSettlementDate
              ? `Scheduled for ${new Date(
                  nextSettlement.nextSettlementDate,
                ).toLocaleDateString()}`
              : 'Processing'}
          </Text>
          <Text style={styles.settlementAmount}>
            {nextSettlement
              ? formatCurrency(nextSettlement.estimatedAmount)
              : '$0.00'}
          </Text>
          <View style={styles.settlementProgress}>
            <View
              style={[
                styles.settlementProgressBar,
                {
                  width: nextSettlement?.eligible ? '75%' : '0%',
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navIconActive}>📊</Text>
          <Text style={styles.navLabelActive}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏷️</Text>
          <Text style={styles.navLabel}>Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💰</Text>
          <Text style={styles.navLabel}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#0f1c2c',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f1c2c',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greetingContainer: {
    alignItems: 'flex-end',
  },
  greetingText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    color: '#737685',
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f1c2c',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d6e3fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c3c6d6',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003d9b',
  },
  walletCard: {
    backgroundColor: '#e6eeff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  walletContent: {
    marginBottom: 16,
  },
  walletLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
    color: '#003d9b',
    opacity: 0.8,
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0f1c2c',
    letterSpacing: -0.5,
  },
  walletTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  trendIcon: {
    fontSize: 14,
    color: '#003d9b',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#003d9b',
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  walletButtonPrimary: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  walletButtonTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003d9b',
  },
  walletButtonSecondary: {
    backgroundColor: '#003d9b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  walletButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  quickActionItem: {
    width: (SCREEN_WIDTH - 64) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c3c6d6',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionIconText: {
    fontSize: 20,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    color: '#0f1c2c',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    color: '#737685',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f1c2c',
  },
  metricBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metricBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  transactionsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#c3c6d6',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    color: '#0f1c2c',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003d9b',
  },
  emptyTransactions: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#737685',
  },
  transactionsTable: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#eff4ff',
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    color: '#737685',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tableRowAlternate: {
    backgroundColor: 'rgba(239,244,255,0.5)',
  },
  referenceCell: {
    width: '35%',
  },
  referenceId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f1c2c',
  },
  referenceDate: {
    fontSize: 11,
    color: '#737685',
    marginTop: 2,
  },
  typeText: {
    fontSize: 12,
    color: '#434654',
    width: '25%',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    width: '20%',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    width: '20%',
  },
  offerPerformanceSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    paddingHorizontal: 4,
  },
  chartBar: {
    width: '12%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabelText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#737685',
  },
  bestPerforming: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#c3c6d6',
  },
  bestPerformingLabel: {
    fontSize: 12,
    color: '#737685',
  },
  bestPerformingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f1c2c',
  },
  settlementCard: {
    backgroundColor: '#e6eeff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,61,155,0.1)',
  },
  settlementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  settlementIcon: {
    fontSize: 18,
  },
  settlementTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    color: '#003d9b',
  },
  settlementDate: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    color: '#737685',
    marginBottom: 4,
  },
  settlementAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f1c2c',
  },
  settlementProgress: {
    marginTop: 16,
    height: 6,
    backgroundColor: '#c3c6d6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  settlementProgressBar: {
    height: '100%',
    backgroundColor: '#003d9b',
    borderRadius: 3,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,28,44,0.06)',
    shadowColor: '#0f1c2c',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  navItemActive: {
    backgroundColor: '#dae2ff',
    borderRadius: 12,
  },
  navIcon: {
    fontSize: 20,
    color: '#737685',
  },
  navIconActive: {
    fontSize: 20,
    color: '#003d9b',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    color: '#737685',
    marginTop: 4,
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    color: '#003d9b',
    marginTop: 4,
  },
});
