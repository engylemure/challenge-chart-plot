import { useLayoutEffect, useState } from 'react'
import debounce from 'lodash/debounce'

export function useWindowSize() {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    function updateSize() {
      setSize(oldSize => {
        return [window.innerWidth, window.innerHeight]
      })
    }
    const debouncedFunction = debounce(updateSize, 150)
    window.addEventListener('resize', debouncedFunction)
    debouncedFunction()
    return () => window.removeEventListener('resize', debouncedFunction)
  }, [])
  return size
}
