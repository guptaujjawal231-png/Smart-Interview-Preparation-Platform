import { evaluateWithMock } from './mockAiService.js';

/**
 * Unified AI Evaluation Service
 * Communicates with Google Gemini API when configured,
 * and gracefully falls back to the intelligent mock evaluator if offline or if no API key is set.
 */
export const evaluateAnswer = async (question, userAnswer) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback if no real API key is configured
  if (!apiKey || apiKey === 'mock' || apiKey.trim() === '') {
    return evaluateWithMock(question, userAnswer);
  }

  // Answer is empty or blank
  if (!userAnswer || userAnswer.trim().length === 0) {
    return evaluateWithMock(question, userAnswer);
  }

  try {
    const prompt = `
You are an expert senior technical interviewer for campus placements evaluating a candidate's answer.

Role: ${question.role}
Topic: ${question.topic}
Question: "${question.questionText}"
Key Concepts Expected: ${JSON.stringify(question.keyConcepts || [])}
Model Answer Reference: "${question.sampleAnswer || ''}"

Candidate's Submitted Answer:
"""
${userAnswer}
"""

Evaluate the candidate's answer objectively based on:
1. Technical correctness (0 to 100%)
2. Concept coverage (which expected key concepts were covered, and which were missed)
3. Clarity of explanation (0 to 10)
4. Overall rubric score (0.0 to 10.0)

You MUST respond strictly with valid JSON conforming to this exact schema (no markdown fences, no extra text):
{
  "score": 7.5,
  "technicalCorrectness": 75,
  "clarity": 8.0,
  "feedback": "Concise paragraph explaining how the candidate performed and what was missing.",
  "missingConcepts": ["concept1", "concept2"],
  "strengths": ["point1", "point2"],
  "suggestedImprovements": ["improvement1", "improvement2"],
  "modelAnswer": "${question.sampleAnswer || ''}"
}
`;

    // Direct HTTP request to Google Gemini REST API (10s timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Falling back to mock evaluator.`);
      return evaluateWithMock(question, userAnswer);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return evaluateWithMock(question, userAnswer);
    }

    // Parse JSON
    const parsed = JSON.parse(rawText.trim());

    // Defensive schema validation
    return {
      score: typeof parsed.score === 'number' ? Math.min(10, Math.max(0, parsed.score)) : 7.0,
      technicalCorrectness:
        typeof parsed.technicalCorrectness === 'number'
          ? Math.min(100, Math.max(0, parsed.technicalCorrectness))
          : 70,
      clarity: typeof parsed.clarity === 'number' ? Math.min(10, Math.max(0, parsed.clarity)) : 7.0,
      feedback: parsed.feedback || 'Good attempt covering core principles.',
      missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Solid foundational attempt'],
      suggestedImprovements: Array.isArray(parsed.suggestedImprovements)
        ? parsed.suggestedImprovements
        : ['Review core concepts'],
      modelAnswer: question.sampleAnswer || parsed.modelAnswer || '',
      evaluatedAt: new Date(),
    };
  } catch (error) {
    console.warn(`AI Evaluation API encountered error (${error.message}). Using fallback evaluator.`);
    return evaluateWithMock(question, userAnswer);
  }
};
