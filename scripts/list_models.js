const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
    console.error(".env.local not found");
    process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const match = content.match(/GOOGLE_GENERATIVE_AI_KEY=["']?([^"'\r\n]+)["']?/);
const key = match ? match[1] : null;

if (!key) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

console.log(`Checking models with key: ${key.substring(0, 5)}...`);

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            console.error("API Error:", data.error.message);
        } else if (data.models) {
            console.log("Available Gemini Models:");
            data.models.filter(m => m.name.includes('gemini')).forEach(m => {
                console.log(`- ${m.name}`);
            });
        } else {
            console.log("No models found or unexpected response:", data);
        }
    })
    .catch(err => console.error("Fetch error:", err));
