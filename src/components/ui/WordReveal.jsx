import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { EASE } from './Reveal'

const parent = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
const word = { hidden: { y: '118%' }, show: { y: '0%', transition: { duration: 1.25, ease: EASE } } }

/** Frase revelada palavra por palavra (cada palavra sobe de uma máscara). */
export default function WordReveal({ lines, as = 'h2', className = '' }) {
  const Comp = motion[as] ?? motion.h2
  return (
    <Comp
      className={className}
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line.split(' ').map((w, j) => (
            <Fragment key={j}>
              <span className="word-mask">
                <motion.span className="word" variants={word}>
                  {w}
                </motion.span>
              </span>{' '}
            </Fragment>
          ))}
        </span>
      ))}
    </Comp>
  )
}
