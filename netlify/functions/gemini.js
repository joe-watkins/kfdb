// Netlify Function to proxy Gemini API requests
export async function handler(event) {
  try {
    // Get API key from environment variable (set in Netlify dashboard)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("API key not configured on server");
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
      console.error("Invalid JSON in request body:", e.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request body" })
      };
    }

    // Extract model and payload directly
    const { model, payload } = requestBody;
    
    if (!model || !payload) {
      console.error("Missing required parameters:", { model: !!model, payload: !!payload });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters (model, payload)" })
      };
    }

    // Construct API URL with the provided model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    // Make request to the Gemini API
    
    // Payload is valid, proceed with the request
    
    // Make request to Gemini API exactly as the client would
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: `Gemini API returned error: ${response.status}`,
          details: errorText
        })
      };
    }

    const data = await response.json();
    
    // Return response from Gemini API
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Error processing request",
        message: error.message 
      })
    };
  }
}
