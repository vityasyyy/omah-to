import { cn } from '@/lib/utils'
import * as motion from 'motion/react-client'

export default function SoftCircle(props: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.1 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 3, type: "spring",
        ease: 'easeIn'
       }}
      viewport={{ once: true }}
      className={cn(
        'from-primary-500/70 absolute inset-0 z-0 rounded-full bg-radial/decreasing to-transparent object-contain blur-3xl',
        props.className
      )}
    />
  )
}
