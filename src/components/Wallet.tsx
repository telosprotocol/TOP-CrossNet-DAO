import useAccountStore from '@/store/account';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { copyToClipboard, formatAddress } from '@/utils';
import Transactions from './Transactions';
import { ScrollArea } from '@/components/ui/scroll-area';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import useAppStore from '@/store/appStore';
import topiaLogo from '../assets/images/logo128.png';
import metamaskLogo from '../assets/images/metamask.svg';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { ETHEREUM_STORAGE_KEY } from '@/utils/config';
import { Tools } from './Tools';
import useIsVoter from '@/hooks/useIsVoter';

export default function Wallet() {
  const account = useAccountStore((state) => state.account);
  const balance = useAccountStore((state) => state.balanceTop);
  const balanceVsc = useAccountStore((state) => state.balanceVsc);
  let f4Address = '';
  let type: string = '';
  if (account !== '') {
    f4Address = account.replace('0x', 'T60004');
    type = localStorage.getItem(ETHEREUM_STORAGE_KEY) || '';
  }

  const isVoter = useIsVoter();
  return (
    <div className="h-full bg-white rounded-2xl shadow-lg md:h-[680px]">
      <div className="font-bold text-xl mb-6 px-6 pt-6 bg-white flex items-center justify-between rounded-md">
        <span>Wallet</span>
        <LogOut
          color="#666666"
          className=" cursor-pointer"
          // onClick={() => useAppStore.getState().changeOpenWallet(false)}
          onClick={() => useAccountStore.getState().disConnectToWallect()}
        />
      </div>
      <div className="flex items-center mb-4 px-6 bg-white">
        <div className="flex">
          <div className="relative h-[44px]">
            <Jazzicon diameter={44} seed={jsNumberForAddress(account)} />
            <Image
              src={type === 'topia' ? topiaLogo : metamaskLogo}
              alt=""
              width={20}
              height={20}
              className="absolute right-0 bottom-0"
            />
          </div>
        </div>
        <div className="ml-2.5 flex-grow">
          <div
            className="text-bold flex justify-between items-center group cursor-pointer"
            onClick={() => {
              copyToClipboard(account);
              toast.success('Copyed!');
            }}>
            {formatAddress(account)}
            <div className="text-[#C9C9C9] group-hover:text-[#8745F1]">
              <Copy size={12} />
            </div>
          </div>
          <div
            className="text-bold flex justify-between items-center group cursor-pointer"
            onClick={() => {
              copyToClipboard(f4Address);
              toast.success('Copyed!');
            }}>
            {f4Address ? formatAddress(f4Address) : ''}
            <div className="text-[#C9C9C9] group-hover:text-[#8745F1]">
              <Copy size={12} />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 px-6 bg-white">
        <div className="text-[#2C1843] text-sm">
          账户状态: <span className="text-primary">{isVoter ? '投票者' : '非投票者'}</span>
        </div>
      </div>
      <WalletTab />
    </div>
  );
}

function WalletTab() {
  const selectWalletTab = useAppStore((state) => state.selectWalletTab);
  return (
    <Tabs
      value={selectWalletTab}
      className="w-full"
      onValueChange={(e) => {
        useAppStore.getState().changeSelectWalletTab(e);
      }}>
      <TabsList className="grid w-full grid-cols-2 bg-white px-4 py-0 h-auto">
        <TabsTrigger
          value="Activities"
          className="rounded-none border-white text-black shadow-none border-b-2 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none">
          Activities
        </TabsTrigger>
        <TabsTrigger
          value="Toolkits"
          className="rounded-none border-white text-black shadow-none border-b-2 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none">
          Toolkits
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="Activities"
        className="bg-[#F7F8FC] px-4 mt-0"
        style={{ outline: 'none', boxShadow: 'none' }}>
        <ScrollArea className=" w-full h-[calc(100vh-320px)] md:h-[450px] max-h-[calc(100vh-320px)]">
          <Transactions />
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="Toolkits"
        className="bg-[#F7F8FC] px-4 mt-0"
        style={{ outline: 'none', boxShadow: 'none' }}>
        <ScrollArea className=" w-[full] h-[calc(100vh-320px)] md:h-[450px] max-h-[calc(100vh-320px)]">
          <Tools></Tools>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
