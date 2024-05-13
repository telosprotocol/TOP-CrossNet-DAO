import { daoProposalPage, sourceTxPage } from '@/api';
import StatusBtn from '@/components/Index/BtnStatus';
import HandleBtn from '@/components/Index/HandleBtn';
import { IndexDialog } from '@/components/Index/IndexDialog';
import Layout from '@/components/layout';
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useAppStore from '@/store/appStore';
import { formatAddress, hashFragment, kindIdToName, openHash } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isIndexDialogShow, setIsIndexDialogShow] = useState(false);
  const [currentKindId, setCurrentKindId] = useState('ALL');
  const [mskData, setMskData] = useState<IndexMskData>();
  const proposalType = [
    {
      id: 'ALL',
      name: '所有提案',
    },
    {
      id: '0',
      name: '治理型提案',
    },
    {
      id: '1',
      name: '修正型提案',
    },
    {
      id: '2',
      name: '业务型提案',
    },
  ];

  const { data: daoActivities, isLoading: isLoading2 } = useQuery({
    queryKey: ['sourceTxPage'],
    queryFn: () =>
      sourceTxPage({
        pageIndex: 1,
        pageSize: 20,
      }),
    refetchInterval: 5000,
  });

  const daoActivitiesLoad = !isLoading2;

  const postData: any = {
    pageIndex: 1,
    pageSize: 50,
  };

  if (currentKindId !== 'ALL') {
    postData.kindId = currentKindId;
  }

  const { data: recentProposals, isLoading: isLoading } = useQuery({
    queryKey: ['daoProposalPage', currentKindId],
    queryFn: () => daoProposalPage(postData),
    refetchInterval: 5000,
  });

  const recentProposalsFirstLoad = !isLoading;

  return (
    <Layout>
      <div className=" container mx-auto p-3 sm:p-6 bg-[#fff]">
        <div className=" md:flex md:space-x-6 justify-between">
          <div className="bg-[#F7F4FF] rounded-lg overflow-hidden mb-3 sm:mb-0 grow">
            <div className="head flex flex-row justify-between items-center p-3 bg-[#9900FF] h-[64px]">
              <span className="text-base text-white">Recent Proposals</span>

              <Select
                value={currentKindId}
                onValueChange={(e) => {
                  setCurrentKindId(e);
                }}>
                <SelectTrigger
                  className="w-[120px] bg-[transparent] border-none text-white"
                  style={{ boxShadow: 'none !important' }}>
                  <SelectValue placeholder="提案类型" />
                </SelectTrigger>
                <SelectContent className="text-[#2C1843]">
                  {proposalType.map((item) => {
                    return (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {recentProposals && recentProposals.length > 0 && (
              <div className="list p-3 md:p-6  md:grid md:grid-cols-1 lg:grid-cols-2 md:gap-4">
                {recentProposals.map((item, index) => {
                  return (
                    <div key={index} className="item bg-white rounded-lg p-3 mb-3 md:mb-0">
                      <div className="flex felx-row justify-between items-center">
                        <span className="text-[#2C1843] text-base font-medium">
                          {item.nonce}:{item.functionName}
                        </span>

                        <StatusBtn sourceStatus={item.sourceStatus} />
                      </div>

                      <div className="text-[#666] text-sm font-normal my-[6px]">
                        <span className="">{kindIdToName(item.kindId)}：</span>
                        <span>
                          {item.sourceChain} -&gt; {item.targetChain}
                        </span>
                      </div>
                      <div className="text-[#666] text-sm font-normal my-[6px]">
                        <span className="">提案人：</span>
                        <span>{formatAddress(item.proposalAccount)}</span>
                      </div>

                      <div className="text-xs flex flex-row justify-between mb-[10px]">
                        <span className="text-[#ACACAC] font-normal pr-2 h-5 leading-5 overflow-hidden text-ellipsis whitespace-nowrap">
                          提案时间：{format(Number(item.createdDate), 'yyyy-MM-dd HH:mm:ss')}
                        </span>
                        <span
                          className="text-[#9900FF] font-medium h-5 leading-5 cursor-pointer"
                          onClick={() => {
                            if (window.innerWidth < 640) {
                              router.push('/details?proposalId=' + item.proposalId);
                            } else {
                              useAppStore.getState().changeOpenDetails(item.proposalId || '');
                            }
                          }}>
                          Detail&gt;&gt;
                        </span>
                      </div>

                      <HandleBtn
                        position={'indexRecentProposals'}
                        item={item}
                        setMskData={setMskData}
                        setIsIndexDialogShow={setIsIndexDialogShow}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {!recentProposalsFirstLoad && (
              <div className="py-[200px]">
                <Loading />
              </div>
            )}

            {recentProposalsFirstLoad && recentProposals && recentProposals.length < 1 && (
              <Nodata />
            )}
          </div>

          <div className="bg-[#F7F4FF] rounded-lg overflow-hidden xl:w-[450px] xl:shrink-0 lg:w-[300px] lg:shrink-0 md:w-[300px] md:shrink-0">
            <div className="head flex flex-row justify-between items-center p-3 bg-[#9900FF] h-[64px]">
              <span className="text-base text-white">DAO Activities</span>
            </div>

            <div className="list p-3  md:p-6 pb-[1px]">
              {daoActivities &&
                daoActivities.length > 0 &&
                daoActivities.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full flex felx-row justify-between rounded-lg p-3 mb-3 items-start bg-white">
                      {/* <Image
                        className=" rounded-full flex-shrink-0 flex-grow-0 flex-basis-40"
                        src={'https://img1.imgtp.com/2023/11/06/g5RUOoj2.jpg'}
                        width={40}
                        height={40}
                        alt={''}
                      /> */}

                      <div className=" flex-1 pl-2">
                        <p
                          className=" text-[#90F] text-sm mb-1 cursor-pointer"
                          onClick={() => {
                            openHash(item.transactionHash);
                          }}>
                          {hashFragment(item.transactionHash)}
                        </p>
                        <p className=" mb-1 text-xs text-[#666]">
                          {item.nonce}：{item.functionName} 提案进入
                          {item.sourceStatus === 'ACTIVE' && (
                            <span className="text-[#CD5EF3]"> Active </span>
                          )}
                          {item.sourceStatus === 'EXPIRED' && (
                            <span className="text-[#FF8A0F]"> Expired </span>
                          )}
                          {item.sourceStatus === 'SUCCEEDED' && (
                            <span className="text-[#03AD8F]"> Succeeded </span>
                          )}
                          {item.sourceStatus === 'EXECUTED' && (
                            <span className="text-[#90F]"> Executed </span>
                          )}
                          状态
                        </p>

                        <p className=" mb-1 text-xs text-[#ACACAC]">
                          操作人 {formatAddress(item.fromAddress, 10)}
                        </p>

                        <p className=" mb-1 text-xs text-[#ACACAC]">
                          {format(Number(item.sendTimestamp), 'yyyy-MM-dd HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                  );
                })}

              {!daoActivitiesLoad && (
                <div className="py-[204px]">
                  <Loading />
                </div>
              )}

              {daoActivitiesLoad && daoActivities && daoActivities.length < 1 && <Nodata />}
            </div>
          </div>
        </div>

        <IndexDialog open={isIndexDialogShow} {...mskData} />
      </div>
    </Layout>
  );
}
