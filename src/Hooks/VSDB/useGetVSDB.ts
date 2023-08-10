import { useInfiniteQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import {
  DisplayFieldsResponse,
  getObjectDisplay,
  getObjectFields,
  ObjectId,
} from '@mysten/sui.js'

import { AMMState } from '@/Constants/API/pool'
import { VotingState } from '@/Constants/API/vote'
import { voting_weight } from '@/Constants/API/vsdb'

const MAX_OBJECTS_PER_REQ = 6

export const vsdb_package = import.meta.env.VITE_VSDB_PACKAGE as string

export type Vsdb = {
  id: ObjectId
  level: string
  experience: string
  vesdb: string
  balance: string
  end: string
  player_epoch: string
  modules: string[]
  amm_state?: AMMState
  voting_state?: VotingState
  display: DisplayFieldsResponse['data']
}

export function useGetVSDB(
  address?: string | null,
  maxObjectRequests = MAX_OBJECTS_PER_REQ,
) {
  const rpc = useRpc()
  return useInfiniteQuery(
    ['get-vsdbs', address],
    async ({ pageParam }) => {
      const res = await rpc.getOwnedObjects({
        owner: address!,
        filter: {
          MatchAll: [{ StructType: `${vsdb_package}::vsdb::Vsdb` }],
        },
        options: {
          showContent: true,
          showDisplay: true,
        },
        limit: maxObjectRequests,
        cursor: pageParam,
      })
      if (res.data.length == 0) return null

      const data = res.data.map((vsdb_d) => {
        const fields = getObjectFields(vsdb_d)
        const display = getObjectDisplay(vsdb_d).data
        return {
          ...fields,
          id: fields!.id.id as string,
          modules: fields?.modules.fields.contents ?? [],
          display,
        } as Vsdb
      })
      let all_vesdb = await Promise.all(
        data.map((vsdb) => voting_weight(rpc, address!, vsdb.id)),
      )
      all_vesdb.forEach((vesdb, idx) => (data[idx].vesdb = vesdb))
      return {
        ...res,
        data,
      }
    },
    {
      staleTime: 10 * 1000,
      enabled: !!address,
      getNextPageParam: (lastPage) =>
        lastPage?.hasNextPage ? lastPage.nextCursor : null,
    },
  )
}
