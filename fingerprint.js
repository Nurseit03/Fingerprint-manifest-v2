const captureBtn = document.getElementById("captureBtn");
const deviceSelect = document.getElementById("deviceSelect");

const BASE_URL = "http://localhost:8282";
const captureUrl = "/v1/scanner/capture";
const deviceUrl = "/v1/scanner/devices";

captureBtn.addEventListener("click", async () => {
  captureBtn.innerHTML = '<div class="loader"></div>';

  const selectedDevice = deviceSelect.value; 
  if (!selectedDevice) {
    console.error("Выберите устройство для сканирования");
    captureBtn.innerHTML = "Сканировать";
    return;
  }

  await sendRequest(BASE_URL + captureUrl).then((data) => {
    captureBtn.innerHTML = "Сканировать";
  });
});

async function loadDevices() {
  await sendRequest(BASE_URL + deviceUrl).then((data) => {
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

async function sendRequest(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
    return null;
  }
}