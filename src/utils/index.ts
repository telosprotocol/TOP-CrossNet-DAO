import { getEthereum, getWeb3, isDev } from '@/eth';
import BigNumber from 'bignumber.js';
import { string } from 'zod';

export const getRandom = (length: string | number): number => {
  const num = Math.random() * Number(length);
  return parseInt(String(num), 10);
};

export const formatAddress = (address?: string, head = 6, foot = 4) => {
  if (!address) {
    return '';
  }
  if (address.length < 10) {
    return address;
  }
  return address.slice(0, head) + '...' + address.slice(-foot);
};

export const splitNumber = (num: string, decimals = 18) => {
  const _num = String(num);
  if (!num) {
    return '';
  }
  let result = _num;
  if (num.includes('.')) {
    const temp = _num.split('.');
    result = temp[0] + '.' + temp[1].slice(0, decimals);
  }
  return result;
};

export const accuracy = (num: number | string, decimals: number, fix: number, acc = false): any => {
  if (Number(num) === 0 || !num) {
    return 0;
  }
  const n = new BigNumber(num)
    .div(new BigNumber(10).pow(Number(decimals)))
    .toFixed(Number(fix), BigNumber.ROUND_DOWN);
  if (acc) {
    return n;
  }
  return Number(n);
};

export const scala = (num: string | number, decimals: number) => {
  if (Number(num) === 0 || !num) {
    return 0;
  }
  return new BigNumber(num).times(new BigNumber(10).pow(Number(decimals))).toFixed(0);
};

export const fixZero = (str: string | number) => {
  return String(str).replace(/(?:\.0*|(\.\d+?)0+)$/, '$1');
};

export const toBN = (num: string | number) => {
  return new BigNumber(num);
};

export const formatBalance = (num: any, length = 6) => {
  if (!num || Number(num) === 0) {
    return 0;
  }

  num = num.toString();
  let c;
  if (num.toString().indexOf('.') !== -1) {
    const temp = num.split('.');
    c = temp[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + temp[1].slice(0, length);
  } else {
    c = num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
  return c;
};

export const fixedZero = (num: string | number, decimals = 6) => {
  if (Number(num) === 0 || !num) {
    return 0;
  }
  return new BigNumber(num).toFixed(Number(decimals), BigNumber.ROUND_DOWN);
};

export const checkEthAddress = (addr: string) => {
  if (!addr) {
    return false;
  }
  const web3 = getWeb3();
  return web3.utils.isAddress(addr);
};

export const openHash = (hash: string) => {
  window.open(`https://www.topscan.io/transactions/transactionsDetail?hash=${hash}`, '_blank');
};

export const openBrowser = (addr: string, chain: string) => {
  if (isDev) {
    if (chain === 'TOP') {
      window.open(`https://bouwww.topscan.io/en-US/accounts/accountsDetail?id=${addr}`, '_blank');
    }
    if (chain === 'ETH') {
      window.open(`https://rinkeby.etherscan.io/address/${addr}`, '_blank');
    }
    if (chain === 'BSC') {
      window.open(`https://testnet.bscscan.com/address/${addr}`, '_blank');
    }
    if (chain === 'HECO') {
      window.open(`https://testnet.hecoinfo.com/address/${addr}`, '_blank');
    }
  } else {
    if (chain === 'TOP') {
      window.open(`https://www.topscan.io/en-US/accounts/accountsDetail?id=${addr}`, '_blank');
    }
    if (chain === 'ETH') {
      window.open(`https://etherscan.io/address/${addr}`, '_blank');
    }
    if (chain === 'BSC') {
      window.open(`https://bscscan.com/address/${addr}`, '_blank');
    }
    if (chain === 'HECO') {
      window.open(`https://hecoinfo.com/address/${addr}`, '_blank');
    }
  }
};

export const hashToLink = (hash: string) => {
  return `https://etherscan.io/tx/${hash}`;
};

export const ethAddressToTopT6 = (ethAddress: string) => {
  if (!ethAddress) {
    return ethAddress;
  }
  return ethAddress.replace(/0x/, 'T60004');
};

export const sleep = (t: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, t);
  });
};

export function copyToClipboard(text: string) {
  try {
    window.navigator.clipboard.writeText(text);
  } catch (error) {}
}

export async function switchToChain() {
  const toChainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  const toChainName = 'TOP-EVM';
  const toChainRpc = process.env.NEXT_PUBLIC_CHAIN_RPC;
  const ethereum = getEthereum();
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: toChainId,
        },
      ],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: toChainId,
              chainName: toChainName,
              rpcUrls: [toChainRpc],
            },
          ],
        });
      } catch (addError) {
        // handle "add" error
        return false;
      }
    } else {
      return false;
    }
    // handle other "switch" errors
  }
}
export function calculateROI(filStorageRate: number, fileCount: number, APY: number, days: number) {
  const tokenCount = fileCount / filStorageRate;
  if (days === 180) {
    return tokenCount * (1 + APY / 200);
  } else if (days === 360) {
    return tokenCount * (1 + APY / 100);
  } else {
    return 0;
  }
}
export function calculateInvestment(
  filStorageRate: number,
  income: number,
  APY: number,
  days: number,
) {
  if (days === 180) {
    return (income / (1 + APY / 200)) * filStorageRate;
  } else if (days === 360) {
    return (income / (1 + APY / 100)) * filStorageRate;
  } else {
    return 0;
  }
}

export function dayfromNow(time: number | undefined): string {
  if (!time) {
    return '0 day';
  }
  let days = Math.ceil((time - Date.now()) / 86400000);
  if (days <= 0) {
    days = 0;
  }
  return `${days} ${days <= 1 ? 'day' : 'days'}`;
}

export function hashFragment(hash: string) {
  if (!hash) return '';

  const start = hash.slice(0, 18);
  const end = hash.slice(-4);

  return start + '...' + end;
}

// Internal JSON-RPC error.
// {
//   "code": 3,
//   "data": "0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000106e6f6e636520697320696e76616c696400000000000000000000000000000000",
//   "message": "execution reverted: nonce is invalid"
// }
export function processRpcErrorMsg(message: string = '') {
  try {
    const res = JSON.parse(message.replace(/Internal JSON-RPC error\./i, ''));
    return res.message || res;
  } catch (error) {
    return message;
  }
}

export const kindTypeById = (id: any) => {
  if (!string(id)) return '';
  id = Number(id)
  switch (id) {
    case 0:
      return '治理型提案';
    case 1:
      return '修正型提案';
    case 2:
      return '业务型提案';
  }
  return '业务型提案';
};

export const getSearchParams = (key: string) => {
  const href = window.location.href;
  const url = new URL(href);
  const params = new URLSearchParams(url.search);

  return params.get(key) || '';
};

export const capitalizeFirstLetter = (str: string) => {
  return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const kindIdToName = (str: number|undefined ) => {
  if (str === 0) {
    return '治理型提案';
  }
  if (str === 1) {
    return '修正型提案';
  }
  return '业务型提案';
};