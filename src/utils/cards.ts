export const cardMap = import.meta.glob<string>(
  '../assets/cards/default/faces/*.svg',
  { eager: true, import: 'default' },
)
