import {useCallback, useEffect, useState} from "react"

// The loader must be stable, for example an imported API function.
export function useApiQuery<T>(loader: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<{
    data: T | undefined,
    isLoading: boolean,
    error: Error | null,
  }>({data: undefined, isLoading: true, error: null})
  const [revision, setRevision] = useState(0)
  const refetch = useCallback(() => {
    setState(previous => ({...previous, isLoading: true, error: null}))
    setRevision(previous => previous + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const data = await loader(controller.signal)
        if (!controller.signal.aborted) setState({data, isLoading: false, error: null})
      } catch (error) {
        if (!controller.signal.aborted) {
          setState(previous => ({...previous, isLoading: false,
            error: error instanceof Error ? error : new Error("Не удалось загрузить данные"),
          }))
        }
      }
    }
    void load()
    return () => controller.abort()
  }, [loader, revision])

  return {...state, isError: state.error !== null, refetch}
}
