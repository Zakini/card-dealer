export const cardMap = import.meta.glob<string>(
  '../assets/cards/default/*.svg',
  { eager: true, import: 'default' },
)
