export interface NavLink {
  label: string;
  href: string;
  badge?: string;
}

export const MAIN_NAV_LINKS: NavLink[] = [
  { label: 'Create', href: '#create' },
  { label: 'Templates', href: '#templates' },
  { label: 'GIF Maker', href: '#gif-maker' },
  { label: 'AI Tools', href: '#ai-tools' },
  { label: 'Explore', href: '#explore' },
];

export const FOOTER_PRODUCT_LINKS = [
  { label: 'Meme Generator', href: '#create' },
  { label: 'GIF Maker', href: '#gif-maker' },
  { label: 'AI Tools', href: '#ai-tools' },
  { label: 'Templates', href: '#templates' },
  { label: 'Explore', href: '#explore' },
];

export const FOOTER_COMPANY_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Blog', href: '#blog' },
  { label: 'Careers', href: '#careers' },
  { label: 'Press', href: '#press' },
  { label: 'Contact', href: '#contact' },
];

export const FOOTER_RESOURCES_LINKS = [
  { label: 'Help Center', href: '#help' },
  { label: 'Community', href: '#explore' },
  { label: 'Guidelines', href: '#guidelines' },
  { label: 'Terms of Service', href: '#terms' },
  { label: 'Privacy Policy', href: '#privacy' },
];
