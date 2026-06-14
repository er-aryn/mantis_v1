const { v4: uuidv4 } = require('uuid');
const { loadPlaybook } = require('./playbook');

function normalizeText(input) {
  return String(input || '').toLowerCase().trim();
}

function yesNoFromAnswer(answerText) {
  const text = normalizeText(answerText);
  const yesWords = ['yes', 'y', 'haan', 'ha', 'works', 'working', 'on', 'normal'];
  const noWords = ['no', 'n', 'nah', 'not', 'off', 'dead', 'silent'];

  if (yesWords.some((word) => text.includes(word))) {
    return 'yes';
  }

  if (noWords.some((word) => text.includes(word))) {
    return 'no';
  }

  return 'unknown';
}

function createSession({ issueId, product, issueText }) {
  const playbook = loadPlaybook(product.category);
  const firstQuestion = (playbook.questions || [])[0] || null;

  return {
    id: uuidv4(),
    issueId,
    productId: product.id,
    productCategory: product.category,
    issueText,
    playbook,
    askedQuestionIds: firstQuestion ? [firstQuestion.id] : [],
    answers: [],
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: firstQuestion ? 'investigating' : 'resolved'
  };
}

function scoreCauses(playbook, answers) {
  const causes = playbook.causes || [];
  return causes.map((cause) => {
    let score = 0;

    for (const answer of answers) {
      const signal = cause.signals && cause.signals[answer.questionId];
      if (!signal) {
        continue;
      }

      const polarity = yesNoFromAnswer(answer.answerText);
      if (signal[polarity] !== undefined) {
        score += Number(signal[polarity]) || 0;
      }

      if (Array.isArray(signal.keywords)) {
        const text = normalizeText(answer.answerText);
        for (const keyword of signal.keywords) {
          if (text.includes(normalizeText(keyword))) {
            score += 1;
          }
        }
      }
    }

    return {
      ...cause,
      score
    };
  }).sort((a, b) => b.score - a.score);
}

function pickNextQuestion(session) {
  const questions = session.playbook.questions || [];
  const askedSet = new Set(session.askedQuestionIds || []);
  return questions.find((q) => !askedSet.has(q.id)) || null;
}

function buildFinalGuidance(session) {
  const ranked = scoreCauses(session.playbook, session.answers);
  const topCauses = ranked.slice(0, 2);

  return {
    status: 'resolved',
    topCauses: topCauses.map((cause) => ({
      id: cause.id,
      title: cause.title,
      confidence: Math.max(0, Math.min(100, 50 + cause.score * 10))
    })),
    recommendedActions: topCauses.flatMap((cause) => (cause.actions || []).map((action) => ({
      action,
      reference: cause.reference || 'Official manual'
    })))
  };
}

function handleUserAnswer(session, answerText) {
  const lastQuestionId = session.askedQuestionIds[session.askedQuestionIds.length - 1];
  if (lastQuestionId) {
    session.answers.push({
      questionId: lastQuestionId,
      answerText,
      answeredAt: new Date().toISOString()
    });
  }

  const rankedCauses = scoreCauses(session.playbook, session.answers);
  const strongLead = rankedCauses[0] && rankedCauses[0].score >= 3;
  const enoughQuestions = session.answers.length >= 4;

  if (strongLead || enoughQuestions) {
    session.status = 'resolved';
    session.updatedAt = new Date().toISOString();
    return {
      type: 'diagnosis',
      ...buildFinalGuidance(session)
    };
  }

  const nextQuestion = pickNextQuestion(session);
  if (!nextQuestion) {
    session.status = 'resolved';
    session.updatedAt = new Date().toISOString();
    return {
      type: 'diagnosis',
      ...buildFinalGuidance(session)
    };
  }

  session.askedQuestionIds.push(nextQuestion.id);
  session.updatedAt = new Date().toISOString();

  return {
    type: 'question',
    question: nextQuestion.prompt,
    hint: nextQuestion.hint || ''
  };
}

module.exports = {
  createSession,
  handleUserAnswer
};
