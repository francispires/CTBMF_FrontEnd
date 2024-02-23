export function shortName(name: string) {
  const shortedName = name.split(' ')[0] + ' ' + name.split(' ')[1].charAt(0) + '.'
  return shortedName
}