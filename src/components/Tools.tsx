import EnptyData from './EnptyData';
import fqta from '../assets/images/fqta.png';
import taqd from '../assets/images/taqd.png';
import zjtagn from '../assets/images/zjtagn.png';
import xjlc from '../assets/images/xjlc.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useIsVoter from '@/hooks/useIsVoter';
import useAppStore from '@/store/appStore';

export function Tools() {
  const router = useRouter();
  const isVoter = useIsVoter();
  return (
    <div className="py-3">
      {!isVoter ? (
        <EnptyData type="Toolkits"></EnptyData>
      ) : (
        <div>
          <div
            className="mb-3 flex items-center text-[#333333] text-sm rounded-md py-[20px] pl-[33px] bg-white cursor-pointer"
            onClick={() => {
              if (window.innerWidth < 640) {
                router.push('/createProposal');
              } else {
                useAppStore.getState().changeOpenCreate(true);
              }
              useAppStore.getState().changeOpenWallet(false);
            }}>
            <Image src={fqta} className=" w-[32px] mr-[33px]" alt="" />
            发起提案
          </div>
          <div
            className="mb-3 flex items-center text-[#333333] text-sm rounded-md py-[20px] pl-[33px] bg-white cursor-pointer"
            onClick={() => {
              if (window.innerWidth < 640) {
                router.push('/proposalList');
              } else {
                useAppStore.getState().changeTempList(true);
              }
              useAppStore.getState().changeOpenWallet(false);
            }}>
            <Image src={taqd} className=" w-[32px] mr-[33px]" alt="" />
            提案清单
          </div>
          {/* <div className="mb-3 flex items-center text-[#333333] text-sm rounded-md py-[20px] pl-[33px] bg-white cursor-pointer">
          <Image src={zjtagn} className=" w-[32px] mr-[33px]" alt="" />
          增加提案功能
        </div> */}
          <div
            className="mb-3 flex items-center text-[#333333] text-sm rounded-md py-[20px] pl-[33px] bg-white cursor-pointer"
            onClick={() => {
              if (window.innerWidth < 640) {
                router.push('/electionDesc');
              } else {
                useAppStore.getState().changeOpenElectionDesc(true);
              }

              useAppStore.getState().changeOpenWallet(false);
            }}>
            <Image src={xjlc} className=" w-[32px] mr-[33px]" alt="" />
            选举轮次说明
          </div>
        </div>
      )}
    </div>
  );
}
