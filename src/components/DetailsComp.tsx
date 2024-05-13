import { daoProposalDetail } from '@/api';
import Progress from '@/components/Details/Progress';
import HandleBtn from '@/components/Index/HandleBtn';
import { IndexDialog } from '@/components/Index/IndexDialog';
import Layout from '@/components/layout';
import useVotingRatio from '@/hooks/useVotingRatio';
import useAppStore from '@/store/appStore';
import { accuracy, formatAddress, getSearchParams, kindTypeById } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

function parseAbi(abi: string | undefined, params: string[] | undefined) {
  if (!abi) {
    return [];
  }
  if (!params) {
    return [];
  }
  let abiInputs = JSON.parse(abi).inputs || [];
  return params.map((item, index) => {
    return {
      ...abiInputs[index],
      value: item,
    };
  });
}

function getAbiDesc(abiDesc: string | undefined, params: string[] | undefined) {
  if (!abiDesc) {
    return '';
  }
  if (!params) {
    return '';
  }
  params.forEach((item, index) => {
    abiDesc = abiDesc?.replace(`{${index}}`, item);
  });
  return abiDesc;
}

export default function DetailsComp(props: any) {
  const [isIndexDialogShow, setIsIndexDialogShow] = useState(false);
  const [mskData, setMskData] = useState<IndexMskData>();

  let { data: proposalDetail } = useQuery({
    queryKey: ['daoProposalDetail', props.proposalId],
    queryFn: () => daoProposalDetail(props.proposalId),
    refetchInterval: 5000,
    enabled: props.proposalId !== '' && props.proposalId !== undefined,
  });
  if (!proposalDetail) {
    proposalDetail = {
      abiFunction: {},
      assentList: [],
      negativeList: [],
      abstentionList: [],
    } as TDaoProposalDetail;
  } else {
    useAppStore
      .getState()
      .changeTitle(`提案#${proposalDetail.nonce || ''}: ${proposalDetail.functionName || ''}`);
  }

  // const contractAddress = proposalDetail?.abiFunction?.contractAddress;
  // const functionName = proposalDetail?.abiFunction?.functionName;

  return (
    <div>
      <div>
        {props.children &&
          props.children(`${proposalDetail?.nonce || ''}: ${proposalDetail?.functionName || ''}`)}
      </div>
      {props.wrap(
        <div>
          <div className="pt-[22px] px-3 pb-3 bg-[#ffffff] sm:bg-[#F7F4FF] sm:px-6 sm:pb-6">
            <Progress
              sourceStatus={proposalDetail.sourceStatus}
              proposalStatusPaths={proposalDetail.proposalStatusPaths || []}
            />

            <div className="bg-[#fff] rounded-xl p-6">
              {/* header */}
              <h2 className=" text-base font-medium text-center">基础信息</h2>
              {/* body */}
              <div className="py-4 text-sm break-all">
                <div className="mb-3 flex flex-row justify-start">
                  <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                    提案ID：
                  </span>
                  <span className="text-[#666]">{proposalDetail?.proposalId}</span>
                </div>

                <div className="sm:grid sm:grid-cols-3">
                  <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                      源链：
                    </span>
                    <span className="text-[#666]">{proposalDetail?.sourceChain}</span>
                  </div>

                  <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                      目标链：
                    </span>
                    <span className="text-[#666]">{proposalDetail?.targetChain}</span>
                  </div>
                  <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                      提案主类别：
                    </span>
                    <span className="text-[#666]">{kindTypeById(proposalDetail?.kindId)}</span>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3">
                  <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                      原链状态：
                    </span>
                    <span className="text-[#666]">{proposalDetail?.sourceStatus || '--'}</span>
                  </div>
                  <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                      目标链状态：
                    </span>
                    <span className="text-[#666]">{proposalDetail?.targetStatus || '--'}</span>
                  </div>
                  <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                      提案发起人：
                    </span>
                    <span className="text-[#666]">
                      {formatAddress(proposalDetail.proposalAccount)}
                    </span>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3">
                  <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                      发起时间：
                    </span>
                    <span className="text-[#666]">
                      {format(Number(proposalDetail.createdDate || 0), 'yyyy-MM-dd HH:mm:ss')}
                    </span>
                  </div>

                  <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                      序列号：
                    </span>
                    <span className="text-[#666]">{proposalDetail?.nonce}</span>
                  </div>
                </div>

                <div className="mb-3 flex flex-row justify-start">
                  <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                    操作合约地址：
                  </span>
                  <span className="text-[#666]">
                    {proposalDetail?.abiFunction?.contractAddress}
                  </span>
                </div>

                <div className="mb-3 flex flex-row justify-start">
                  <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                    操作ABI：
                  </span>
                  <div className="text-[#666]">
                    <div>{proposalDetail?.abiFunction?.functionName}</div>
                    {parseAbi(proposalDetail?.abiFunction?.abiText, proposalDetail.params).map(
                      (item, index) => (
                        <div key={item.name + index}>
                          {item.name} {item.desc}：{item.value}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="mb-3 flex flex-row justify-start">
                  <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                    ABI说明：
                  </span>
                  <span className="text-[#666]">
                    {getAbiDesc(proposalDetail?.abiFunction?.abiDesc, proposalDetail?.params)}
                  </span>
                </div>

                <div className="mb-3 flex flex-row justify-start">
                  <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                    提案描述：
                  </span>
                  <span className="text-[#666]">
                    {proposalDetail?.remark?.replace(/\d{13}$/, '')}
                  </span>
                </div>
              </div>

              {/* footer */}
              <HandleBtn
                position={'detailsBaseInfo'}
                item={proposalDetail}
                setMskData={setMskData}
                setIsIndexDialogShow={setIsIndexDialogShow}
              />
            </div>

            <div className="bg-[#fff] rounded-xl p-6 mt-3">
              <h2 className=" text-base font-medium text-center">选举投票</h2>

              <div className="py-4 text-sm break-all">
                <div className="sm:grid sm:grid-cols-3">
                  {/* <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                      选举轮次：
                    </span>
                    <span className="text-[#666]">{proposalDetail?.voteTerm}</span>
                  </div> */}
                  <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]  font-semibold">
                      投票开始时间：
                    </span>
                    <span className="text-[#666]">
                      {format(Number(proposalDetail?.createdDate || 0), 'yyyy-MM-dd HH:mm:ss')}
                    </span>
                  </div>
                  <div className="mb-3 flex flex-row justify-start">
                    <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[103px]  font-semibold">
                      投票通过要求 ：
                    </span>
                    <span className="text-[#666]">{proposalDetail?.voterNum || ''}</span>
                  </div>
                  {proposalDetail.sourceStatus === 'SUCCEEDED' ||
                  proposalDetail.sourceStatus === 'EXECUTED' ? (
                    <div className="mb-3 flex flex-row justify-start">
                      <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[103px]  font-semibold">
                        投票完成时间：
                      </span>
                      <span className="text-[#666]">
                        {proposalDetail?.expireTime
                          ? format(Number(proposalDetail?.voteCompletedTime), 'yyyy-MM-dd HH:mm:ss')
                          : '-'}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3 flex flex-row justify-start">
                      <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[103px]  font-semibold">
                        投票过期时间：
                      </span>
                      <span className="text-[#666]">
                        {proposalDetail?.expireTime
                          ? format(Number(proposalDetail?.expireTime), 'yyyy-MM-dd HH:mm:ss')
                          : '-'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-3 flex flex-row justify-start">
                  <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[103px]  font-semibold">
                    投票情况：
                  </span>

                  <div className="flex-1">
                    {proposalDetail?.assentList &&
                      proposalDetail?.assentList.map((item, index) => {
                        return (
                          <div className="flex flex-row  flex-1 items-center" key={index}>
                            <span className="text-[#666]">{item}</span>
                            <span className="text-[#00C9A7] flex-shrink-0 flex-grow-0 w-[40px] text-sm font-medium text-right">
                              赞成
                            </span>
                          </div>
                        );
                      })}

                    {proposalDetail?.negativeList &&
                      proposalDetail?.negativeList.map((item, index) => {
                        return (
                          <div className="flex flex-row flex-1 items-center" key={index}>
                            <span className="text-[#666]">{item}</span>
                            <span className="text-[#EB5BCC] flex-shrink-0 flex-grow-0 w-[40px] text-sm font-medium text-right">
                              反对
                            </span>
                          </div>
                        );
                      })}

                    {proposalDetail?.abstentionList &&
                      proposalDetail?.abstentionList.map((item, index) => {
                        return (
                          <div className="flex flex-row flex-1 items-center" key={index}>
                            <span className="text-[#666]">{item}</span>
                            <span className="text-[#C5CFD5] flex-shrink-0 flex-grow-0 w-[40px] text-sm font-medium text-right">
                              弃权
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              <HandleBtn
                position={'detailsVoteInfo'}
                item={proposalDetail}
                setMskData={setMskData}
                setIsIndexDialogShow={setIsIndexDialogShow}
              />
            </div>

            <IndexDialog open={isIndexDialogShow} {...mskData} />
          </div>
        </div>,
      )}
    </div>
  );
}
