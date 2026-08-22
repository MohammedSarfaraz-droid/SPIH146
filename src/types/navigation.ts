export type FlowStep = 1 | 2 | 3;

export interface NavLinkItem {
  label: string;
  href: string;
  anchor?: string;
}

export interface TrustPointItem {
  title: string;
  text: string;
}

export interface HowItWorksStepItem {
  n: string;
  title: string;
  text: string;
}
