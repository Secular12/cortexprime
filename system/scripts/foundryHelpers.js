export const localizer = target => game.i18n.localize(target)

export const arrayMove = (arr, fromIndex, toIndex) => {
  const newArray = [...arr]

  const element = newArray[fromIndex];
  newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, element);

  return newArray
}

export const sort = (arr, callback) => {
  const a = [...arr].map((value, key) => ({ key, value }))

  a.sort(callback)

  return a.map(({ value }) => value)
}

export const uuid = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => {
    return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  })
}
