export default function createDisjointArrays(firstArray, secondArray) {
  let overlap = firstArray.filter(n => {
    return secondArray.indexOf(n) !== -1;
  });
  let disjointFirstArray = firstArray.filter(n => {
    return overlap.indexOf(n) === -1;
  });
  let disjointSecondArray = secondArray.filter(n => {
    return overlap.indexOf(n) === -1;
  });

  let returnObj = {
    disjointFirstArray: disjointFirstArray,
    disjointSecondArray: disjointSecondArray,
    overlap: overlap
  };

  return returnObj;
}
