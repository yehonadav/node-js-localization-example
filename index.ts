import {createIntl, createIntlCache, defineMessages, IntlShape, MessageDescriptor} from '@formatjs/intl'
import hebMessages from './heb.json';
import {MessageFormatElement} from "@formatjs/icu-messageformat-parser";
import {IntlConfig} from "@formatjs/intl/src/types";
import {FormatXMLElementFn, PrimitiveType} from "intl-messageformat";
import {Options as IntlMessageFormatOptions} from "intl-messageformat/src/core";

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

class IntlSupportService {
  private supportedIntls: Record<string, IntlShape>;
  private defaultIntl: IntlShape;

  constructor({ supportedIntls, defaultIntl }: { supportedIntls: Record<string, IntlShape>, defaultIntl: IntlShape }) {
    this.supportedIntls = supportedIntls;
    this.defaultIntl = defaultIntl;
  }

  getIntl = (lang: string) => {
    if (this.supportedIntls[lang] === undefined)
      throw new Error(`IntlServiceError: language ${lang} is not supported`);

    return new IntlService({
      intl: this.supportedIntls[lang],
      defaultIntl: this.defaultIntl
    });
  }
}

const intlSupport = new IntlSupportService({
  supportedIntls: {
    heb,
    en
  },
  defaultIntl: en
})

const intl = intlSupport.getIntl('heb')

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
