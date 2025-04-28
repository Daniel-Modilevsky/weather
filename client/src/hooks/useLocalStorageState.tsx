export function useLocalStorageState() {
  function getLocal(key: string) {
    return localStorage.getItem(key);
  }
  function setLocal(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  return { getLocal, setLocal };
}
