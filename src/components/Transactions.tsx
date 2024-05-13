import { useAccountTransList } from '@/store/transactionStore';
import TransactionItem from './TransactionItem';
import EnptyData from './EnptyData';

export default function Transactions() {
  const list = useAccountTransList();
  return (
    <div>
      {list.length === 0 ? (
        <EnptyData type="Activities"></EnptyData>
      ) : (
        <div className=" grid grid-cols-1 gap-y-3 mt-4 mb-4">
          {list.map((item, index) => {
            return <TransactionItem key={item.hash + index} data={item}></TransactionItem>;
          })}
        </div>
      )}
    </div>
  );
}
