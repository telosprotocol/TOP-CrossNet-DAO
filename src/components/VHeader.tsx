import useAccountStore from '@/store/account';
import { useIsClient } from 'usehooks-ts';

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import useAppStore from '@/store/appStore';

import ConnectWallet from './ConnectWallet';
import Network from './Network';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, Settings } from 'lucide-react';
import { formatAddress } from '@/utils';

export default function Header() {
  const account = useAccountStore((state) => state.account);

  const isClient = useIsClient();

  const router = useRouter();

  const title = useAppStore((state) => state.title);
  return (
    <header className="bg-[url('/images/headerBg.png')]">
      <div className="px-4 container mx-auto h-14 flex justify-between items-center relative z-10 sm:h-[100px] ">
        <div className="flex items-center text-white text-2xl  md:hidden">
          {router.asPath === '/' ? (
            <Link href="/">Weshare.DAO</Link>
          ) : (
            <div className="flex items-center md:hidden">
              <ChevronLeft
                className=" cursor-pointer w-[24px] mr-2 "
                onClick={() => {
                  useAppStore.getState().changeTitle('');
                  router.push('/');
                }}
              />{' '}
              <span className="max-w-[60vw] truncate">{title}</span>
            </div>
          )}
        </div>
        <div className="items-center text-white text-2xl  hidden md:flex">
          <Link href="/">Weshare.DAO</Link>
          <Link
            href="/"
            className={`ml-[68px] text-lg  border-[#FFEF9F] h-[100px]	leading-[100px] mr-10 ${
              router.asPath === '/' ? 'border-b-4' : ''
            }`}>
            提案列表
          </Link>
          {/* <span
            className={`cursor-pointer text-lg  border-[#FFEF9F] h-[100px]	leading-[100px]  ${
              router.pathname === '/details' ? 'border-b-4' : ''
            }`}>
            执行结果
          </span> */}
        </div>
        <div className="flex justify-between grow sm:grow-0 items-center">
          <Network />
          {isClient && (
            <>
              {account ? (
                <div className="flex items-center">
                  <div
                    onClick={() => useAppStore.getState().changeOpenWallet(true)}
                    className="md:flex items-center md:p-1.5 cursor-pointer md:rounded-full md:bg-[rgba(255,255,255,0.2)]">
                    <div className="hidden md:flex items-center">
                      <Jazzicon diameter={30} seed={jsNumberForAddress(account)} />
                    </div>
                    <div className="md:hidden flex items-center">
                      <Jazzicon diameter={40} seed={jsNumberForAddress(account)} />
                    </div>
                    <span className="hidden md:inline-block text-[#ffffff] text-sm font-semibold mx-1.5">
                      {formatAddress(account)}
                    </span>
                    <Settings color="#ffffff" className="hidden md:inline-block"></Settings>
                  </div>
                </div>
              ) : (
                <ConnectWallet />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
