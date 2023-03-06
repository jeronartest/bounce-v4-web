import { useSelector } from 'react-redux'
import { AppState } from 'state'

export function useOptionDatas() {
  const configOptions = useSelector<AppState, AppState['configOptions']>(state => state.configOptions)
  return configOptions.optionDatas
}
