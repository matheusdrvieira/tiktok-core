import { Video } from "../../../videos/domain/entities/videos.entity";
import { RemotionTemplateId } from '../constants/remotion-template.constants';

export type RenderQuizQuestionOption = {
  id: string;
  text: string;
};

export type RenderQuizQuestion = {
  id: string;
  question: string;
  options: RenderQuizQuestionOption[];
  answer: {
    correctAnswerIndex: number;
  };
  questionPath: string;
  answerCorrectPath: string;
};

export type RenderVideoRequest = {
  userId: string;
  videoId: string;
  questions: RenderQuizQuestion[];
  templateId?: RemotionTemplateId;
};

export type RenderVideoResponse = {
  video: Video;
  key: string;
  url: string;
  templateId: RemotionTemplateId;
};
