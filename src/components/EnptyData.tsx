import Image from 'next/image';
import nodata from '../assets/images/noTool.png';
import noTransactions from '../assets/images/noTransactions.svg';
import { useRouter } from 'next/router';
import useAppStore from '@/store/appStore';
function EnptyData({ type = 'Activities' }) {
  const router = useRouter();
  return (
    <div className=" text-center">
      <div className="mt-8 mb-4 flex justify-center">
        {type === 'Toolkits' && <Image key={1} src={nodata} alt="" width={60} height={63} />}
        {type === 'Activities' && (
          <Image key={2} src={noTransactions} alt="" width={62} height={65} />
        )}
      </div>
      <div className="text-[14px] leading-[18px] px-[54px] font-normal text-[#999999]">
        {type === 'Toolkits' && '暂无工具'}
        {type === 'Activities' && 'No activities yet, Your activities will appear here'}
      </div>
    </div>
  );
}
export default EnptyData;
