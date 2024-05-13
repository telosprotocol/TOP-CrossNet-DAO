import { create } from 'zustand';
import { getEthereum, getWeb3 } from '../eth';
import { accuracy } from '../utils';
import { IS_CONNECT_STORAGE_KEY } from '@/utils/config';
import { useEffect } from 'react';
import { getTokenInfo } from '@/eth/method';
const fevmChainId = process.env.NEXT_PUBLIC_CHAIN_ID || '';
// import { switchToChain } from '@/components/SwitchChainDialog'

interface AccountState {
  account: string;
  chainId: string;
  balance: number;
  balanceTop: number;
  balanceVsc: number;
  connectLoading: boolean;
  changeAccount: (by: string) => void;
  changeChainId: (by: string) => void;
  disConnectToWallect: () => void;
  toggleBalance: () => void;
  connectToWallect: () => Promise<void>;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  connectLoading: false,
  account: '',
  balance: 0,
  balanceTop: 0,
  balanceVsc: 0,
  changeAccount: (account: string) => set(() => ({ account })),
  chainId: '-1',
  changeChainId: (chainId: string) => set(() => ({ chainId })),
  connectToWallect: async () => {
    try {
      set(() => ({ connectLoading: true }));
      const ethereum = getEthereum();
      if (!ethereum) {
        set(() => ({ connectLoading: false }));
        return;
      }
      let accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      const chainId = await ethereum.request({
        method: 'eth_chainId',
      });
      localStorage.setItem('_account', accounts[0].toLowerCase());
      localStorage.setItem('_netId', chainId);
      localStorage.setItem('_netName', chainId);
      set(() => ({ account: accounts[0].toLowerCase(), chainId }));
      get().toggleBalance();
      localStorage.setItem(IS_CONNECT_STORAGE_KEY, '1');
      set(() => ({ connectLoading: false }));
    } catch (error) {
      set(() => ({ connectLoading: false }));
    }
  },
  disConnectToWallect: () => {
    localStorage.setItem(IS_CONNECT_STORAGE_KEY, '0');
    window.location.reload();
  },
  toggleBalance: async () => {
    const account = get().account;
    const chainId = get().chainId;
    if (!account || chainId !== fevmChainId) {
      return;
    }
    try {
      const { balance: balanceTop, decimals: decimalsTop } = await getTokenInfo(
        account,
        process.env.NEXT_PUBLIC_TOP_TOKEN_CONTRACT || '',
      );
      const { balance: balanceVsc, decimals: decimalsVsc } = await getTokenInfo(
        account,
        process.env.NEXT_PUBLIC_VSC_TOKEN_CONTRACT || '',
      );
      set(() => ({
        balanceTop: accuracy(Number(balanceTop), decimalsTop, 2),
        balanceVsc: accuracy(Number(balanceVsc), decimalsVsc, 2),
      }));
    } catch (error) {
      console.log('getBalance error');
    }
  },
}));

export default useAccountStore;

export function useInitConnectWallect() {
  useEffect(() => {
    const isConnect = localStorage.getItem(IS_CONNECT_STORAGE_KEY) || '0';

    if (isConnect === '1') {
      refresh();
    }
    function refresh() {
      useAccountStore.getState().connectToWallect();
    }
    const ethereum = getEthereum();
    if (ethereum && typeof ethereum.on === 'function') {
      ethereum.on('accountsChanged', refresh);
      ethereum.on('chainChanged', refresh);
    }
  }, []);

  useEffect(() => {
    const interId = setInterval(() => {
      useAccountStore.getState().toggleBalance();
    }, 10000);
    return () => clearInterval(interId);
  }, []);
}
