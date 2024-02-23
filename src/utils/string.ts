export function shortName(name: string) {
  const splittedName = name.split(' ')
  const shortedName = splittedName[0] + ' ' + splittedName[splittedName.length - 1].charAt(0) + '.'
  return shortedName
}
