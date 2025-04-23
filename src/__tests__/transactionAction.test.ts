// src/__tests__/transactionActions.test.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import configureMockStore from 'redux-mock-store';
import type { AnyAction, Middleware, Dispatch } from 'redux';

const thunkMiddleware = (require('redux-thunk') as any) as Middleware<
  any,           // state type (we don't care here)
  AnyAction,     // action type
  Dispatch<AnyAction> // dispatch type
>;

import * as api from '@/firebase/firebaseApi';
import {
  addTransactionAsync,
  deleteTransactionAsync,
  fetchTransactionAsync,
} from '@/redux/transactionActions';
import {
  addTransaction,
  deleteTransaction,
  setTransactions,
  type Transaction,
} from '@/redux/transactionSlice';

const mockStore = configureMockStore<any, AnyAction>([thunkMiddleware]);

jest.mock('@/firebase/firebaseApi', () => ({
  addTransactionToFirestore: jest.fn(),
  deleteTransactionFirestore: jest.fn(),
  fetchTransactions: jest.fn(),
}));

describe('transaction async thunks', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({ transactions: [] });
    jest.clearAllMocks();
  });

  it('dispatches addTransaction on successful addTransactionAsync', async () => {
    const fakeTxn: Omit<Transaction, 'id'> = {
      type: 'Дохід',
      amount: 123,
      category: 'Test',
      date: new Date(),
      note: '',
      userId: 'u1',
    };
    (api.addTransactionToFirestore as jest.Mock).mockResolvedValue('new-id');

    await store.dispatch(addTransactionAsync(fakeTxn as any) as any);

    expect(store.getActions()).toEqual([
      addTransaction({ ...fakeTxn, id: 'new-id' }),
    ]);
    expect(api.addTransactionToFirestore).toHaveBeenCalledWith(fakeTxn);
  });

  it('dispatches deleteTransaction on successful deleteTransactionAsync', async () => {
    (api.deleteTransactionFirestore as jest.Mock).mockResolvedValue(undefined);

    await store.dispatch(deleteTransactionAsync('tx-123') as any);

    expect(store.getActions()).toEqual([deleteTransaction('tx-123')]);
    expect(api.deleteTransactionFirestore).toHaveBeenCalledWith('tx-123');
  });

  it('dispatches setTransactions on successful fetchTransactionAsync', async () => {
    const mockList: Transaction[] = [
      {
        id: '1',
        type: 'Витрати',
        amount: 50,
        category: 'A',
        date: new Date(),
        note: '',
        userId: 'u',
      },
    ];
    (api.fetchTransactions as jest.Mock).mockResolvedValue(mockList);

    await store.dispatch(fetchTransactionAsync() as any);

    expect(store.getActions()).toEqual([setTransactions(mockList)]);
    expect(api.fetchTransactions).toHaveBeenCalled();
  });
});
