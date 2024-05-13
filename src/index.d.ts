type IdaoProposalPageResItem = {
  id?: string;
  abiId?: string;
  abiFunction?: {
    id?: string;
    functionName?: string;
    contractAddress?: string;
    abiText?: string;
    chain?: string;
    remark?: string;
    kindId?: string;
  };
  proposalId?: string;
  kindId?: number;
  nonce?: string;
  voteTerm?: string;
  functionName?: string;
  params?: string[];
  sourceChain?: string;
  targetChain?: string;
  remark?: string;
  assentNum?: number;
  negativeNum?: number;
  abstentionNum?: number;
  voterNum?: number;
  expireTime?: string;
  sourceStatus?: string;
  targetStatus?: string;
  proposalAccount?: string;
  voteCompletedTime?: string;
  modifiedDate?: string;
  expireTime?: string;
  createdDate?: string;
};

type TSourceTxPageResItem = {
  id: string;
  createdDate: number;
  modifiedDate: number;
  transactionHash: string;
  proposalId: string;
  sourceChain: string;
  targetChain: string;
  sendTimestamp: string;
  fromAddress: string;
  toAddress: string;
  txStatus: string;
  sourceStatus: string;
  functionName: string;
  nonce: string;
};

type IndexMskData = {
  title?: string;
  type?: string;
  open?: boolean;
  setIsIndexDialogShow?: (e: boolean) => void;
  item?: IdaoProposalPageResItem;
};

type TFunctionTemplatePage = {
  id: string;
  functionName: string;
  contractAddress: string;
  abiText: string;
  chain: string;
  remark: string;
  kindId: string;
};

type TDaoProposalDetail = {
  id?: string;
  abiId?: string;
  abiFunction?: {
    id?: string;
    functionName?: string;
    contractAddress?: string;
    abiText?: string;
    abiDesc?: string;
    chain?: string;
    remark?: string;
    kindId?: string;
  };
  proposalId?: string;
  kindId?: number;
  nonce?: string;
  voteTerm?: string;
  functionName?: string;
  params?: string[];
  sourceChain?: string;
  targetChain?: string;
  remark?: string;
  voterNum?: number;
  expireTime?: string;
  sourceStatus?: string;
  targetStatus?: string;
  assentList?: string[];
  negativeList?: string[];
  abstentionList?: string[];
  proposalStatusPaths?: string[];
  votingRatio?: number;
  proposalAccount?: string;
  voteCompletedTime?: string;
  modifiedDate?: string;
  expireTime?: string;
  createdDate?: string;
};
