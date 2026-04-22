import { randomInt, randomUUID } from 'node:crypto';
import { GenerateQuizInput, GenerateQuizOutput } from '../domain/types/types';
import { quizCategoryOptions } from '../schemas/quiz.schemas';

type PromptMessage = {
  role: 'system' | 'user';
  content: string;
};

export const buildQuizPrompt = (props: GenerateQuizInput): PromptMessage[] => {
  const categoryOptionsText = quizCategoryOptions
    .map((category) => `${category.id} = ${category.label}`)
    .join('; ');
  const excludedQuestions = props.excludedQuestions ?? [];
  const excludedQuestionsText = excludedQuestions
    .slice(0, 150)
    .map((question, index) => `${index + 1}. ${question}`)
    .join('\n');

  return [
    {
      role: 'system',
      content: [
        'Você é um gerador de quizzes para vídeos curtos (TikTok/Reels/Shorts) em PT-BR.',
        'Responda SOMENTE com JSON válido. Sem markdown. Sem texto extra. Sem comentários.',
        'Priorize consistência e verificabilidade. Se tiver dúvida factual, troque por um fato mais conhecido.',
        'Você deve cumprir o schema exatamente. Se algum requisito falhar, corrija antes de finalizar.',
      ].join('\n'),
    },
    {
      role: 'user',
      content: [
        'Tarefa: gerar um quiz factual e viral (alto CTR) para redes sociais.',
        '',
        `Nicho: ${props.niche}`,
        `Referência ÚNICA: ${props.reference}`,
        `Quantidade de questões: ${props.questionsCount}`,
        '',
        'Retorne exatamente este JSON (mesmas chaves e tipos):',
        '{"title":"string","hashtags":"string","category":"number","description":"string","questions":[{"question":"string","answers":["string","string","string","string"],"correctAnswerIndex":0}]}',
        '',
        'REGRAS OBRIGATÓRIAS:',
        `1) "questions" deve ter EXATAMENTE ${props.questionsCount} itens, todos exclusivamente sobre "${props.reference}".`,
        '2) Cada questão deve ter "answers" com EXATAMENTE 4 alternativas (strings curtas).',
        '3) As 4 alternativas devem ser ÚNICAS e claramente distintas (sem sinônimos/variações).',
        '4) Apenas 1 alternativa correta por questão.',
        '5) "correctAnswerIndex" deve ser um inteiro 0, 1, 2 ou 3 e apontar para a alternativa correta.',
        '6) A resposta correta NÃO pode aparecer no enunciado (nem como trecho óbvio).',
        '7) Não use: "Todas as alternativas", "Nenhuma das alternativas".',
        '8) Não crie perguntas ambíguas (duas alternativas poderiam estar certas).',
        '9) Varie a posição do gabarito: distribua "correctAnswerIndex" ao longo das questões (não repita sempre o mesmo).',
        '10) Não misture outras franquias, personagens, universos ou referências fora de ' + JSON.stringify(props.reference) + '.',
        '11) Não invente fatos. Se não tiver certeza, substitua por um fato comum e verificável.',
        excludedQuestions.length > 0
          ? [
            '',
            'PERGUNTAS PROIBIDAS:',
            'Não gere perguntas iguais, equivalentes ou com o mesmo fato central destas perguntas já usadas:',
            excludedQuestionsText,
          ].join('\n')
          : '',
        '',
        'TÍTULO (viral, forte):',
        '12) "title" <= 70 caracteres, MUITO chamativo, estilo vídeo curto.',
        '13) Use gatilhos de curiosidade/competição sem mentir: "Você consegue?", "Só fã raiz acerta", "Nível impossível", "99% erra", etc.',
        '14) O título deve mencionar o tema/referência diretamente.',
        '',
        'HASHTAGS:',
        '15) "hashtags" deve conter APENAS hashtags, de 3 a 6, separadas por espaço.',
        '16) Misture: hashtag do tema + hashtag do nicho + hashtags de formato (#quiz #shorts etc).',
        '',
        'CATEGORIA:',
        `17) Escolha a categoria pela label desta lista: (${categoryOptionsText}). Retorne SOMENTE o ID no campo "category".`,
        '',
        'DESCRIÇÃO:',
        '18) "description" curta (1-2 frases) com CTA (comentar/seguir). Sem hashtags aqui. Sem links.',
        '',
        'AUTO-CHECK (obrigatório antes de responder):',
        '- JSON válido? sem texto extra?',
        '- Cada pergunta tem 4 alternativas únicas?',
        '- correctAnswerIndex 0..3 e bate com a alternativa correta?',
        '- Enunciado não contém a resposta?',
        '- title <= 70 e viral?',
        '- hashtags 3..6 e só hashtags?',
        '- category é um ID válido da lista?',
      ].join('\n'),
    },
  ];
};

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

const shuffleArray = <T>(items: T[]): T[] => {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }

  return cloned;
};

export const mapQuestionsToDomain = (
  questions: Array<{
    question: string;
    answers: string[];
    correctAnswerIndex: number;
  }>,
): GenerateQuizOutput['questions'] => {
  return questions.map((q) => {
    const questionId = randomUUID();
    const questionText = String(q.question).trim();

    const answers = q.answers.map((a) => String(a).trim());

    if (answers.length !== 4) {
      throw new Error(`Pergunta inválida: opções != 4. Pergunta: "${q.question}"`);
    }

    const uniqueAnswersCount = new Set(answers.map(normalizeText)).size;
    if (uniqueAnswersCount !== 4) {
      throw new Error(`Pergunta inválida: alternativas duplicadas. Pergunta: "${q.question}"`);
    }

    const correctIndex = Number(q.correctAnswerIndex);
    if (![0, 1, 2, 3].includes(correctIndex)) {
      throw new Error(`Pergunta inválida: correctAnswerIndex fora de 0..3. Pergunta: "${q.question}"`);
    }

    const options = answers.map((text) => ({
      id: randomUUID(),
      text,
    }));

    const correctOption = options[correctIndex];

    const normalizedQuestion = normalizeText(questionText);
    const normalizedCorrectText = normalizeText(correctOption.text);

    if (normalizedCorrectText.length >= 5 && normalizedQuestion.includes(normalizedCorrectText)) {
      throw new Error(
        `Pergunta inválida: contém a resposta correta no enunciado. Pergunta: "${q.question}"`,
      );
    }

    const shuffledOptions = shuffleArray(options);
    const shuffledCorrectIndex = shuffledOptions.findIndex(
      (option) => option.id === correctOption.id,
    );

    if (shuffledCorrectIndex < 0) {
      throw new Error(`Pergunta inválida: índice da resposta correta não encontrado. Pergunta: "${q.question}"`);
    }

    return {
      id: questionId,
      question: questionText,
      options: shuffledOptions,
      answer: {
        correctAnswerIndex: shuffledCorrectIndex,
      },
    };
  });
};
