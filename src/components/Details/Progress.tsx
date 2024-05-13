import { capitalizeFirstLetter } from '@/utils';

export default function Progress(props: { sourceStatus: any; proposalStatusPaths: any[] }) {
  const { sourceStatus, proposalStatusPaths } = props;

  const statusProgressArr = ['ACTIVE', 'SUCCEEDED', 'EXECUTED'];

  if (sourceStatus === 'ACTIVE' || sourceStatus === 'SUCCEEDED' || sourceStatus === 'EXECUTED') {
    return (
      <div className="mb-3">
        <div className="flex flex-row justify-center items-center">
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>

          {sourceStatus === 'ACTIVE' && (
            <>
              <span className="w-[117px] h-[2px] block bg-[#DBCFFD]"></span>
              <span className="w-3 h-3 rounded-full block bg-[#DBCFFD]"></span>
            </>
          )}
          {sourceStatus !== 'ACTIVE' && (
            <>
              <span className="w-[117px] h-[2px] bg-[#90F] block"></span>
              <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
            </>
          )}

          {sourceStatus === 'EXECUTED' && (
            <>
              <span className="w-[117px] h-[2px] bg-[#90F] block"></span>
              <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
            </>
          )}
          {sourceStatus !== 'EXECUTED' && (
            <>
              <span className="w-[117px] h-[2px] block bg-[#DBCFFD]"></span>
              <span className="w-3 h-3 rounded-full bg-[#DBCFFD] block"></span>
            </>
          )}
        </div>

        <div className="flex flex-row justify-between items-center w-[330px] mx-auto text-center mt-[3px]">
          {statusProgressArr.map((item) => {
            return (
              <span
                className={
                  item === sourceStatus
                    ? 'w-[63px] text-xs text-[#90F]'
                    : 'w-[63px] text-xs text-[rgb(2,8,23)]'
                }
                key={item}>
                {capitalizeFirstLetter(item)}
              </span>
            );
          })}
        </div>
      </div>
    );
  } else if (sourceStatus === 'DEFEATED') {
    // Active，Defeated
    return (
      <div className="mb-3">
        <div className="flex flex-row justify-center items-center">
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
          <span className="w-[117px] h-[2px] bg-[#90F] block"></span>
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
        </div>

        <div className="flex flex-row justify-between items-center w-[330px] mx-auto text-center mt-[3px]">
          <span className={'w-[63px] text-xs text-[#90F]'}>{capitalizeFirstLetter('ACTIVE')}</span>

          <span className={'w-[63px] text-xs text-[#90F]'}>
            {capitalizeFirstLetter('DEFEATED')}
          </span>
        </div>
      </div>
    );
  } else if (sourceStatus === 'EXPIRED') {
    // Active，Expired
    return (
      <div className="mb-3">
        <div className="flex flex-row justify-center items-center">
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
          <span className="w-[117px] h-[2px] bg-[#90F] block"></span>
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
        </div>

        <div className="flex flex-row justify-between items-center w-[330px] mx-auto text-center mt-[3px]">
          <span className={'w-[63px] text-xs text-[#90F]'}>{capitalizeFirstLetter('ACTIVE')}</span>

          <span className={'w-[63px] text-xs text-[#90F]'}>{capitalizeFirstLetter('EXPIRED')}</span>
        </div>
      </div>
    );
  } else if (sourceStatus === 'CANCELED') {
    // Active，Succeeded，Defeated

    if (proposalStatusPaths[proposalStatusPaths.length - 2] === 'ACTIVE') {
      // Active  Cancelled
      return (
        <div className="mb-3">
          <div className="flex flex-row justify-center items-center">
            <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
            <span className="w-[117px] h-[2px] bg-[#90F] block"></span>
            <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
          </div>

          <div className="flex flex-row justify-between items-center w-[330px] mx-auto text-center mt-[3px]">
            <span className={'w-[63px] text-xs text-[#90F]'}>
              {capitalizeFirstLetter('ACTIVE')}
            </span>

            <span className={'w-[63px] text-xs text-[#90F]'}>
              {capitalizeFirstLetter('CANCELED')}
            </span>
          </div>
        </div>
      );
    } else if (proposalStatusPaths[proposalStatusPaths.length - 2] === 'SUCCEEDED') {
      // Active  SUCCEEDED Cancelled
      <div className="mb-3">
        <div className="flex flex-row justify-center items-center">
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
          <span className="w-[117px] h-[2px] bg-[#90F] block"></span>
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
          <span className="w-[117px] h-[2px] bg-[#90F] block"></span>
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
        </div>

        <div className="flex flex-row justify-between items-center w-[330px] mx-auto text-center mt-[3px]">
          <span className={'w-[63px] text-xs text-[#90F]'}>{capitalizeFirstLetter('ACTIVE')}</span>

          <span className={'w-[63px] text-xs text-[#90F]'}>
            {capitalizeFirstLetter('SUCCEEDED')}
          </span>

          <span className={'w-[63px] text-xs text-[#90F]'}>
            {capitalizeFirstLetter('CANCELED')}
          </span>
        </div>
      </div>;
    } else if (proposalStatusPaths[proposalStatusPaths.length - 2] === 'DEFEATED') {
      // Active  SUCCEEDED Cancelled
      <div className="mb-3">
        <div className="flex flex-row justify-center items-center">
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
          <span className="w-[117px] h-[2px] bg-[#90F] block"></span>
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
          <span className="w-[117px] h-[2px] bg-[#90F] block"></span>
          <span className="w-[18px] h-[18px] rounded-full bg-[#90F] block"></span>
        </div>

        <div className="flex flex-row justify-between items-center w-[330px] mx-auto text-center mt-[3px]">
          <span className={'w-[63px] text-xs text-[#90F]'}>{capitalizeFirstLetter('ACTIVE')}</span>

          <span className={'w-[63px] text-xs text-[#90F]'}>
            {capitalizeFirstLetter('DEFEATED')}
          </span>

          <span className={'w-[63px] text-xs text-[#90F]'}>
            {capitalizeFirstLetter('CANCELED')}
          </span>
        </div>
      </div>;
    }
  }
  return <></>;
}
