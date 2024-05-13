import { getVotes } from '@/eth/method';
import useAccountStore from '@/store/account';
import { useEffect, useState } from 'react';

export default function useIsVoter() {
  const [b, setB] = useState(false);

  const account = useAccountStore((state) => state.account);
  useEffect(() => {
    if (!account) {
      setB(false);
      return;
    }
    getVotes(account).then((d: any) => {
      setB(Number(d) > 0);
    });
  }, [account]);
  return b;
}
