// worker.js
self.onmessage = function(event) {
  const { url, payload } = event.data;
  
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Request complete:", data);
  })
  .catch(error => {
    console.error("Error:", error);
  });
};
