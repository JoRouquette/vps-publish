import { type PublishPluginSettings } from '@core-domain/entities';

import { defaultIgnoreRules } from './default-ignore-rules.constant';

export const defaultSettings: PublishPluginSettings & {
  locale?: 'en' | 'fr' | 'system';
} = {
  vpsConfigs: [],
  locale: 'system',
};
