import { AccordionDetailsProps, AccordionDetails as JoyAccordionDetails } from '@mui/joy'

export default function AccordionDetails({ children, ...props }: AccordionDetailsProps) {
  return (
    <JoyAccordionDetails
      slotProps={{
        content: {
          className: 's-bg-content'
        }
      }}
      {...props}
    >
      {children}
    </JoyAccordionDetails>
  )
}
