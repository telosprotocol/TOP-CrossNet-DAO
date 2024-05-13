
export default function StatusBtn(props: { sourceStatus: string | undefined }) {
  const { sourceStatus } = props;

  switch (sourceStatus) {
    case 'ACTIVE':
      return (
        <span className="bg-[#FF8A0F1A] text-[#FF8A0F] rounded-full w-[100px] h-5 text-xs cursor-default flex items-center justify-center">
          Active
        </span>
      );

    case 'SUCCEEDED':
      return (
        <span className="bg-[#00C9A71A] text-[#00C9A7] rounded-full w-[100px] h-5 text-xs cursor-default flex items-center justify-center">
          Succeeded
        </span>
      );
    case 'DEFEATED':
      return (
        <span className="bg-[#C5CFD51A] text-[#C5CFD5] rounded-full w-[100px] h-5 text-xs cursor-default flex items-center justify-center">
          Defeated
        </span>
      );
    case 'EXECUTED':
      return (
        <span className="bg-[#3642FF1A] text-[#3642FF] rounded-full w-[100px] h-5 text-xs cursor-default flex items-center justify-center">
          Executed
        </span>
      );
    case 'CANCELED':
      return (
        <span className="bg-[#FFB8001A] text-[#FFB800] rounded-full w-[100px] h-5 text-xs cursor-default flex items-center justify-center">
          Canceled
        </span>
      );
    case 'EXPIRED':
      return (
        <span className="bg-[#CD5EF31A] text-[#CD5EF3] rounded-full w-[100px] h-5 text-xs cursor-default flex items-center justify-center">
          Expired
        </span>
      );
    case 'FIXED':
      return (
        <span className="bg-[#CD5EF31A] text-[#CD5EF3] rounded-full w-[100px] h-5 text-xs cursor-default flex items-center justify-center">
          Fixed
        </span>
      );

    default:
      return <></>;
  }
}
