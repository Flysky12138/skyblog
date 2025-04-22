import React from 'react'

export const useWorker = <T, D>(scriptURL: string | URL, options?: WorkerOptions) => {
  const [result, setResult] = React.useState<D | null>(null)
  const [isRunning, setIsRunning] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const workerRef = React.useRef<Worker>(null)

  React.useEffect(() => {
    workerRef.current = new Worker(scriptURL, options)

    workerRef.current.onmessage = event => {
      setResult(event.data)
      setIsRunning(false)
    }

    workerRef.current.onerror = err => {
      setError(err.message)
      setIsRunning(false)
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [options, scriptURL])

  const run = (data: T) => {
    setIsRunning(true)
    setError(null)
    setResult(null)
    workerRef.current?.postMessage(data)
  }

  const clear = () => {
    setIsRunning(false)
    setError(null)
    setResult(null)
    workerRef.current?.terminate()
  }

  return { clear, error, isRunning, result, run }
}
