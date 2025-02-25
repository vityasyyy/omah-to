import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function SoftCircle(props: { className?: string }) {
  return (
    <main
      className={cn(
        'absolute z-0 inset-x-0 -inset-y-20 overflow-visible',
        props.className
      )}
    >
      <div className='relative w-full h-full'>
        <Image
          src={`/ellipse.svg`}
          alt='Circle'
          sizes='20%'
          fill
          className='object-contain'
        />
      </div>
    </main>
  )
}
