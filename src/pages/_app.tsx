import '@/styles/globals.css';
import type { AppProps } from 'next/app';
// import '../i18n'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useInitLocalStorageLang } from '../i18n'
import { useInitConnectWallect } from '@/store/account';
import { useInitTrack } from '@/lib/track';
import { Toaster } from 'react-hot-toast';
import useAppStore from '@/store/appStore';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Wallet from '@/components/Wallet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ElectionDescComp from '@/components/ElectionDescComp';
import CreateProposalComp from '@/components/CreateProposalComp';
import ProposalListComp from '@/components/ProposalListComp';
import DetailsComp from '@/components/DetailsComp';
import { DialogOverlay } from '@radix-ui/react-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const queryClient = new QueryClient();

console.log(process.env.NEXT_PUBLIC_BUILD_ID);

export default function App({ Component, pageProps }: AppProps) {
  // useInitLocalStorageLang()
  useInitConnectWallect();
  useInitTrack();

  const openWallet = useAppStore((state) => state.openWallet);
  const openElectionDesc = useAppStore((state) => state.openElectionDesc);
  const openCreate = useAppStore((state) => state.openCreate);
  const tempList = useAppStore((state) => state.tempList);
  const openDetails = useAppStore((state) => state.openDetails);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Component {...pageProps} />
      <Sheet
        open={openWallet}
        onOpenChange={(v) => {
          useAppStore.getState().changeOpenWallet(v);
        }}>
        <SheetContent className="max-w-[375px] w-full  !outline-none pt-16 md:pt-28">
          <Wallet />
        </SheetContent>
      </Sheet>
      <Dialog
        open={openElectionDesc}
        onOpenChange={(v) => {
          useAppStore.getState().changeOpenElectionDesc(v);
        }}>
        <DialogContent className="p-0 rounded-3xl md:rounded-3xl overflow-hidden xl:max-w-[1200px] sm:max-w-[600px]">
          <div className="bg-[#9900FF] h-[48px] leading-[48px] text-white pl-8 text-lg">
            选举轮次说明
          </div>
          <ElectionDescComp></ElectionDescComp>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openCreate}
        onOpenChange={(v) => {
          useAppStore.getState().changeOpenCreate(v);
        }}>
        <DialogContent className="p-0 rounded-3xl md:rounded-3xl overflow-hidden xl:max-w-[1200px] sm:max-w-[600px] text-white">
          <div className="bg-[#9900FF] h-[48px] leading-[48px] text-white pl-8 text-lg">
            发起提案
          </div>
          <ScrollArea className="max-h-[80vh] w-full rounded-md border-none">
            <CreateProposalComp></CreateProposalComp>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Dialog
        open={tempList}
        onOpenChange={(v) => {
          useAppStore.getState().changeTempList(v);
        }}>
        <DialogContent className="p-0 rounded-3xl md:rounded-3xl overflow-hidden xl:max-w-[1200px] sm:max-w-[600px] text-white">
          <div className="bg-[#9900FF] h-[48px] leading-[48px] text-white pl-8 text-lg">
            提案清单
          </div>
          <ScrollArea className="max-h-[80vh] w-full rounded-md border-none">
            <ProposalListComp></ProposalListComp>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDetails ? true : false}
        onOpenChange={(v) => {
          useAppStore.getState().changeOpenDetails(v ? '_' : '');
        }}>
        <DialogContent className="p-0 rounded-3xl md:rounded-3xl overflow-hidden xl:max-w-[1200px] sm:max-w-[600px] text-white">
          <DetailsComp
            proposalId={openDetails}
            wrap={(c: any) => (
              <ScrollArea className="max-h-[80vh] h-full w-full rounded-md border-none">{c}</ScrollArea>
            )}>
            {(t: any) => (
              <div className="bg-[#9900FF] h-[48px] leading-[48px] text-white pl-8 text-lg">
                提案#{t}
              </div>
            )}
          </DetailsComp>
        </DialogContent>
      </Dialog>
    </QueryClientProvider>
  );
}
