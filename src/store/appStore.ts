import { create } from 'zustand';

interface AppState {
  isConnect: boolean;
  changeIsConnect: (by: boolean) => void;
  showSwitchDialog: boolean;
  changeShowSwitchDialog: (show: boolean) => void;
  openWallet: boolean;
  changeOpenWallet: (by: boolean) => void;
  selectWalletTab: string;
  changeSelectWalletTab: (by: string) => void;
  createProposalId: string;
  changeCreateProposalId: (by: string) => void;
  title: string;
  changeTitle: (by: string) => void;
  openElectionDesc: boolean;
  changeOpenElectionDesc: (by: boolean) => void;
  openCreate: boolean;
  changeOpenCreate: (by: boolean) => void;
  tempList: boolean;
  changeTempList: (by: boolean) => void;
  openDetails: string;
  changeOpenDetails: (by: string) => void;
}

const useAppStore = create<AppState>((set) => ({
  isConnect: false,
  changeIsConnect: (isConnect: boolean) => set(() => ({ isConnect })),
  showSwitchDialog: false,
  changeShowSwitchDialog: (show) => {
    set(() => ({ showSwitchDialog: show }));
  },
  openWallet: false,
  changeOpenWallet: (openWallet: boolean) => set(() => ({ openWallet })),
  selectWalletTab: 'Activities',
  changeSelectWalletTab: (selectWalletTab: string) => set(() => ({ selectWalletTab })),
  createProposalId: '',
  changeCreateProposalId: (createProposalId: string) => set(() => ({ createProposalId })),
  title: '',
  changeTitle: (title: string) => set(() => ({ title })),
  openElectionDesc: false,
  changeOpenElectionDesc: (openElectionDesc: boolean) => set(() => ({ openElectionDesc })),
  openCreate: false,
  changeOpenCreate: (openCreate: boolean) => set(() => ({ openCreate })),
  tempList: false,
  changeTempList: (tempList: boolean) => set(() => ({ tempList })),
  openDetails: '',
  changeOpenDetails: (openDetails: string) => set(() => ({ openDetails })),
}));

export default useAppStore;

export function openTransDialog() {
  useAppStore.getState().changeSelectWalletTab('Activities');
  useAppStore.getState().changeOpenWallet(true);
  window.scrollTo(0, 0);
}