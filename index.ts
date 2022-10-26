import {createIntl, createIntlCache, IntlShape} from '@formatjs/intl'
import hebMessages from './heb.json';

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache()

// Create the `intl` object
const en = createIntl(
  {
    // Locale of the application
    locale: 'en',
    // Locale of the fallback defaultMessage
    defaultLocale: 'en',
    messages: {
      poopFormat: 'kaki',
      engDefault: 'somesome =)'
    },
  },
  cache
)

// Create the `intl` object
const heb = createIntl(
  {
    // Locale of the application
    locale: 'heb',
    // Locale of the fallback defaultMessage
    defaultLocale: 'heb',
    messages: hebMessages
  },
  cache
)

class IntlService {
  private intl: IntlShape;
  private defaultIntl: IntlShape;

  constructor({ intl, defaultIntl }: { intl: IntlShape, defaultIntl: IntlShape }) {
    this.intl = intl;
    this.defaultIntl = defaultIntl;
  }

  formatMessage: IntlShape['formatMessage'] = (descriptor, values?, opts?) => {
    return this.intl.formatMessage({
      defaultMessage: this.defaultIntl.formatMessage({ id: descriptor.id }),
      ...descriptor
    }, values, opts);
  }
}

class IntlSupportedService {
  private supportedIntls: Record<string, IntlService>;
  private defaultIntl: IntlShape;

  constructor({ supportedIntls, defaultIntl }: { supportedIntls: Record<string, IntlShape>, defaultIntl: IntlShape }) {
    this.supportedIntls = Object.keys(supportedIntls).reduce((supportedIntlServices: Record<string, IntlService>, key) => {
      supportedIntlServices[key] = new IntlService({
        defaultIntl,
        intl: supportedIntls[key]
      });
      return supportedIntlServices;
    }, {});
    this.defaultIntl = defaultIntl;
  }

  getIntl = (lang: string) => {
    if (this.supportedIntls[lang] === undefined)
      throw new Error(`IntlServiceError: language ${lang} is not supported`);

    return this.supportedIntls[lang];
  }
}

const intlSupported = new IntlSupportedService({
  supportedIntls: {
    heb,
    en
  },
  defaultIntl: en
})

const intl = intlSupported.getIntl('heb')

console.log(
  intl.formatMessage(
    {
      id: 'poopFormat',
    }
  ),
  intl.formatMessage(
    {
      id: 'engDefault'
    }
  )
)
