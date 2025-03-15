'use client'
import { useState, useRef } from 'react'

const Card3D = () => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()

    // Calculate cursor position relative to the card center
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Calculate rotation based on mouse position (limit to 15 degrees)
    const rotateY = (mouseX / (rect.width / 2)) * 15
    const rotateX = -(mouseY / (rect.height / 2)) * 15

    // Calculate relative mouse position for shine effect (0-100%)
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100
    const relativeY = ((e.clientY - rect.top) / rect.height) * 100

    setRotation({ x: rotateX, y: rotateY })
    setMousePosition({ x: relativeX, y: relativeY })
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div
      className='relative h-[400px] w-[300px] cursor-pointer perspective-[1000px]'
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <div
        className={`h-full w-full rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 transition-all duration-300 ease-out ${isHovered ? 'shadow-[0_0_15px_rgba(66,220,219,0.3),_0_0_30px_rgba(66,220,219,0.2),_0_0_45px_rgba(66,220,219,0.1)]' : 'shadow-lg'}`}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Reflective shine overlay */}
        <div
          className={`pointer-events-none absolute inset-0 overflow-hidden rounded-2xl transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-0'}`}
        >
          <div
            className='bg-gradient-radial absolute from-white via-transparent to-transparent'
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateX(${mousePosition.x - 50}%) translateY(${mousePosition.y - 50}%)`,
              width: '200%',
              height: '200%',
              top: '-50%',
              left: '-50%',
              mixBlendMode: 'overlay',
            }}
          />
        </div>

        {/* Card content */}
        <div className='flex h-full w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-gray-800/80 p-5 text-center text-white backdrop-blur-sm'>
          <h2 className='mb-5 bg-gradient-to-r from-[#42dcdb] to-[#68a0ff] bg-clip-text text-3xl font-bold text-transparent'>
            3D Card
          </h2>
          <p className='mb-2 text-base text-gray-300'>
            Hover over me to see the 3D effect!
          </p>
          <p className='text-base text-gray-300'>
            I rotate with a reflective shine when hovered.
          </p>
        </div>
      </div>
    </div>
  )
}

const TestPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-900'>
      <Card3D />
    </div>
  )
}

export default TestPage
