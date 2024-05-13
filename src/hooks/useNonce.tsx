import { getNonce, MAX_UINT256_HEX } from '@/eth/method';
import { useEffect, useState } from 'react';

export function useNonce(chainId: string) {
  const [value, setValue] = useState('-');
  useEffect(() => {
    if (!chainId) {
      setValue('-');
      return
    }
    getNonce(chainId).then((d) => {
      setValue(d);
    });
  }, [chainId]);

  return value;
}
