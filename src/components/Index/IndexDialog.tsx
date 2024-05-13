import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cancelProposal, castVoteBySig, createProposalMethod, executeProposal } from '@/eth/method';
import { useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import useAppStore from '@/store/appStore';
import { kindIdToName } from '@/utils';

export function IndexDialog(props: IndexMskData) {
  const { title, type, open, setIsIndexDialogShow = (e: boolean) => {}, item } = props;
  const [btnLoading, setBtnLoading] = useState(false);
  const [voteType, setVoteType] = useState<any>(null);

  const router = useRouter();

  const btnClick = async (props: any) => {
    const { invoke, support, setType } = props;
    let res: any;
    if (setType === 'vote' && !support) return false;
    setBtnLoading(true);
    setVoteType(support);

    if (setType === 'correction') {
      res = await invoke(item);
    } else {
      res = await invoke(item?.proposalId, support);
    }

    setBtnLoading(false);
    if (res) {
      toast.success('操作成功');
      if (typeof res === 'string' && res.length === 64) {
        setIsIndexDialogShow(false);
        if (window.innerWidth < 640) {
          router.push('/details?proposalId=' + res);
        } else {
          useAppStore.getState().changeOpenDetails(res);
        }
        return;
      }

      setTimeout(() => {
        setIsIndexDialogShow(false);
      }, 2000);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setIsIndexDialogShow(false);
      }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className=" text-left">
            {title}{' '}
            <span className="text-[#666] text-sm font-normal ml-3">
              {item?.nonce}: {item?.functionName}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-sm">
          <div className="mb-3 flex flex-row justify-start">
            <span className="text-[#2C1843]">提案类型：</span>
            <span className="text-[#666]">
              {kindIdToName(item?.kindId)}：{item?.sourceChain} -&gt; {item?.targetChain}
            </span>
          </div>
          <div className="mb-3 flex flex-row justify-start">
            <span className="text-[#2C1843]">提案状态：</span>
            <span className="text-[#666]">{item?.sourceStatus}</span>
          </div>

          <div className="mb-3 flex flex-row justify-start">
            <span className="text-[#2C1843] flex-shrink-0 flex-grow-0">提案执行信息：</span>
            <span className="text-[#666] break-all">{item?.abiFunction?.abiText}</span>
          </div>
        </div>

        {type === 'cancal' && (
          <DialogFooter className="flex flex-row justify-between">
            <Button
              className="w-[48%]"
              onClick={() => {
                setIsIndexDialogShow(false);
              }}>
              关闭页面
            </Button>
            <Button
              disabled={btnLoading}
              className="w-[48%] bg-[#EB5BCC]"
              onClick={() => {
                btnClick({
                  invoke: cancelProposal,
                  setType: 'cancal',
                });
              }}>
              {btnLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} 取消提案
            </Button>
          </DialogFooter>
        )}

        {type === 'executed' && (
          <DialogFooter className="flex flex-row justify-between">
            <Button
              className="w-[48%]"
              onClick={() => {
                setIsIndexDialogShow(false);
              }}>
              取消
            </Button>
            <Button
              disabled={btnLoading}
              className="w-[48%] bg-[#EB5BCC]"
              onClick={() => {
                btnClick({ invoke: executeProposal, setType: 'executed' });
              }}>
              {btnLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} 执行
            </Button>
          </DialogFooter>
        )}

        {type === 'correction' && (
          <DialogFooter className="flex flex-row justify-between">
            <Button
              className="w-[48%]"
              onClick={() => {
                setIsIndexDialogShow(false);
              }}>
              取消
            </Button>
            <Button
              disabled={btnLoading}
              className="w-[48%] bg-[#EB5BCC]"
              onClick={() => {
                btnClick({ invoke: createProposalMethod, setType: 'correction' });
              }}>
              {btnLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} 修正
            </Button>
          </DialogFooter>
        )}

        {type === 'vote' && (
          <DialogFooter className="flex flex-row justify-between">
            <Button
              className="w-[84px]"
              disabled={btnLoading}
              onClick={() => {
                btnClick({ invoke: castVoteBySig, support: '1', setType: 'vote' });
              }}>
              {btnLoading && voteType === '1' && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}{' '}
              赞成
            </Button>
            <Button
              disabled={btnLoading}
              className="w-[84px] bg-[#EB5BCC]"
              onClick={() => {
                btnClick({ invoke: castVoteBySig, support: '0', setType: 'vote' });
              }}>
              {btnLoading && voteType === '0' && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}{' '}
              反对
            </Button>
            <Button
              disabled={btnLoading}
              className="w-[84px] bg-[#EFDEFF]"
              onClick={() => {
                btnClick({ invoke: castVoteBySig, support: '2', setType: 'vote' });
              }}>
              {btnLoading && voteType === '2' && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}{' '}
              弃权
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
