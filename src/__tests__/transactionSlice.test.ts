import transactionReducer, {
    addTransaction,
    setTransactions,
    deleteTransaction,
    type Transaction,
  } from "@/redux/transactionSlice";
  
  type TransactionState = ReturnType<typeof transactionReducer>;
  
  describe("transactionSlice reducer", () => {
    const initialState: TransactionState = { transactions: [] };
  
    const sampleTxns: Transaction[] = [
      {
        id: "1",
        type: "Витрати",
        amount: 50,
        category: "X",
        date: new Date("2025-01-01"),
        note: "foo",
        userId: "u1",
      },
      {
        id: "2",
        type: "Дохід",
        amount: 100,
        category: "Y",
        date: new Date("2025-02-01"),
        note: "bar",
        userId: "u2",
      },
    ];
  
    it("should return the initial state when called with an unknown action", () => {
      const next = transactionReducer(initialState, { type: "unknown" });
      expect(next).toEqual(initialState);
    });
  
    it("should handle setTransactions", () => {
      const next = transactionReducer(initialState, setTransactions(sampleTxns));
      expect(next.transactions).toEqual(sampleTxns);
    });
  
    it("should handle addTransaction", () => {
      const stateAfterAdd = transactionReducer(
        initialState,
        addTransaction(sampleTxns[0])
      );
      expect(stateAfterAdd.transactions).toHaveLength(1);
      expect(stateAfterAdd.transactions[0]).toEqual(sampleTxns[0]);
  
      const stateAfterSecond = transactionReducer(
        stateAfterAdd,
        addTransaction(sampleTxns[1])
      );
      expect(stateAfterSecond.transactions).toHaveLength(2);
      expect(stateAfterSecond.transactions[1]).toEqual(sampleTxns[1]);
    });
  
    it("should handle deleteTransaction", () => {
      const startState: TransactionState = {
        transactions: [...sampleTxns],
      };
      const stateAfterDelete = transactionReducer(
        startState,
        deleteTransaction("1")
      );
      expect(stateAfterDelete.transactions).toEqual([sampleTxns[1]]);
    });
  });
  