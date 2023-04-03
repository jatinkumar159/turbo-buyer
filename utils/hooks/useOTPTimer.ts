import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export default function useOTPTimer(): {
  timer: number
  setTimer: Dispatch<SetStateAction<number>>
} {
  const [timer, setTimer] = useState<number>(30)

  useEffect(() => {
    const interval =
      timer > 0
        ? setInterval(() => setTimer((time) => time - 1), 1000)
        : undefined
    return () => clearInterval(interval)
  }, [timer])

  return {
    timer,
    setTimer,
  }
}
