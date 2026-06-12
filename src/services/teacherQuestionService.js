import api from '@/services/api'

const optionKeyMap = {
  option_1: 'option_a',
  option_2: 'option_b',
  option_3: 'option_c',
  option_4: 'option_d'
}

const normalizeCorrectAnswer = (payload) => {
  if (optionKeyMap[payload.correct_answer]) return optionKeyMap[payload.correct_answer]

  const matchedOption = Object.keys(optionKeyMap).find((key) => payload.correct_answer && payload.correct_answer === payload[key])
  return matchedOption ? optionKeyMap[matchedOption] : payload.correct_answer
}

const questionPayload = (payload) => ({
  question: payload.question,
  option_a: payload.option_a ?? payload.option_1,
  option_b: payload.option_b ?? payload.option_2,
  option_c: payload.option_c ?? payload.option_3,
  option_d: payload.option_d ?? payload.option_4,
  correct_answer: normalizeCorrectAnswer(payload)
})

export const teacherQuestionService = {
  getQuestions: (quizId) => api.get(`/teacher/quizzes/${quizId}/questions`),
  createQuestion: (quizId, payload) => api.post(`/teacher/quizzes/${quizId}/questions`, questionPayload(payload)),
  updateQuestion: (id, payload) => api.put(`/teacher/questions/${id}`, questionPayload(payload)),
  deleteQuestion: (id) => api.delete(`/teacher/questions/${id}`)
}
