import ElectionDescComp from '@/components/ElectionDescComp';
import Layout from '@/components/layout';
import Head from 'next/head';
import React from 'react';

export default function ElectionDesc() {
  return (
    <Layout>
      <Head>
        <title>选举轮次说明</title>
      </Head>
      <ElectionDescComp></ElectionDescComp>
    </Layout>
  );
}
