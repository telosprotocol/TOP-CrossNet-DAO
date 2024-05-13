import { Card } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { copyToClipboard, formatAddress } from '@/utils';
import toast from 'react-hot-toast';
import { functionTemplatePage } from '@/api';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';

export default function ProposalListComp() {
  let { data: templateList } = useQuery({
    queryKey: ['functionTemplatePage'],
    queryFn: () => functionTemplatePage(),
  });

  if (!templateList) {
    templateList = [];
  }
  return (
    <div>
      <div className="hidden sm:block px-[44px] py-[10px] pb-[20px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" font-bold text-[#2C1843]">接口名</TableHead>
              <TableHead className=" font-bold text-[#2C1843]">功能简述</TableHead>
              <TableHead className=" font-bold text-[#2C1843]">ABI</TableHead>
              <TableHead className=" font-bold text-[#2C1843]">kindID</TableHead>
              <TableHead className=" font-bold text-[#2C1843]">合约地址</TableHead>
              <TableHead className=" font-bold text-[#2C1843]">目标链</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templateList.map((invoice: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="text-[#666666]">{invoice.functionName}</TableCell>
                <TableCell className="text-[#666666]">{invoice.remark}</TableCell>
                <TableCell className="flex items-center text-[#666666]">
                  {invoice.abiText.substring(0, 50)}...
                  <span
                    className=" flex-grow-0 flex-shrink-0 w-6 text-right flex felx-row justify-end"
                    onClick={() => {
                      copyToClipboard(invoice.abiText);
                      toast.success('Copyed!');
                    }}>
                    <Image
                      src={'/images/copy.png'}
                      width={11}
                      height={11}
                      alt="copy"
                      className=" flex-shrink-0 flex-grow-0 w-3 h-3"
                    />
                  </span>
                </TableCell>
                <TableCell className="text-[#666666]">{invoice.kindId}</TableCell>
                <TableCell className="text-[#666666]">
                  {formatAddress(invoice.contractAddress)}
                </TableCell>
                <TableCell className="text-[#666666]">{invoice.chain}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="sm:hidden">
        {templateList.map((item: any, index: number) => {
          return (
            <Card className="p-6  pb-3 mb-3 break-all text-sm" key={index}>
              <div className="mb-3 flex flex-row justify-start">
                <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]">接口名</span>
                <span className="text-[#666]">{item.functionName}</span>
              </div>

              <div className="mb-3 flex flex-row justify-start">
                <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]">功能简述</span>
                <span className="text-[#666]">{item.remark}</span>
              </div>

              <div className="mb-3 flex flex-row justify-start">
                <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]">ABI</span>
                <span className="text-[#666]">{item.abiText}</span>

                <span
                  className=" flex-grow-0 flex-shrink-0 w-6 text-right flex felx-row justify-end"
                  onClick={() => {
                    copyToClipboard(item.abiText);
                    toast.success('Copyed!');
                  }}>
                  <Image
                    src={'/images/copy.png'}
                    width={11}
                    height={11}
                    alt="copy"
                    className=" flex-shrink-0 flex-grow-0 w-3 h-3"
                  />
                </span>
              </div>

              <div className="mb-3 flex flex-row justify-start">
                <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]">kindID</span>
                <span className="text-[#666]">{item.kindId}</span>
              </div>

              <div className="mb-3 flex flex-row justify-start">
                <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]">合约地址</span>
                <span className="text-[#666]">{item.contractAddress}</span>
              </div>

              <div className="mb-3 flex flex-row justify-start">
                <span className="text-[#2C1843] flex-shrink-0 flex-grow-0 w-[100px]">目标链</span>
                <span className="text-[#666]">{item.chain}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
