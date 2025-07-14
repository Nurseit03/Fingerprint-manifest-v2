chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "proxyFetch") {
    const { url, options } = request.payload;

    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Ошибка сети: ${response.status}. Ответ сервера: ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        sendResponse({ success: true, data: data });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }
});