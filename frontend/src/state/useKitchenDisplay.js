import { useState, useEffect, useCallback } from 'react';
import { fetchOrders, markOrderReady } from '../services/api';
import { calculateTotal } from '../logic/calculations';

const POLL_INTERVAL = 2000;

export const useKitchenDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Cannot connect to server. Orders will appear when backend is running.');
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const handleMarkReady = async (orderId) => {
    try {
      await markOrderReady(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'ready' } : o))
      );
    } catch (err) {
      console.error('Failed to mark order ready:', err);
    }
  };

  return { orders, error, handleMarkReady, calculateTotal };
};
