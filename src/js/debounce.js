export default function debounce(callback) {
  let timer;

  return (params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      callback(params);
    }, 200);
  };
}
