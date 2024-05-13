import useAccountStore from '@/store/account';
import useAppStore, { openTransDialog } from '@/store/appStore';
import useTransactionStore from '@/store/transactionStore';
import { processRpcErrorMsg, switchToChain } from '@/utils';
import { getContract, getEthereum, getWeb3 } from '.';
import { keccak256 } from '@ethersproject/keccak256';
import { encodeParameters } from 'web3-eth-abi';
import toast from 'react-hot-toast';
import { apiCreateProposal, ICreateProposalParams } from '@/api';
import BigNumber from 'bignumber.js';
import { track } from '@/lib/track';

export const SCALABLEVOTES_CONTRACT = process.env.NEXT_PUBLIC_SCALABLEVOTES_CONTRACT || '';
export const CROSSMULTISIGNDAO_CONTRACT = process.env.NEXT_PUBLIC_CROSSMULTISIGNDAO_CONTRACT || '';
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || '';
export const TOP_CHAIN_ID = process.env.NEXT_PUBLIC_TOP_CHAIN_ID || '';
export const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID || '';
export const BSC_CHAIN_ID = process.env.NEXT_PUBLIC_BSC_CHAIN_ID || '';

export const MAX_UINT256_HEX = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';

export const chainNameToChainId: any = {
  TOP: TOP_CHAIN_ID,
  BSC: BSC_CHAIN_ID,
  ETH: ETH_CHAIN_ID,
  ALL: MAX_UINT256_HEX,
};

export const getTokenInfo = async (addr: string, contractAddr: string) => {
  const contract = getContract('token', contractAddr);
  let balance = 0;
  if (addr) {
    balance = await contract.methods.balanceOf(addr).call();
  }
  const totalSupply = await contract.methods.totalSupply().call();
  const decimals = await contract.methods.decimals().call();
  const symbol = await contract.methods.symbol().call();
  return { balance, decimals, totalSupply, symbol };
};

export const getTerm = async () => {
  const contract = getContract('CROSSMULTISIGNDAO', CROSSMULTISIGNDAO_CONTRACT);
  try {
    const result = await contract.methods.term().call();
    return result;
  } catch (error) {
    console.error('getTerm', error);
    return '0';
  }
};

export const getNonce = async (chainId: string) => {
  const contract = getContract('CROSSMULTISIGNDAO', CROSSMULTISIGNDAO_CONTRACT);
  try {
    const result = await contract.methods.nonces(chainId).call();
    return result;
  } catch (error) {
    console.error('getNonce', error);
    return '0';
  }
};

export const getVotingRatio = async () => {
  const contract = getContract('CROSSMULTISIGNDAO', CROSSMULTISIGNDAO_CONTRACT);
  try {
    const result = await contract.methods.votingRatio().call();
    return result;
  } catch (error) {
    console.error('votingRatio', error);
    return '0';
  }
};

export const getVotes = async (account: string) => {
  const contract = getContract('SCALABLEVOTES', SCALABLEVOTES_CONTRACT);
  try {
    const result = await contract.methods.getVotes(account).call();
    return result;
  } catch (error) {
    console.error('getVotes', error);
    return '0';
  }
};

async function signData(hexMessage: string) {
  const ethereum = getEthereum();
  const account = useAccountStore.getState().account;
  const sign = await ethereum.request({
    method: 'personal_sign',
    params: [hexMessage, account],
  });
  return sign;
}

export const executeProposal = async (proposalId: string) => {
  try {
    if (!proposalId.match(/0x/)) {
      proposalId = '0x' + proposalId;
    }
    if (!requireRightChainId()) {
      return false;
    }
    const hash = await executeMethod('CROSSMULTISIGNDAO', CROSSMULTISIGNDAO_CONTRACT, 'execute', [
      proposalId,
    ]);
    const account = useAccountStore.getState().account;
    track({
      event: 'execute',
      tx_hash: hash,
      from: localStorage.getItem('_account') || '',
      to: CROSSMULTISIGNDAO_CONTRACT,
      proposalId,
    });
    try {
      useTransactionStore.getState().add({
        hash,
        account: account,
        methodName: 'Execute',
        methodAddress: CROSSMULTISIGNDAO_CONTRACT,
        value: ``,
        status: 'pending',
        time: Date.now(),
        unit: '',
      });
    } catch (error) {}
    // openTransDialog();
    return true;
  } catch (error: any) {
    if (error.message && error.message.indexOf('User denied') > -1) {
      return false;
    }
    toast.error(processRpcErrorMsg(error.message) || 'Error');
    return false;
  }
};

export const cancelProposal = async (proposalId: string) => {
  if (!proposalId.match(/0x/)) {
    proposalId = '0x' + proposalId;
  }
  try {
    if (!requireRightChainId()) {
      return false;
    }
    const hash = await executeMethod('CROSSMULTISIGNDAO', CROSSMULTISIGNDAO_CONTRACT, 'cancel', [
      proposalId,
    ]);
    const account = useAccountStore.getState().account;
    track({
      event: 'cancel',
      tx_hash: hash,
      from: localStorage.getItem('_account') || '',
      to: CROSSMULTISIGNDAO_CONTRACT,
      proposalId,
    });
    try {
      useTransactionStore.getState().add({
        hash,
        account: account,
        methodName: 'Cancel',
        methodAddress: CROSSMULTISIGNDAO_CONTRACT,
        value: ``,
        status: 'pending',
        time: Date.now(),
        unit: '',
      });
    } catch (error) {}
    // openTransDialog();
    return true;
  } catch (error: any) {
    if (error.message && error.message.indexOf('User denied') > -1) {
      return false;
    }
    toast.error(processRpcErrorMsg(error.message) || 'Error');
    return false;
  }
};

export const castVoteBySig = async (proposalId: string, support: '0' | '1' | '2') => {
  if (!proposalId.match(/0x/)) {
    proposalId = '0x' + proposalId;
  }
  try {
    if (!requireRightChainId()) {
      return false;
    }
    const hash32 = keccak256(
      encodeParameters(
        ['address', 'uint256', 'uint8'],
        [CROSSMULTISIGNDAO_CONTRACT, proposalId, support],
      ),
    );
    const signature = await signData(hash32);
    const v = '0x' + signature.substr(130, 2);
    const r = '0x' + signature.substr(2, 64);
    const s = '0x' + signature.substr(66, 64);
    const hash = await executeMethod(
      'CROSSMULTISIGNDAO',
      CROSSMULTISIGNDAO_CONTRACT,
      'castVoteBySig',
      [proposalId, support, v, r, s],
    );
    const account = useAccountStore.getState().account;
    track({
      event: 'Vote',
      tx_hash: hash,
      from: localStorage.getItem('_account') || '',
      to: CROSSMULTISIGNDAO_CONTRACT,
      proposalId,
      support,
    });
    try {
      useTransactionStore.getState().add({
        hash,
        account: account,
        methodName: 'Vote',
        methodAddress: CROSSMULTISIGNDAO_CONTRACT,
        value: ``,
        status: 'pending',
        time: Date.now(),
        unit: '',
      });
    } catch (error) {}
    // openTransDialog();
    return true;
  } catch (error: any) {
    if (error.message && error.message.indexOf('User denied') > -1) {
      return false;
    }
    toast.error(processRpcErrorMsg(error.message) || 'Error');
    return false;
  }
};

const defaultAction =
  '0xa9059cbb0000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc0000000000000000000000000000000000000000000000000000000000000016';
export const createProposalMethod = async (data: ICreateProposalParams) => {
  try {
    if (!requireRightChainId()) {
      return false;
    }
    const term = await getTerm();
    data.voteTerm = term;
    const web3 = getWeb3();
    delete data.id;
    data.remark = data.remark.replace(/\d{13}$/, '') + Date.now();
    const createParams = [
      chainNameToChainId[data.sourceChain],
      chainNameToChainId[data.targetChain],
      data.proposalId ? '1' : data.kindId,
      data.voteTerm,
      data.nonce,
      data.proposalId ? defaultAction : data.action || '0x0',
      web3.utils.sha3(data.remark),
    ];
    delete data.action;

    let proposalId = await genProposalId(createParams);
    proposalId = new BigNumber(proposalId).toString(16);
    data.kindId = data.proposalId ? '1' : data.kindId;
    data.proposalId = proposalId;
    data.proposalAccount = useAccountStore.getState().account;
    await apiCreateProposal(data);

    const hash = await innerCreateProposalMethod(createParams);
    track({
      event: 'propose',
      tx_hash: hash,
      from: localStorage.getItem('_account') || '',
      to: CROSSMULTISIGNDAO_CONTRACT,
      proposalId,
      voteTerm: data.voteTerm,
      nonce: data.nonce,
      sourceChain: chainNameToChainId[data.sourceChain],
      targetChain: chainNameToChainId[data.targetChain],
      action: data.action || '0x0',
    });
    return proposalId;
  } catch (error: any) {
    console.log(error);
    if (error.message && error.message.indexOf('User denied') > -1) {
      return false;
    }
    toast.error(processRpcErrorMsg(error.message) || 'Error');
    return false;
  }
};

export const genProposalId = async (params: any) => {
  if (!requireRightChainId()) {
    return false;
  }
  const contract = getContract('CROSSMULTISIGNDAO', CROSSMULTISIGNDAO_CONTRACT);
  const pId = await contract.methods.propose(...params).call({
    from: useAccountStore.getState().account,
  });
  return pId;
};

// create Proposal
const innerCreateProposalMethod = async (params: any) => {
  const hash = await executeMethod(
    'CROSSMULTISIGNDAO',
    CROSSMULTISIGNDAO_CONTRACT,
    'propose',
    params,
  );
  const account = useAccountStore.getState().account;
  try {
    useTransactionStore.getState().add({
      hash,
      account: account,
      methodName: 'Proposal',
      methodAddress: CROSSMULTISIGNDAO_CONTRACT,
      value: ``,
      status: 'pending',
      time: Date.now(),
      unit: '',
    });
  } catch (error) {}
  // openTransDialog();
  return hash;
};

async function callRpc(method: string, params?: any) {
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: 1,
    }),
  };
  const rpc = process.env.NEXT_PUBLIC_CHAIN_RPC || '';
  const res = await fetch(rpc, options);
  const response = await res.json();
  return response.result;
}

async function executeMethod(
  contractName: string,
  contractAddr: string,
  methodName: string,
  params: any,
  value: string | 0 = 0,
): Promise<string> {
  const contract = getContract(contractName, contractAddr);
  const web3 = getWeb3();
  const functionSelector = contract.methods[methodName](...params).encodeABI();
  let estimatedGas = await web3.eth.estimateGas({
    to: contractAddr,
    data: functionSelector,
    from: useAccountStore.getState().account,
    value,
  });
  const maxPriorityFeePerGasVal = await callRpc('eth_maxPriorityFeePerGas');
  return new Promise((resolve, reject) => {
    contract.methods[methodName](...params)
      .send({
        gas: Math.floor(Number(estimatedGas) * 1.2),
        from: useAccountStore.getState().account,
        maxPriorityFeePerGas: maxPriorityFeePerGasVal,
        value,
      })
      .on('receipt', function (receipt: any) {
        useAccountStore.getState().toggleBalance();
        resolve(receipt.transactionHash);
      })
      .on('error', function (error: any) {
        reject(error);
      });
  });
}

function requireRightChainId() {
  const chainId = useAccountStore.getState().chainId;
  if (!chainId || chainId === '-1') {
    useAppStore.getState().changeShowSwitchDialog(true);
    return false;
  }
  if (chainId !== CHAIN_ID) {
    switchToChain();
    return false;
  }
  return true;
}
