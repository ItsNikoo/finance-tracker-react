import {useModalWindowStore} from "../stores/modalWindowStore.ts"

export default function Example() {
  const isModalOpen = useModalWindowStore(state => state.isModalOpen)
  const openModal = useModalWindowStore(state => state.openModal)
  const closeModal = useModalWindowStore(state => state.closeModal)

  return (
    <div>
      <button onClick={openModal}>
        Открыть модалку
      </button>

      {isModalOpen && (
        <div>
          <p>Модальное окно</p>

          <button onClick={closeModal}>
            Закрыть
          </button>
        </div>
      )}
    </div>
  )

}
