export interface Localization {
  localize: (localeString: string) => string;
  locale: {
    language: string;
  };
}
