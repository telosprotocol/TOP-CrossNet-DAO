import { daoProposalDetail } from '@/api';
import Progress from '@/components/Details/Progress';
import DetailsComp from '@/components/DetailsComp';
import HandleBtn from '@/components/Index/HandleBtn';
import { IndexDialog } from '@/components/Index/IndexDialog';
import Layout from '@/components/layout';
import useVotingRatio from '@/hooks/useVotingRatio';
import useAppStore from '@/store/appStore';
import { getSearchParams, kindTypeById } from '@/utils';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Details() {
  const router = useRouter()

  return (
    <Layout>
      <div className="bg-[#F7F4FF] min-h-screen">
        <div className="container mx-auto ">
          <DetailsComp proposalId={router.query.proposalId} wrap={(c: any) => <div>{ c}</div>} />
        </div>
      </div>
    </Layout>
  );
}
