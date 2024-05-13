import { ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { ETHEREUM_STORAGE_KEY } from '@/utils/config';
import { getEthereum } from '@/eth';
import useAccountStore from '@/store/account';
import topiaLogo from '../assets/images/logo128.png';
import metamaskLogo from '../assets/images/metamask.svg';
import Image from 'next/image';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import useAppStore from '@/store/appStore';

export default function ConnectWallet() {
  const connectToWallect = useAccountStore((state) => state.connectToWallect);
  const connectLoading = useAccountStore((state) => state.connectLoading);
  const showSwitchDialog = useAppStore((state) => state.showSwitchDialog);

  const [connType, setConnType] = useState('');

  function connect(type: string) {
    if (connectLoading) {
      return;
    }
    localStorage.setItem(ETHEREUM_STORAGE_KEY, type);
    const ethereum = getEthereum();
    setConnType(type);
    if (!ethereum) {
      if (type === 'topia') {
        window.open('https://www.topiawallet.io/', 'blank');
      } else {
        window.open('https://metamask.io/', 'blank');
      }
      return;
    }
    connectToWallect();
  }

  return (
    <Dialog
      open={showSwitchDialog}
      onOpenChange={(v) => {
        useAppStore.getState().changeShowSwitchDialog(v);
      }}>
      <DialogTrigger className=" bg-white text-primary text-xs font-bold px-[14px] py-[10px] rounded-2xl shadow-md sm:text-base sm:px-[37px] sm:py-[13px] sm:rounded-full">
        Connect
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Connect a wallet?</DialogTitle>
          <div>
            {/* <div className="mb-5 mt-8">
              <button
                onClick={() => connect('topia')}
                className="w-full active:opacity-70 flex h-14 items-center px-6 border border-[#E4E4E4] rounded-lg">
                {connectLoading && connType === 'topia' ? (
                  <ReloadIcon className="mr-4 h-4 w-4 animate-spin" color="#7746EF" />
                ) : (
                  <Image src={topiaLogo} alt="" width={28} height={28} className="mr-4" />
                )}
                <span className="mr-2.5">Topia</span> <ChevronRight size={15} color="#717171" />
              </button>
            </div> */}
            <div className="mb-4 mt-8">
              <button
                onClick={() => connect('metamask')}
                className="w-full active:opacity-70 flex h-14 items-center px-6 border border-[#E4E4E4] rounded-lg">
                {connectLoading && connType === 'metamask' ? (
                  <ReloadIcon className="mr-4 h-4 w-4 animate-spin" color="#7746EF" />
                ) : (
                  <Image src={metamaskLogo} alt="" width={28} height={28} className="mr-4" />
                )}
                <span className="mr-2.5">Metamask</span>
                <ChevronRight size={15} color="#717171" />
              </button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
