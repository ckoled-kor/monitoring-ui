import create from 'zustand';
import produce from 'immer';

import { IService } from '../../interfaces';

const addServices = (services: IService[], newServices: IService[]): IService[] => produce(services, draft => {
  draft.push(...newServices)
})

type ServiceStore = {
  services: IService[];
  addServices: (newServices: IService[]) => void;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  addServices(newServices: IService[]) {
    set((state) => ({
      ...state,
      services: addServices(state.services, newServices)
    }))
  },
}))