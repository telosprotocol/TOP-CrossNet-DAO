import { ITransItem } from '@/store/transactionStore';
import { copyToClipboard, formatAddress } from '@/utils';
import { format } from 'date-fns';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';
export default function TransactionItem({ data }: { data: ITransItem }) {
  return (
    <div className="rounded-lg bg-white p-4">
      <div className="flex justify-between">
        <div className="text-xs text-[#14181F] font-normal">{data.methodName}</div>
        {data.status === 'pending' && (
          <div className="text-xs font-medium text-[#FF8A0F]">Pending</div>
        )}
        {data.status === 'error' && (
          <div className="text-xs font-medium text-[#FE0706]">Failed</div>
        )}
        {data.status === 'success' && (
          <div className="text-xs font-medium text-[#03AD8F]">Confirmed</div>
        )}
      </div>
      <div className="text-[12px] text-[#9D9D9E] mt-2">
        {format(data.time, 'yyyy-MM-dd HH:mm:ss')}
      </div>
      <div className="pt-[10px] text-xs text-primary underline flex justify-between">
        <a
          href={`https://www.topscan.io/transactions/transactionsDetail?hash=${data.hash}`}
          target="_blank">
          {formatAddress(data.hash, 20, 10)}
        </a>
        <div
          className="text-bold flex justify-between items-center group cursor-pointer"
          onClick={() => {
            copyToClipboard(data.hash);
            toast.success('Copyed!');
          }}>
          <div className="text-[#C9C9C9] group-hover:text-primary">
            <Copy size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
