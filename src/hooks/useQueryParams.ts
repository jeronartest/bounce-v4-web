import { ParsedUrlQuery, parse } from 'querystring'
import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'

export function useQueryParams(hasRouteParams = true): ParsedUrlQuery {
  const { search } = useLocation()
  const params = useParams()
  const query = search.split('?')
  return useMemo(() => {
    let ret: ParsedUrlQuery = {}
    if (query.length > 1) {
      ret = parse(query[1])
    }
    return hasRouteParams ? Object.assign(params, ret) : ret
  }, [hasRouteParams, params, query])
}
