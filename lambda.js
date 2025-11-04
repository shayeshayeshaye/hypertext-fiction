// AWS Lambda Handler
// This replaces server.js for AWS deployment

const https = require('https');

exports.handler = async (event) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: ''
        };
    }

    try {
        // Parse request body
        const body = JSON.parse(event.body || '{}');
        const { prompt, systemPrompt } = body;

        // Your Claude API key (set this in Lambda environment variables)
        const apiKey = process.env.CLAUDE_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ error: 'API key not configured' })
            };
        }

        // Prepare Claude API request
        const requestData = JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            system: systemPrompt || '',
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        // Make request to Claude API
        const response = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.anthropic.com',
                path: '/v1/messages',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Length': Buffer.byteLength(requestData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        data: data
                    });
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(requestData);
            req.end();
        });

        if (response.statusCode !== 200) {
            throw new Error(`Claude API returned status ${response.statusCode}`);
        }

        const claudeResponse = JSON.parse(response.data);

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                text: claudeResponse.content[0].text
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};
