export function shortName(name: string) {
  const splittedName = name.split(' ')

  // capitalize slipttedName
    splittedName.forEach((part, index) => {
        splittedName[index] = part.charAt(0).toUpperCase() + part.slice(1)
    })

  if (splittedName.length === 1) return splittedName[0]
  const shortedName = splittedName[0] + ' ' + splittedName[splittedName.length - 1].charAt(0) + '.'
  return shortedName
}
