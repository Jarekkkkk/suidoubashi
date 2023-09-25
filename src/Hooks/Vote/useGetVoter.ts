import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { get_voter, voter } from '@/Constants/API/vote'

export const useGetVoter = () => {
  const rpc = useRpc()
  return useQuery(['voter', voter], () => get_voter(rpc, voter), {
    enabled: !!voter,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
