import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Αρχική',
      href: getPermalink('/'),
    },
    {
      text: 'Τομείς',
      href: getPermalink('/sectors'),
    },
    {
      text: 'Σχετικά',
      href: getPermalink('/about'),
    },
    {
      text: 'Επικοινωνία',
      href: getPermalink('/contact'),
    },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: 'Εταιρία',
      links: [
        { text: 'Αρχική', href: getPermalink('/') },
        { text: 'Τομείς Δραστηριότητας', href: getPermalink('/sectors') },
        { text: 'Σχετικά', href: getPermalink('/about') },
        { text: 'Επικοινωνία', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Νομικά',
      links: [
        { text: 'Πολιτική Απορρήτου', href: getPermalink('/privacy') },
        { text: 'Όροι Χρήσης', href: getPermalink('/terms') },
        { text: 'Πολιτική Cookies', href: getPermalink('/cookies') },
        { text: 'Στοιχεία Εταιρίας', href: getPermalink('/company-info') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Πολιτική Απορρήτου', href: getPermalink('/privacy') },
    { text: 'Όροι Χρήσης', href: getPermalink('/terms') },
  ],
  socialLinks: [],
  footNote: `<a href="/company-info" class="hover:underline hover:text-primary transition-colors">QBEE Ι.Κ.Ε.</a> &nbsp;·&nbsp; ΑΦΜ: 803382970 &nbsp;·&nbsp; ΓΕΜΗ: 195732204000`,
};
