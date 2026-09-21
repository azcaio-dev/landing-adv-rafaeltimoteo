import { motion } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]

/** Fade-up lento ao entrar na viewport. */
export function Reveal({ as = 'div', delay = 0, y = 26, duration = 1.15, className, children, ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -6% 0px' }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
}

/** Container que faz stagger dos <StaggerItem> filhos. */
export function Stagger({ as = 'div', className, children, amount = 0.15, ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function StaggerItem({ as = 'div', className, children, ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp className={className} variants={item} {...rest}>
      {children}
    </Comp>
  )
}
