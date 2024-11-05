import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Helper function to analyze code
export async function analyzeCode(code, problemStatement, language) {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      As a coding instructor, analyze this ${language} code submission for the following problem:
      
      Problem Statement:
      ${problemStatement}

      Submitted Code:
      ${code}

      Provide the response in the following JSON format:
      {
        "isCorrect": boolean,
        "score": number (0-100),
        "suggestions": array of strings with specific improvements,
        "optimalSolution": string with better implementation if needed
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    return JSON.parse(text);
  } catch (error) {
    if (error.message.includes('QUOTA_EXCEEDED')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message.includes('INVALID_ARGUMENT')) {
      throw new Error('Invalid input provided.');
    } else {
      throw new Error('Failed to analyze code. Please try again.');
    }
  }
} 