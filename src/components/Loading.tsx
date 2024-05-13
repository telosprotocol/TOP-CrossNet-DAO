import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/images/loading.png"
        width={64}
        height={64}
        alt=""
        className="w-16 h-16 animate-spin duration-1500"
      />
      <span className=" text-[#999999] text-sm">loading</span>
    </div>
  );
}
