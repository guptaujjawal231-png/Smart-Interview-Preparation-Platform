/**
 * Intelligent Mock Evaluation Engine
 * Evaluates technical answers objectively against question key concepts,
 * word count, and coverage without requiring an external internet connection or paid API key.
 */
export const evaluateWithMock = (question, userAnswer) => {
  const answer = (userAnswer || '').trim();

  // If answer is empty or too short (< 5 words)
  if (!answer || answer.split(/\s+/).length < 5) {
    return {
      score: 1.0,
      technicalCorrectness: 10,
      clarity: 2.0,
      feedback:
        'The answer provided was either too brief or incomplete. In a technical placement interview, you should explain the core definition, operational mechanism, and real-world practical use case.',
      missingConcepts: question.keyConcepts || ['Core Definition', 'Practical Example'],
      strengths: ['Attempted the question'],
      suggestedImprovements: [
        'Elaborate on the underlying technical mechanism.',
        'Include industry-standard terminology and syntax examples.',
        'Address trade-offs and edge cases.',
      ],
      modelAnswer: question.sampleAnswer || question.explanation || '',
      evaluatedAt: new Date(),
    };
  }

  const lowerAnswer = answer.toLowerCase();
  const keyConcepts = question.keyConcepts || [];

  // Match key concepts in user answer
  const matchedConcepts = [];
  const missingConcepts = [];

  keyConcepts.forEach((concept) => {
    // Check if concept or individual significant words in concept appear in answer
    const lowerConcept = concept.toLowerCase();
    const words = lowerConcept.split(/[\s,()/-]+/).filter((w) => w.length > 3);

    const isMatched =
      lowerAnswer.includes(lowerConcept) ||
      words.some((word) => lowerAnswer.includes(word));

    if (isMatched) {
      matchedConcepts.push(concept);
    } else {
      missingConcepts.push(concept);
    }
  });

  // Calculate concept coverage percentage
  const conceptRatio =
    keyConcepts.length > 0 ? matchedConcepts.length / keyConcepts.length : 0.5;

  // Word count factor (ideal answer: 50 - 200 words)
  const wordCount = answer.split(/\s+/).length;
  const lengthFactor = Math.min(1.0, wordCount / 60);

  // Compute metrics
  const correctness = Math.min(
    95,
    Math.max(25, Math.round(conceptRatio * 70 + lengthFactor * 25))
  );

  const clarityScore = Math.min(
    9.5,
    Math.max(3.5, Math.round((lengthFactor * 4 + conceptRatio * 5.5) * 10) / 10)
  );

  const finalScore = Math.min(
    9.6,
    Math.max(2.5, Math.round((correctness / 10) * 10) / 10)
  );

  // Build feedback
  let feedback = '';
  if (finalScore >= 8.0) {
    feedback = `Strong technical answer! You clearly demonstrated understanding of ${question.topic}. You successfully covered key concepts like ${matchedConcepts.slice(0, 3).join(', ')}.`;
  } else if (finalScore >= 6.0) {
    feedback = `Solid answer covering the basics of ${question.topic}. To achieve top-bracket marks in campus technical rounds, make sure to explicitly discuss ${missingConcepts.slice(0, 2).join(' and ')}.`;
  } else {
    feedback = `Your answer touches upon the question but lacks technical depth for ${question.topic}. Focus on structuring your answer around core terminology such as ${missingConcepts.slice(0, 3).join(', ')}.`;
  }

  const strengths =
    matchedConcepts.length > 0
      ? matchedConcepts.map((c) => `Demonstrated understanding of: ${c}`)
      : ['Clear explanation attempt', 'Structured response format'];

  const suggestedImprovements =
    missingConcepts.length > 0
      ? missingConcepts.map((c) => `Elaborate on concept: ${c}`)
      : ['Add a brief real-world system design example', 'Mention performance complexity'];

  return {
    score: finalScore,
    technicalCorrectness: correctness,
    clarity: clarityScore,
    feedback,
    missingConcepts,
    strengths,
    suggestedImprovements,
    modelAnswer: question.sampleAnswer || question.explanation || '',
    evaluatedAt: new Date(),
  };
};
