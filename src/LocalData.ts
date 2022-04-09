export function getCustomCountdowns() {
  if (typeof window != "undefined") {
    const dataStr = localStorage.getItem("znepb-countdowns-custom");
    if (dataStr) {
      const data = JSON.parse(dataStr);

      if (data) {
        return data;
      }
    }
  }

  return [];
}
