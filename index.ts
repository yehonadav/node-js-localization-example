import {createIntl, createIntlCache} from '@formatjs/intl'
import heb from './heb.json';

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache()

// Create the `intl` object
const intl = createIntl(
  {
    // Locale of the application
    locale: 'heb',
    // Locale of the fallback defaultMessage
    defaultLocale: 'heb',
    messages: heb,
  },
  cache
)

console.log(
  intl.formatMessage(
    {
      id: 'poopFormat',
    }
  )
)
