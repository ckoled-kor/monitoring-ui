import create from 'zustand';

import { ILogGroup } from '../../interfaces';

type LogGroupState = {
  [key: string]: ILogGroup[]
}

const addLogGroups = (logGroups: LogGroupState, newLogGroups: ILogGroup[], name: string): LogGroupState => {
  const newState = {...logGroups}
  newState[name] = newLogGroups
  return newState;
}

type LogGroupStore = {
  logGroups: LogGroupState;
  addLogGroups: (newLogGroups: ILogGroup[], name: string) => void;
}

export const useLogGroupStore = create<LogGroupStore>((set) => ({
  logGroups: {},
  addLogGroups(newLogGroups: ILogGroup[], name: string) {
    set((state) => ({
      ...state,
      logGroups: addLogGroups(state.logGroups, newLogGroups, name)
    }))
  },
}))