import { extendTheme } from '@chakra-ui/react'
import { Mulish } from '@next/font/google'
import { ActionModalTheme } from '../../components/theme/action-modal/actionModal'

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
}

export const theme = extendTheme({
  components: {
    Modal: ActionModalTheme,
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label':
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'white',
              pointerEvents: 'none',
              lineHeight: 1.7,
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top',
            },
          },
        },
      },
    },
    Radio: {
      parts: ['label'],
      baseStyle: {
        label: {
          display: `inline-flex`,
          width: `100%`,
        },
      },
    },
  },
})

export const mulish = Mulish({
  subsets: ['latin'],
})
