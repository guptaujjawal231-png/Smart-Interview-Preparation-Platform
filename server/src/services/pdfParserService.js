import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');

// Comprehensive technical skill taxonomy across SDE, Data, and ECE domains
const SKILL_TAXONOMY = [
  // Software Development
  'javascript', 'typescript', 'react', 'node.js', 'express', 'python', 'c++', 'java',
  'dsa', 'data structures', 'algorithms', 'sql', 'mongodb', 'postgresql', 'git', 'github',
  'docker', 'rest api', 'oop', 'object-oriented programming', 'operating systems',
  'computer networks', 'html', 'css', 'tailwind', 'linux', 'microservices', 'redux',
  'system design', 'redis', 'graphql', 'ci/cd',

  // Data Analytics
  'pandas', 'numpy', 'excel', 'tableau', 'powerbi', 'statistics', 'data visualization',
  'machine learning', 'r', 'a/b testing', 'etl', 'data cleaning', 'data warehousing',
  'bigquery', 'matplotlib', 'seaborn', 'scikit-learn', 'probability', 'regression',
  'hypothesis testing',

  // ECE / Core Electronics
  'digital electronics', 'analog electronics', 'embedded c', 'microcontrollers',
  'arm cortex', '8051', 'stm32', 'arduino', 'vlsi', 'verilog', 'vhdl', 'fpga',
  'pcb design', 'matlab', 'simulink', 'i2c', 'spi', 'uart', 'can', 'rtos',
  'kicad', 'cadence', 'semiconductor', 'signal processing', 'op-amp', 'cmos',
  'setup time', 'hold time', 'timers', 'interrupts'
];

/**
 * Extract raw text from uploaded PDF buffer
 */
export const extractPdfText = async (pdfBuffer) => {
  try {
    // Support both pdf-parse class interface (v2+) and traditional function interface
    if (pdfModule.PDFParse) {
      const parser = new pdfModule.PDFParse({ data: pdfBuffer });
      const res = await parser.getText();
      await parser.destroy();
      return res.text || '';
    } else if (typeof pdfModule === 'function') {
      const data = await pdfModule(pdfBuffer);
      return data.text || '';
    } else {
      // Fallback: extract readable strings from buffer
      return pdfBuffer.toString('utf-8');
    }
  } catch (error) {
    console.warn('pdfParse error, attempting string fallback:', error.message);
    const fallbackText = pdfBuffer.toString('utf-8');
    if (fallbackText && fallbackText.length > 50) {
      return fallbackText;
    }
    throw new Error('Failed to parse PDF content. Please verify that the PDF is readable and not password-protected.');
  }
};

/**
 * Analyze Resume Text against Target Job Description
 */
export const analyzeResumeAndJD = (resumeText, jdText) => {
  const normalizedResume = (resumeText || '').toLowerCase();
  const normalizedJD = (jdText || '').toLowerCase();

  // Find skills in Resume
  const resumeSkills = SKILL_TAXONOMY.filter((skill) =>
    normalizedResume.includes(skill)
  );

  // Find skills mentioned in Job Description
  let jdSkills = SKILL_TAXONOMY.filter((skill) =>
    normalizedJD.includes(skill)
  );

  // Fallback: If JD text is very short or doesn't mention specific tech keywords,
  // evaluate general placement preparedness against candidate's detected skills
  if (jdSkills.length === 0) {
    jdSkills = resumeSkills.slice(0, 6);
  }

  // Calculate Matches & Gaps
  const matchedSkills = jdSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );

  const missingSkills = jdSkills.filter((skill) =>
    !resumeSkills.includes(skill)
  );

  // Compute Match Score Percentage (0 to 100)
  const matchScore = jdSkills.length > 0
    ? Math.min(100, Math.round((matchedSkills.length / jdSkills.length) * 100))
    : 70;

  // Capitalize skills for clean presentation
  const formatSkill = (s) =>
    s
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  // Generate Actionable Placement Resume Tips
  const recommendations = [];

  if (missingSkills.length > 0) {
    recommendations.push(
      `Incorporate target keywords: The job description explicitly emphasizes ${missingSkills
        .slice(0, 3)
        .map(formatSkill)
        .join(', ')}. Add relevant academic projects or coursework highlighting these tools.`
    );
  }

  recommendations.push(
    'Quantify project achievements using numbers (e.g. "Reduced processing latency by 35%" or "Optimized SQL query execution time from 2.4s to 0.3s").'
  );

  recommendations.push(
    'Use active engineering action verbs at the start of bullet points: "Architected", "Engineered", "Designed", "Implemented", "Debugged".'
  );

  // Suggest Question Bank Topics to Revise
  const suggestedTopics = [];
  if (missingSkills.some((s) => ['dsa', 'data structures', 'algorithms'].includes(s))) {
    suggestedTopics.push('Data Structures & Algorithms');
  }
  if (missingSkills.some((s) => ['sql', 'mongodb', 'postgresql', 'database'].includes(s))) {
    suggestedTopics.push('DBMS & SQL');
  }
  if (missingSkills.some((s) => ['operating systems', 'linux'].includes(s))) {
    suggestedTopics.push('Operating Systems');
  }
  if (missingSkills.some((s) => ['embedded c', 'c', 'microcontrollers', 'arm cortex'].includes(s))) {
    suggestedTopics.push('Embedded C & Microcontrollers');
  }
  if (missingSkills.some((s) => ['digital electronics', 'verilog', 'vhdl', 'vlsi'].includes(s))) {
    suggestedTopics.push('Digital Electronics & VLSI');
  }
  if (missingSkills.some((s) => ['pandas', 'numpy', 'statistics', 'excel'].includes(s))) {
    suggestedTopics.push('Python & Statistics');
  }

  if (suggestedTopics.length === 0) {
    suggestedTopics.push('Core Computer Science / Electronics Fundamentals');
  }

  return {
    matchScore,
    matchedSkills: matchedSkills.map(formatSkill),
    missingSkills: missingSkills.map(formatSkill),
    allResumeSkills: resumeSkills.map(formatSkill),
    recommendations,
    suggestedTopics,
    wordCount: resumeText.split(/\s+/).length,
  };
};
