import { Button } from '@/components/ui/button';
import { cancelProposal, castVoteBySig, executeProposal } from '@/eth/method';
import React, { useState } from 'react';

export default function Test1() {
  function cancel() {
    // cancelProposal('72947131794489755218677772111899159265706968014035764201890702057082374117075');
    // castVoteBySig('880dd45da4aa55e1db28b48957e4831c0ee32f50cef865dab85c68775d8756b8', '1');
    executeProposal('880dd45da4aa55e1db28b48957e4831c0ee32f50cef865dab85c68775d8756b8');
  }
  return (
    <div>
      <Button onClick={cancel}>aaa</Button>
    </div>
  );
}
