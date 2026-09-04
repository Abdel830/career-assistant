import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from one level up (server/.env)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const apiKey = process.env.GEMINI_API_KEY;
console.log('Gemini API Key loaded (first 5 chars):', apiKey ? apiKey.substring(0, 5) + '...' : 'undefined');

if (!apiKey) {
  console.error('API key is missing!');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function test() {
  try {
    console.log('Calling generateContent...');
    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Hello, respond with: "Gemini connection is working!"',
    });
    console.log('Success! Response from Gemini:', result.text);
  } catch (error) {
    console.error('Error during API call:', error);
  }
}

test();
