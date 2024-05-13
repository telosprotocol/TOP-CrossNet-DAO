import { Card } from '@/components/ui/card';
import useAppStore from '@/store/appStore';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect } from 'react';

import xjlc_ry from '../assets/images/xjlc_ry.png';

export default function ElectionDescComp() {
  useEffect(() => {
    useAppStore.getState().changeTitle('选举轮次说明');
  }, []);
  return (
    <div>
      <div className=" bg-[#EBEDFF] sm:bg-white p-4 min-h-[100vh] sm:min-h-0 sm:mb-[100px]">
        <div className=" max-w-[640px] mx-auto">
          <Card className="px-[20px] py-[26px] sm:border-none sm:shadow-none">
            <div className="flex justify-center mb-[26px]">
              <Image src={xjlc_ry} alt="" className="w-[119px] h-[128px]" />
            </div>
            <div className=" text-xl leading-10	">
              当前选举轮次成员指的是当前的全部提案可投票成员。如果投票成员发生变更，它会被成为选举轮次发生变更。选举轮次是一个自增的数字，不可倒退，只能更新，它是为了更好地管理投票成员的对于提案的可投票权限。
              <br />
              提案在发起时，会绑定当前的选举轮次。也就意味着只有在提案发起时是投票成员的账户才能对该提案进行投票，后续加入的投票成员无法对该提案进行投票或其他操作。
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
