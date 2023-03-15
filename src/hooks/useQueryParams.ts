import { ParsedUrlQuery, parse } from 'querystring'
import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'

export function useQueryParams(hasRouteParams = true) {
  const { search } = useLocation()
  const params = useParams()
  const query = search.split('?')
  return useMemo(() => {
    let ret: ParsedUrlQuery = {}
    if (query.length > 1) {
      ret = parse(query[1])
    }
    const result: { [key: string]: string | undefined } = {}
    const d = hasRouteParams ? Object.assign(params, ret) : ret
    for (const key in d) {
      const element = d[key]
      result[key] = element?.toString()
    }
    return result
  }, [hasRouteParams, params, query])
}
