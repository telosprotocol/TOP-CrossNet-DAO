import Layout from '@/components/layout';
import React, { useEffect, useState } from 'react';
import useAppStore from '@/store/appStore';
import ProposalListComp from '@/components/ProposalListComp';

export default function ProposalList() {
 

  useEffect(() => {
    useAppStore.getState().changeTitle(`提案清单`);
  }, []);

  return (
    <Layout>
      <div className=" bg-[#EBEDFF] p-4 min-h-[100vh]">
        <div className=" container mx-auto">
          <ProposalListComp></ProposalListComp>
        </div>
      </div>
    </Layout>
  );
}
