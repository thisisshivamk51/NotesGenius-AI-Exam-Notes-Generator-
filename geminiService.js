const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const generateNotes = async (content, metadata = {}) => {
  const model = getModel();
  const { class: userClass = '', subject = '', examType = '' } = metadata;

  const notesPrompt = `
You are an expert exam notes generator. Generate comprehensive, exam-oriented notes from the following content.

Context:
- Class/Level: ${userClass || 'General'}
- Subject: ${subject || 'General'}
- Exam Type: ${examType || 'Standard'}

Instructions:
1. Create well-structured notes with clear headings and subheadings
2. Include key definitions, important terms (bold them with **)
3. Use bullet points for clarity
4. Highlight important formulas, dates, or facts
5. Organize in a logical exam-ready format
6. Also identify 2-3 key concepts suitable for diagrams/charts and describe them

Return a JSON object with:
{
  "notes": "full markdown formatted notes here",
  "diagrams": [
    {
      "type": "flowchart|bar|pie|line|concept",
      "title": "diagram title",
      "description": "what this diagram shows",
      "data": { "labels": [], "values": [] }
    }
  ]
}

Content to process:
${content.substring(0, 8000)}
`;

  const result = await model.generateContent(notesPrompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {}

  return { notes: text, diagrams: [] };
};

const generateRevision = async (notesContent) => {
  const model = getModel();

  const prompt = `
Condense the following notes into ultra-short, bullet-only revision points.
Rules:
- Maximum 3-5 words per bullet point
- Include key formulas, dates, and definitions only
- No paragraphs, no explanations
- Group by topic with a short heading
- Perfect for last-minute revision

Notes:
${notesContent.substring(0, 6000)}

Return only the condensed revision points in markdown format.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

const generateQuestions = async (content, metadata = {}) => {
  const model = getModel();
  const { class: userClass = '', subject = '', examType = '' } = metadata;

  const prompt = `
Generate important exam questions from the following content.

Context:
- Class: ${userClass || 'General'}
- Subject: ${subject || 'General'}
- Exam Type: ${examType || 'Standard'}

Generate:
- 3 short-answer questions (with model answers)
- 3 long-answer questions (with model answers)
- 4 MCQs (with 4 options each, mark the correct one with index 0-3)

Return as JSON:
{
  "shortAnswer": [{"question": "...", "answer": "..."}],
  "longAnswer": [{"question": "...", "answer": "..."}],
  "mcq": [{"question": "...", "options": ["a", "b", "c", "d"], "correct": 0}]
}

Content:
${content.substring(0, 6000)}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {}

  return { shortAnswer: [], longAnswer: [], mcq: [] };
};

module.exports = { generateNotes, generateRevision, generateQuestions };
