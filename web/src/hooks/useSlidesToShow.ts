import { useState, useEffect } from 'react'
import debounce from 'lodash.debounce'
export const useSlidesToShow = () => {
  const [slidesToShow, setSlidesToShow] = useState(4)

  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(4)
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(2)
      } else {
        setSlidesToShow(1)
      }
    }

    updateSlides()
    const debouncedUpdate = debounce(updateSlides, 100)

    window.addEventListener('resize', debouncedUpdate)
    return () => {
      window.removeEventListener('resize', debouncedUpdate)
      debouncedUpdate.cancel()
    }
  }, [])

  return slidesToShow
}
