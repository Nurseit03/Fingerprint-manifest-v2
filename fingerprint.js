const captureBtn = document.getElementById("captureBtn");
const deviceSelect = document.getElementById("deviceSelect");
const formatSelect = document.getElementById("formatSelect");

const BASE_URL = "http://localhost:8282";
const captureUrl = "/v2/scanner/capture";
const deviceUrl = "/v2/scanner/devices";

captureBtn.addEventListener("click", async () => {
  captureBtn.innerHTML = '<div class="loader"></div>';

  const selectedDevice = deviceSelect.value;
  if (!selectedDevice) {
    console.error("Выберите устройство для сканирования");
    captureBtn.innerHTML = "Сканировать";
    return;
  }

  const selectedFormat = formatSelect.value;
  if (!selectedFormat) {
    console.error("Выберите формат");
    captureBtn.innerHTML = "Сканировать";
    return;
  }

  const formatFid =
    selectedFormat === "iso" ? "ISO_19794_4_2005" : "ANSI_381_2004";
  const formatFmd =
    selectedFormat === "iso" ? "ISO_19794_2_2005" : "ANSI_378_2004";
  const deviceSeq = 0;

  const format = {
    formatFid,
    formatFmd,
    deviceSeq,
  };

  await sendRequest(BASE_URL + captureUrl, "POST", format).then((data) => {
    captureBtn.innerHTML = "Сканировать";
  });
});

async function loadDevices() {
  await sendRequest(BASE_URL + deviceUrl, "GET").then((data) => {
    deviceSelect.innerHTML = "";
    data.forEach((deviceData) => {
      const option = document.createElement("option");

      option.value = deviceData.description.serialNumber;
      option.textContent = deviceData.description.productName;

      deviceSelect.appendChild(option);
    });
  });
}

window.addEventListener("DOMContentLoaded", loadDevices);

async function sendRequest(url, method, body = null) {
  try {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await chrome.runtime.sendMessage({
      action: "proxyFetch",
      payload: { url, options }
    });

    if (response && response.success) {
      return response.data;
    } else {
      throw new Error(response.error || "Произошла неизвестная ошибка в фоновом скрипте.");
    }
  } catch (error) {
    console.error("Проблема во время выполнения запроса:", error);
    alert(`Ошибка: ${error.message}`);
    throw error;
  }
}
