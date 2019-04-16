import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 10
// 往数组当中存入一条数据
function insertArray(arr, value, compare, len) {
  let index = arr.findIndex(compare)
  if (index === 0) {
    return arr
  }
  if (index > -1) {
    arr.splice(index, 1)
  }
  arr = [value, ...arr]
  if (arr.length > len) {
    arr.pop()
  }
  return arr
}
// 删除一条数组当中的数据
function deleteArray(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}
// 根据key获取localStorage
function getArray(key) {
  return storage.get(key, [])
}
// 获取搜索记录
export const searchHistoryList = getArray(SEARCH_KEY)
// 存入一条搜索记录
export function saveSearchHistory(value) {
  let searchHistoryList = storage.get(SEARCH_KEY, [])
  let newSarchList = insertArray(searchHistoryList, value, item => item === value, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, newSarchList)
  return newSarchList
}
// 删除一条搜索记录
export function deleteSearchHistory(value) {
  let searchHistoryList = storage.get(SEARCH_KEY, [])
  let newSearchList = deleteArray(searchHistoryList, item => item === value)
  storage.set(SEARCH_KEY, newSearchList)
  return newSearchList
}
// 清空整个搜索记录
export function clearSearchHistory() {
  storage.remove(SEARCH_KEY)
  return []
}