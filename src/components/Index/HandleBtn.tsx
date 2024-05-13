import useAppStore from '@/store/appStore';
import router from 'next/router';
import { Button } from '../ui/button';

export default function HandleBtn(props: {
  item: IdaoProposalPageResItem;
  setMskData: any;
  setIsIndexDialogShow: any;
  position: 'indexRecentProposals' | 'detailsBaseInfo' | 'detailsVoteInfo';
}) {
  const { item, setMskData, setIsIndexDialogShow, position } = props;
  const handleSet = (title: string, type: string) => {
    setIsIndexDialogShow(true);

    setMskData({
      title,
      type,
      setIsIndexDialogShow: setIsIndexDialogShow,
      item,
    });
  };

  switch (item.sourceStatus) {
    case 'ACTIVE':
      if (position === 'indexRecentProposals' || position === 'detailsBaseInfo') {
        if (position === 'indexRecentProposals') {
          return (
            <div className="flex flex-row justify-center">
              <Button
                className="bg-[#EB5BCC] w-[48%] max-w-[300px] mx-3"
                onClick={() => {
                  handleSet('关闭提案', 'cancal');
                }}>
                取消提案
              </Button>
              <Button
                className="w-[48%] max-w-[300px] mx-3"
                onClick={() => {
                  handleSet('投票', 'vote');
                }}>
                投票
              </Button>
            </div>
          );
        } else {
          return (
            <div className="flex flex-row justify-center">
              <Button
                className="bg-[#EB5BCC] w-[48%] max-w-[300px] mx-3"
                onClick={() => {
                  handleSet('关闭提案', 'cancal');
                }}>
                取消提案
              </Button>
            </div>
          );
        }
      } else {
        return (
          <div className="flex flex-row justify-center">
            <Button
              className="w-full max-w-[300px] mx-3"
              onClick={() => {
                handleSet('投票', 'vote');
              }}>
              投票
            </Button>
          </div>
        );
      }

    case 'SUCCEEDED':
      if (position === 'indexRecentProposals' || position === 'detailsBaseInfo') {
        return (
          <div className="flex flex-row justify-center">
            <Button
              className="bg-[#EB5BCC] w-[48%] max-w-[300px] mx-3"
              onClick={() => {
                handleSet('关闭提案', 'cancal');
              }}>
              取消提案
            </Button>
            <Button
              className="w-[48%] max-w-[300px] mx-3"
              onClick={() => {
                handleSet('执行提案', 'executed');
              }}>
              执行提案
            </Button>
          </div>
        );
      } else {
        return <></>;
      }

    case 'DEFEATED':
      if (position === 'indexRecentProposals' || position === 'detailsBaseInfo') {
        return (
          <div className="flex flex-row justify-center">
            <Button
              className="w-[100%] max-w-[300px] mx-3"
              onClick={() => {
                useAppStore.getState().changeCreateProposalId(item?.proposalId as string);
                if (window.innerWidth < 640) {
                  router.push('/createProposal');
                } else {
                  useAppStore.getState().changeOpenCreate(true);
                }
              }}>
              重新提交
            </Button>
            {/* <Button
              className="bg-[#EB5BCC] w-[48%] max-w-[300px] mx-3"
              onClick={() => {
                handleSet('关闭提案', 'cancal');
              }}>
              取消提案
            </Button>
            <Button className="w-[48%] max-w-[300px] mx-3" disabled>
              执行提案
            </Button> */}
          </div>
        );
      } else {
        return <></>;
      }
    case 'EXECUTED':
      if (position === 'indexRecentProposals' || position === 'detailsBaseInfo') {
        if (item.targetStatus === 'FAIL') {
          return (
            <div className="flex flex-row justify-center">
              <Button
                className="w-[100%] max-w-[300px] mx-3"
                onClick={() => {
                  handleSet('修正提案', 'correction');
                }}>
                修正提案
              </Button>
            </div>
          );
        }
        return <></>;
      } else {
        return <></>;
      }
    case 'CANCELED':
      if (position === 'indexRecentProposals' || position === 'detailsBaseInfo') {
        return (
          <div className="flex flex-row justify-center">
            <Button
              className="w-[100%] max-w-[300px] mx-3"
              onClick={() => {
                useAppStore.getState().changeCreateProposalId(item?.proposalId as string);
                if (window.innerWidth < 640) {
                  router.push('/createProposal');
                } else {
                  useAppStore.getState().changeOpenCreate(true);
                }
              }}>
              重新提交
            </Button>
          </div>
        );
      } else {
        return <></>;
      }
    case 'EXPIRED':
      if (position === 'indexRecentProposals' || position === 'detailsBaseInfo') {
        return (
          <div className="flex flex-row justify-center">
            <Button
              className="w-[100%] max-w-[300px] mx-3"
              onClick={() => {
                useAppStore.getState().changeCreateProposalId(item?.proposalId as string);
                if (window.innerWidth < 640) {
                  router.push('/createProposal');
                } else {
                  useAppStore.getState().changeOpenCreate(true);
                }
              }}>
              重新提交
            </Button>
          </div>
        );
      } else {
        return <></>;
      }
    default:
      return <></>;
  }
}
