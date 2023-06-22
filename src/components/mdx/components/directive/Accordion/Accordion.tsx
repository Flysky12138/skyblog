import { AccordionProps, Accordion as JoyAccordion } from '@mui/joy'

export default function Accordion({ children, defaultExpanded, disabled, ...props }: AccordionProps) {
  return (
    <JoyAccordion defaultExpanded={Boolean(defaultExpanded)} disabled={Boolean(disabled)} {...props}>
      {children}
    </JoyAccordion>
  )
}
