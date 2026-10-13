import {create} from 'zustand'

type State = {
  isModalOpen: boolean
}

type Action = {
  openModal: () => void
  closeModal: () => void
}

export const useModalWindowStore = create<State & Action>((set) => ({
  isModalOpen: false,
  openModal: () => set({isModalOpen: true}),
  closeModal: () => set({isModalOpen: false}),

}))
