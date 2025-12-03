import { Setting } from 'obsidian';
import { LogLevel } from '@core-domain/ports/logger-port';
import type { SettingsViewContext } from '../context';

function logLevelToString(level: LogLevel): string {
  switch (level) {
    case LogLevel.debug:
      return 'debug';
    case LogLevel.info:
      return 'info';
    case LogLevel.warn:
      return 'warn';
    case LogLevel.error:
      return 'error';
    default:
      return 'warn';
  }
}

function stringToLogLevel(value: string): LogLevel {
  switch (value) {
    case 'debug':
      return LogLevel.debug;
    case 'info':
      return LogLevel.info;
    case 'error':
      return LogLevel.error;
    case 'warn':
    default:
      return LogLevel.warn;
  }
}

export function renderAdvancedSection(root: HTMLElement, ctx: SettingsViewContext): void {
  const { t, settings, logger } = ctx;
  const block = root.createDiv({ cls: 'ptpv-block' });
  const details = block.createEl('details', { cls: 'ptpv-advanced' });
  details.createEl('summary', {
    text: t.settings.advanced.title,
  });

  const inner = details.createDiv({ cls: 'ptpv-advanced__content' });

  new Setting(inner)
    .setName(t.settings.advanced.logLevelLabel)
    .setDesc(t.settings.advanced.logLevelDescription)
    .addDropdown((dropdown) => {
      dropdown
        .addOptions({
          debug: t.settings.advanced.logLevelDebug,
          info: t.settings.advanced.logLevelInfo,
          warn: t.settings.advanced.logLevelWarn,
          error: t.settings.advanced.logLevelError,
        })
        .setValue(logLevelToString(settings.logLevel))
        .onChange(async (value) => {
          const level = stringToLogLevel(value);
          logger.debug('Log level changed', { level });
          settings.logLevel = level;
          logger.level = level;
          await ctx.save();
        });
    });

  new Setting(inner)
    .setName(t.settings.advanced.calloutStylesLabel)
    .setDesc(t.settings.advanced.calloutStylesDescription)
    .addTextArea((text) => {
      text
        .setPlaceholder(t.settings.advanced.calloutStylesPlaceholder)
        .setValue(settings.calloutStylePaths.join('\n'))
        .onChange(async (value) => {
          const paths = value
            .split(/[\n,]/)
            .map((p) => p.trim())
            .filter(Boolean);
          settings.calloutStylePaths = paths;
          logger.debug('Callout style paths updated', { paths });
          await ctx.save();
        });

      text.inputEl.style.minHeight = '80px';
    });
}
