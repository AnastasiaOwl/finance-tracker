import * as api from '../firebase/firebaseApi';
import { auth } from '../firebase/firebaseConfig';
import { getDocs, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

jest.mock('../firebase/firebaseConfig', () => ({
  db: {},
  auth: { get currentUser() { return null } },
}));

jest.mock('firebase/firestore', () => {
  class MockTimestamp {
    private _d: Date;
    constructor(d: Date) { this._d = d; }
    toDate() { return this._d; }
    static fromDate(d: Date) { return new MockTimestamp(d); }
  }

  return {
    getFirestore: jest.fn(() => ({})),
    collection:   jest.fn(),
    getDocs:      jest.fn(),
    addDoc:       jest.fn(),
    deleteDoc:    jest.fn(),
    doc:          jest.fn(),
    setDoc:       jest.fn(),
    Timestamp:    MockTimestamp,
  };
});

describe('fetchTransactions', () => {
  afterEach(() => jest.restoreAllMocks());

  it('throws if no user is logged in', async () => {
    jest.spyOn(auth, 'currentUser', 'get').mockReturnValue(null);
    await expect(api.fetchTransactions())
      .rejects.toThrow('No user is currently logged in!');
  });

  it('converts Firestore Timestamp to Date', async () => {
    const fakeDate = new Date(2020, 1, 1);
    const mockTimestamp = new Timestamp(fakeDate);

    const fakeUser = { uid: 'u1' } as User;
    jest.spyOn(auth, 'currentUser', 'get').mockReturnValue(fakeUser);

    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{
        id: 'tx1',
        data: () => ({
          amount:   5,
          date:     mockTimestamp,
          type:     'Дохід',
          category: 'foo',
          userId:   'u1',
        })
      }]
    });

    const result = await api.fetchTransactions();
    expect(result).toEqual([
      expect.objectContaining({ id: 'tx1', date: fakeDate, amount: 5 })
    ]);
  });

  it('returns [] on Firestore errors', async () => {
    const fakeUser = { uid: 'u1' } as User;
    jest.spyOn(auth, 'currentUser', 'get').mockReturnValue(fakeUser);
    (getDocs as jest.Mock).mockRejectedValue(new Error('fail'));
    console.error = jest.fn();

    const result = await api.fetchTransactions();
    expect(console.error).toHaveBeenCalledWith(
      '❌ Error fetching transactions:',
      expect.any(Error)
    );
    expect(result).toEqual([]);
  });
});
