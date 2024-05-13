import { IProposalItem } from '@/types';
import { get, post } from './utils';

type IPage = {
  pageSize: number;
  pageIndex: number;
};

type IdaoProposalPageParams = IPage & {
  kindId?: string;
  targetChain?: string;
  sourceStatus?: string;
};

export async function test(data: IPage): Promise<IProposalItem[]> {
  const res = await post(`/v1/test/page`, data);
  const list = res.data || [];
  return list;
}

export async function daoProposalPage(
  data: IdaoProposalPageParams,
): Promise<IdaoProposalPageResItem[]> {
  const res = await post(`/v1/daoProposal/page`, data);
  const list = res.data || [];
  return list;
}
export type ICreateProposalParams = {
  id?: string;
  proposalId: string;
  abiId: string;
  kindId: string;
  nonce: string;
  functionName: string;
  remark: string;
  params: string[];
  sourceChain: string;
  targetChain: string;
  action?: string;
  voteTerm: string;
  proposalAccount?: string;
};
export async function apiCreateProposal(data: ICreateProposalParams) {
  const res = await post(`/v1/daoProposal`, data);
  const list = res.data || [];
  return list;
}

export async function sourceTxPage(data: IPage): Promise<TSourceTxPageResItem[]> {
  const res = await post(`/v1/source/tx/page`, data);
  const list = res.data || [];
  return list;
}
export async function functionTemplatePage() {
  const res = await post(`/v1/function/template/page`, {
    pageIndex: 1,
    pageSize: 100,
  });
  const list = res.data || [];
  return list;
}

export async function daoProposalDetail(proposalId: string): Promise<TDaoProposalDetail> {
  const res = await get(`/v1/daoProposal/${proposalId}`);
  const obj = res.data || { abiFunction: {}, assentList: [], negativeList: [], abstentionList: [] };
  return obj;
}
