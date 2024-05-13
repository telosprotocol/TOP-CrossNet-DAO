import useAccountStore from '@/store/account'

const fevmChainId = process.env.NEXT_PUBLIC_CHAIN_ID || ''
export default function useIsRightChainId() {
  const chainId = useAccountStore((state) => state.chainId)
  return chainId === fevmChainId
}
