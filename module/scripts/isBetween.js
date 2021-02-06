export default (val, min, max, exclusive = false) => {
  return exclusive
    ? val > min && val < max
    : val >= min && val <= max
}