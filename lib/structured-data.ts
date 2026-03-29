import { SITE_URL } from './constants'

export const AUTHOR = {
  '@type': 'Person',
  name: 'Cristian Llanos',
  url: SITE_URL,
} as const

export function breadcrumbList(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}
