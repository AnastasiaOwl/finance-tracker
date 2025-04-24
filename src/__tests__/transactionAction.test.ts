jest.mock('@/firebase/firebaseConfig', () => ({
  db: {},
  auth: {},
  googleProvider: {},
}));

import {
  addTransactionAsync,
  deleteTransactionAsync,
  fetchTransactionAsync,
} from '../redux/transactionActions';
import {
  addTransaction,
  deleteTransaction,
  setTransactions,
  Transaction,
} from '../redux/transactionSlice';
import * as api from '@/firebase/firebaseApi';
import type { AppDispatch } from '../redux/store';

jest.mock('@/firebase/firebaseApi');

describe('transactionActions async thunks', () => {
  let dispatch: jest.MockedFunction<AppDispatch>;
  const mockDate = new Date('2025-04-24T00:00:00Z');
  const baseTransaction: Omit<Transaction, 'id'> = {
    type: 'Дохід',
    amount: 100,
    category: 'TestCategory',
    date: mockDate,
    note: 'Test note',
    userId: 'user1',
  };

  beforeEach(() => {
    dispatch = jest.fn() as jest.MockedFunction<AppDispatch>;
    jest.clearAllMocks();
  });

  describe('addTransactionAsync', () => {
    it('dispatches addTransaction and logs success', async () => {
      const newId = 'abc123';
      (api.addTransactionToFirestore as jest.Mock).mockResolvedValue(newId);
      console.log = jest.fn();

      await addTransactionAsync({ ...baseTransaction } as Transaction)(dispatch);

      expect(api.addTransactionToFirestore).toHaveBeenCalledWith(
        expect.objectContaining(baseTransaction)
      );
      expect(dispatch).toHaveBeenCalledWith(
        addTransaction({ ...baseTransaction, id: newId })
      );
      expect(console.log).toHaveBeenCalledWith(
        '✅ Transaction added to Redux and Firestore'
      );
    });

    it('logs error on failure without dispatch', async () => {
      const error = new Error('fail');
      (api.addTransactionToFirestore as jest.Mock).mockRejectedValue(error);
      console.error = jest.fn();

      await addTransactionAsync({ ...baseTransaction } as Transaction)(dispatch);

      expect(console.error).toHaveBeenCalledWith(
        '❌ Error adding transaction:',
        error
      );
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe('deleteTransactionAsync', () => {
    it('dispatches deleteTransaction and logs success', async () => {
      const id = '1';
      (api.deleteTransactionFirestore as jest.Mock).mockResolvedValue(undefined);
      console.log = jest.fn();

      await deleteTransactionAsync(id)(dispatch);

      expect(api.deleteTransactionFirestore).toHaveBeenCalledWith(id);
      expect(dispatch).toHaveBeenCalledWith(deleteTransaction(id));
      expect(console.log).toHaveBeenCalledWith(
        '✅ Transaction deleted from Redux and Firestore'
      );
    });

    it('logs error on failure without dispatch', async () => {
      const error = new Error('fail-delete');
      const id = '1';
      (api.deleteTransactionFirestore as jest.Mock).mockRejectedValue(error);
      console.error = jest.fn();

      await deleteTransactionAsync(id)(dispatch);

      expect(console.error).toHaveBeenCalledWith(
        '❌ Error deleting transaction:',
        error
      );
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe('fetchTransactionAsync', () => {
    it('dispatches setTransactions and logs success', async () => {
      const transactions: Transaction[] = [{ id: '1', ...baseTransaction }];
      (api.fetchTransactions as jest.Mock).mockResolvedValue(transactions);
      console.log = jest.fn();

      await fetchTransactionAsync()(dispatch);

      expect(api.fetchTransactions).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setTransactions(transactions));
      expect(console.log).toHaveBeenCalledWith(
        '✅ Transactions loaded into Redux'
      );
    });

    it('logs error on failure without dispatch', async () => {
      const error = new Error('fail-fetch');
      (api.fetchTransactions as jest.Mock).mockRejectedValue(error);
      console.error = jest.fn();

      await fetchTransactionAsync()(dispatch);

      expect(console.error).toHaveBeenCalledWith(
        '❌ Error loading transactions:',
        error
      );
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});