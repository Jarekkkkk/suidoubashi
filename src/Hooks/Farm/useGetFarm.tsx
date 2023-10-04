//import { useQueries, useQuery } from '@tanstack/react-query'
//import useRpc from '../useRpc'
//import { Farm, farm_reg, get_farm } from '@/Constants/API/farm'
//import { getObjectFields } from '@mysten/sui.js'
//import { useMemo } from 'react'

//function useGetFarmIDs() {
//  const rpc = useRpc()
//
//  return useQuery(['get-farm-ids', farm_reg], async () => {
//    const res = await rpc.getObject({
//      id: farm_reg,
//      options: { showContent: true },
//    })
//    return getObjectFields(res)!.farms.fields.contents.map(
//      (f: any) => f.fields.value,
//    )
//  })
//}
//
//function useGetMulFarm(farm_ids: (undefined | string)[]) {
//  const rpc = useRpc()
//  const farms = useQueries({
//    queries:
//      farm_ids?.map((id) => ({
//        queryKey: ['farm', id],
//        queryFn: () => get_farm(rpc, id!),
//        enabled: !!id,
//      })) ?? [],
//  })
//  return useMemo(() => {
//    if (!farm_ids) return { isLoading: true, data: null }
//    if (farms.length == 0) return { isLoading: false, data: [] }
//
//    const isLoading = farms.some((v) => v.isLoading)
//    const ret: Farm[] = []
//
//    farms.forEach(({ data }) => {
//      if (!data) return { isLoading, data: [] }
//      ret.push(data)
//    })
//    return { isLoading, data: ret.length ? ret : [] }
//  }, [farms])
//}
