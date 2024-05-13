import useIsRightChainId from '@/hooks/useIsRightChainId';
import useAccountStore from '@/store/account';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { switchToChain } from '@/utils';

export default function Network() {
  const account = useAccountStore((state) => state.account);
  const isRightChainId = useIsRightChainId();

  if (!account) {
    return <div></div>;
  }

  return (
    <div className="flex items-center">
      {isRightChainId ? (
        ''
      ) : (
        <Popover>
          <PopoverTrigger>
            <AlertTriangle color="#ffffff" className="mr-2.5" onClick={switchToChain} />
          </PopoverTrigger>
          <PopoverContent className=" py-1 px-2 w-auto text-[#222222]">
            <p className=" text-xs max-w-[260px]">
              The wallet is connected, but the network does not meet the requirements
            </p>
          </PopoverContent>
        </Popover>
      )}
      {/* <Popover>
        <PopoverTrigger>
          <ChevronDown color="#ffffff" className=" mr-10" />
        </PopoverTrigger>
        <PopoverContent className=" py-1 px-2 w-auto text-[#222222]">
          <p className="flex text-sm text-[#222222] items-center" onClick={switchToChain}>
            <Image
              src={filLogo}
              alt="fil"
              className="mr-1 w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"></Image>{' '}
            FVM
          </p>
        </PopoverContent>
      </Popover> */}
    </div>
  );
}
