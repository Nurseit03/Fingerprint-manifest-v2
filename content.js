const BASE_URL = "http://localhost:8282";

async function handleMessage(event) {
  if (event.source !== window || !event.data || event.data.source !== 'DIGITALPERSONA_FRONTEND') {
    return;
  }

  const { action, payload, requestId } = event.data;
  let responseData = null;
  let error = null;

  try {
    switch (action) {
      case 'loadDevices': {
        const DEVICE_URL = "/v2/scanner/devices";
        responseData = await sendRequest(BASE_URL + DEVICE_URL, "GET");
        break;
      }
      case 'capture': {
        const CAPTURE_URL = "/v2/scanner/capture";
        responseData = await sendRequest(BASE_URL + CAPTURE_URL, "POST", payload);
        break;
      }
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (e) {
    console.error(`[DigitalPersona Extension] Error executing action '${action}':`, e);
    error = e.message;
  }

  window.postMessage({
    source: 'DIGITALPERSONA_EXTENSION',
    requestId: requestId,
    data: responseData,
    error: error,
  }, event.origin);
}

window.addEventListener('message', handleMessage, false);

async function sendRequest(url, method, body = null) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Network response was not ok. Status: ${response.status}. Body: ${errorText}`);
  }
  return await response.json();
}