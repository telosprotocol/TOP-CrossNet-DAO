import { getVotingRatio } from '@/eth/method';
import useAccountStore from '@/store/account';
import { useEffect, useState } from 'react';

export default function useVotingRatio() {
  const [b, setB] = useState(0);

  const account = useAccountStore((state) => state.account);
  useEffect(() => {
    getVotingRatio().then((d: any) => {
      setB(Number(d) / 100);
    });
  }, [account]);
  return b;
}
