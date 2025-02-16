import { cn } from '@/lib/utils'
import SmallStyledCard from './small-styled-card'

const RemainingTime = (props: { className?: string }) => {
  return (
    <SmallStyledCard className={cn('text-error-700 ', props.className)}>
      Time: 00:00:00
    </SmallStyledCard>
  )
}

export default RemainingTime
