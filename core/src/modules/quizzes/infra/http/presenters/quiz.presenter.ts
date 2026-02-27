import { Quiz } from '../../../domain/entities/quizzes.entity';

export class QuizPresenter {
  static toHttp(quiz: Quiz) {
    return {
      id: quiz.id,
      userId: quiz.userId,
      videos: quiz.videos.map((video) => ({
        id: video.id,
        userId: video.userId,
        title: video.title,
        hashtags: video.hashtags,
        description: video.description,
        category: video.category,
        url: video.url,
        size: video.size,
        duration: video.duration,
        status: video.status,
        quizId: video.quizId,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      })),
      questions: quiz.questions.map((question) => ({
        id: question.id,
        question: question.question,
        correctAnswerIndex: question.correctAnswerIndex,
        questionPath: question.questionPath,
        answerCorrectPath: question.answerCorrectPath,
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
          createdAt: option.createdAt,
          updatedAt: option.updatedAt,
        })),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      })),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }
}
