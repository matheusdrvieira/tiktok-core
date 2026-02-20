export type GenerateQuizInput = {
  niche: string;
  reference: string;
  questionsCount: number;
};

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  answer: {
    correctOptionId: string;
  };
};

export type GenerateQuizOutput = {
  title: string;
  questions: QuizQuestion[];
};

export type NarratedQuizQuestion = QuizQuestion & {
  questionPath: string;
  answerCorrectPath: string;
};

export interface GenerateQuizNarrationInput {
  title: string;
  questions: QuizQuestion[];
}

export interface GenerateQuizNarrationOutput {
  title: string;
  questions: NarratedQuizQuestion[];
}

export interface GenerateNarrationInput {
  id?: string;
  text: string;
}

export interface GenerateNarrationOutput {
  audioBuffer: Buffer;
}
