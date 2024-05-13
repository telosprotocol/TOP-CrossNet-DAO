import { getWeb3 } from '@/eth';
import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import useAccountStore from './account';
// import useAccountStore from './account'

export type ITransItem = {
  hash: string;
  account: string;
  methodName: string;
  methodAddress: string;
  value: string;
  status: ITransStatus;
  time: number;
  unit: string;
};

type ITransStatus = 'pending' | 'error' | 'success';

interface TransactionState {
  transList: ITransItem[];
  add: (item: ITransItem) => void;
  remove: (hash: string) => void;
  update: (hash: string, toStatus: ITransStatus) => void;
}
type MyPersist = (
  config: StateCreator<TransactionState>,
  options: PersistOptions<TransactionState>,
) => StateCreator<TransactionState>;
const useTransactionStore = create<TransactionState>(
  (persist as MyPersist)(
    (set) => ({
      transList: [],
      add: (item: ITransItem) => {
        set((state) => {
          const list = [item, ...state.transList];
          if (list.length > 40) {
            list.length = 40;
          }
          return { transList: list };
        });
        setTimeout(() => {
          processTransStatus();
        }, 1000);
      },
      remove: (hash: string) =>
        set((state) => {
          return {
            transList: state.transList.filter((item) => item.hash !== hash),
          };
        }),
      update: (hash: string, toStatus: ITransStatus) => {
        set((state) => {
          const tmpList = [...state.transList];
          for (let index = 0; index < tmpList.length; index++) {
            const element = tmpList[index];
            if (element.hash === hash) {
              element.status = toStatus;
              return { transList: tmpList };
            }
          }
          return {};
        });
      },
    }),
    {
      name: '_TRANSACTION_KEY',
    },
  ),
);

export default useTransactionStore;

export function useAccountTransList() {
  const transList = useTransactionStore((state) => state.transList);
  const account = useAccountStore((state) => state.account);
  if (!account) {
    return [];
  }
  return transList.filter((item) => item.account === account);
}

export function processTransStatus() {
  // setTimeout(() => {
  //   const web3 = getWeb3();
  //   web3.eth.getTransactionReceipt(
  //     '0xb12644e2c75f180976ec6893f166bffa19d4f3b83551fa8060ddebf0d9b045dd',
  //   ).then(res => {console.log(res)});
  // }, 3000)
  const now = Date.now();
  const pendList = useTransactionStore
    .getState()
    .transList.filter(
      (item) =>
        item.status === 'pending' &&
        item.hash.length === 66 &&
        now - item.time < 24 * 60 * 60 * 1000,
    );
  if (pendList.length > 0) {
    const web3 = getWeb3();
    pendList.forEach(async (item) => {
      try {
        const res = await web3.eth.getTransactionReceipt(item.hash);
        if (res) {
          useTransactionStore.getState().update(item.hash, res.status ? 'success' : 'error');
        }
      } catch (error) {}
    });
    setTimeout(processTransStatus, 5000);
  }
}
processTransStatus();
