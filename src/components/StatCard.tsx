import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
  style?: ViewStyle;
}

export function StatCard({
  title,
  value,
  color = '#4F46E5',
  style,
}: StatCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
});
