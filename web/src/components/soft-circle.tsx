import { cn } from '@/lib/utils'

export default function SoftCircle(props: { className?: string }) {
  return (
    <div
      className={cn(
        'from-primary-500/70 absolute z-0 inset-0 rounded-full bg-radial/decreasing to-transparent object-contain blur-3xl',
        props.className
      )}
    />
  )
}
