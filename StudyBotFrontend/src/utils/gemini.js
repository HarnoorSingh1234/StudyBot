/* eslint-disable no-prototype-builtins */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.REACT_APP_GEMINI_API_KEY);

export async function analyzeCode(code, problemStatement, language) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      As a coding instructor, analyze this ${language} code submission for the following problem:
      
      Problem Statement:
      ${problemStatement}

      Submitted Code:
      ${code}

      Provide the response in the following JSON format, ensuring that at least one suggestion for improvement is always included, even if the code is correct:
      {
        "isCorrect": boolean,
        "score": number (0-100),
        "suggestions": array of strings with specific improvements or positive feedback if no improvements are necessary,
        "optimalSolution": string with a better implementation if needed
      }

      Make sure "suggestions" is never empty. If the code is correct and well-written, provide positive feedback or optional best practices.
    `;
    
    console.log("Sending prompt to Gemini:", prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log("Raw response from Gemini:", text);

    // Clean the response and parse JSON
    const cleanedResponse = text.replace(/```/g, '').trim();
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
      
      // Check for required properties in the parsed response
      if (!parsedResponse.hasOwnProperty('isCorrect') || 
          !parsedResponse.hasOwnProperty('score') || 
          !parsedResponse.hasOwnProperty('suggestions') ||
          !parsedResponse.hasOwnProperty('optimalSolution')) {
        throw new Error('Invalid response structure');
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      throw new Error('Failed to parse API response');
    }

    // Return the structured response
    return {
      isCorrect: Boolean(parsedResponse.isCorrect),
      score: Number(parsedResponse.score),
      suggestions: Array.isArray(parsedResponse.suggestions) 
        ? parsedResponse.suggestions 
        : ["Consider adding comments to explain your code."], // Default suggestion if parsing fails
      optimalSolution: String(parsedResponse.optimalSolution).trim()
    };

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
