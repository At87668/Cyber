import clsx from 'clsx'

export const TimelineList: Component = ({ children, className }) => (
  <ul className={clsx('cyber-timeline', className)}>{children}</ul>
)
