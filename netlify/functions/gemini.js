// Netlify Function to proxy Gemini API requests
export async function handler(event) {
  try {
    // Get API key from environment variable (set in Netlify dashboard)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key not configured on server" })
      };
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request body" })
      };
    }

    // Extract model and payload directly
    const { model, payload } = requestBody;
    
    if (!model || !payload) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters (model, payload)" })
      };
    }

    // Construct API URL with the provided model
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
    
    console.log('Making request to Gemini API with payload:', JSON.stringify(payload, null, 2));
    
    // Make request to Gemini API exactly as the client would
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // Return response from Gemini API
    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error processing request" })
    };
  }
}
