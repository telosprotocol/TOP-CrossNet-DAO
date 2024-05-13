import { getNonce, getTerm, MAX_UINT256_HEX } from '@/eth/method';
import useAccountStore from '@/store/account';
import { useEffect, useState } from 'react';

export function useTerm() {
  const [value, setValue] = useState('-');
  const chainId = useAccountStore((state) => state.chainId);
  useEffect(() => {
    getTerm().then((d) => {
      setValue(d);
    });
  }, [chainId]);

  return value;
}
