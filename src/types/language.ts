/**
 * Supported language codes and metadata models.
 */

export type Lang = "en" | "hi";

export interface LangDetails {
  native: string;
  english: string;
  short: string;
}

export type LangMetaMap = Record<Lang, LangDetails>;

export interface BiText {
  en: string;
  hi: string;
}
