import { ParsedUrlQuery, parse } from 'querystring'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function useQueryParams(): ParsedUrlQuery {
  const { search } = useLocation()
  const query = search.split('?')
  return useMemo(() => {
    if (query.length > 1) {
      return parse(query[1])
    }
    return {}
  }, [query])
}
