/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI("AIzaSyDPGPB9J52riyr-WlRq02WLkwUSAPzsGK0");


// Helper function to analyze code
// export async function analyzeCode(code, problemStatement, language) {
//   try {
//     // Get the model
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const prompt = `
//       As a coding instructor, analyze this ${language} code submission for the following problem:
      
//       Problem Statement:
//       ${problemStatement}

//       Submitted Code:
//       ${code}

//       Provide the response in the following JSON format:
//       {
//         "isCorrect": boolean,
//         "score": number (0-100),
//         "suggestions": array of strings with specific improvements,
//         "optimalSolution": string with better implementation if needed
//       }
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     // Parse the JSON response
//     return JSON.parse(text);
//   } catch (error) {
//     if (error.message.includes('QUOTA_EXCEEDED')) {
//       throw new Error('API quota exceeded. Please try again later.');
//     } else if (error.message.includes('INVALID_ARGUMENT')) {
//       throw new Error('Invalid input provided.');
//     } else {
//       throw new Error('Failed to analyze code. Please try again.');
//     }
//   }
// } 

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
    console.log("Sending prompt to Gemini:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log("Raw response from Gemini:", text);
    const cleanedResponse = text.replace(/```/g, '').trim();
    try {
      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Validate the response structure
      if (!parsedResponse.hasOwnProperty('isCorrect') || 
      !parsedResponse.hasOwnProperty('score') || 
      !parsedResponse.hasOwnProperty('suggestions') ||
      !parsedResponse.hasOwnProperty('optimalSolution')) {
    throw new Error('Invalid response structure');
  }
  
  return {
    isCorrect: Boolean(parsedResponse.isCorrect),
    score: Number(parsedResponse.score),
    suggestions: Array.isArray(parsedResponse.suggestions) 
      ? parsedResponse.suggestions 
      : [],
    optimalSolution: String(parsedResponse.optimalSolution).trim()
  };
  
} catch (parseError) {
  console.error("Parse error:", parseError);
  throw new Error('Failed to parse API response');
}

} catch (error) {
console.error("Analysis error:", error);
if (error.message.includes('QUOTA_EXCEEDED')) {
  throw new Error('API quota exceeded. Please try again later.');
} else if (error.message.includes('INVALID_ARGUMENT')) {
  throw new Error('Invalid input provided.');
} else {
  throw new Error(`Failed to analyze code: ${error.message}`);
}
}
}