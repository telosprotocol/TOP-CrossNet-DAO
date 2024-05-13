import Image from 'next/image';
export default function Nodata() {
  return (
    <div className="flex flex-col items-center py-[200px]">
      <Image width={72} height={56} alt={'no data'} src={'/images/nodata.png'} className=" rounded-md"/>
      <span className=" text-[#999999] text-sm pt-1">暂无数据</span>
    </div>
  );
}
