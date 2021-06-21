export const chunkArray = (array: object[], num: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += num) {
    result.push(array.slice(i, i + num));
  }
  return result;
}

export const extractIds = (array: object[]) => {
  
}
