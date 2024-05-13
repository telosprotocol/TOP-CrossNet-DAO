import Layout from '@/components/layout';
import React, { useEffect } from 'react';

import Head from 'next/head';
import useAppStore from '@/store/appStore';
import CreateProposalComp from '@/components/CreateProposalComp';
export default function CreateProposal() {
  useEffect(() => {
    useAppStore.getState().changeTitle('创建提案');
  }, []);

  return (
    <Layout>
      <Head>
        <title>创建提案</title>
      </Head>
      <div className=" bg-[#EBEDFF] p-4 min-h-[100vh]">
        <div className=" max-w-[640px] mx-auto">
          <CreateProposalComp />
        </div>
      </div>
    </Layout>
  );
}
