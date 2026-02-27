type QuizNiche = {
    niche: string
    references: string[]
}

export const quizNiches: QuizNiche[] = [
    {
        niche: "Anime",
        references: [
            "Naruto",
            "Naruto Shippuden",
            "Dragon Ball",
            "Dragon Ball Z",
            "Dragon Ball Super",
            "One Piece",
            "Death Note",
            "Demon Slayer",
            "Jujutsu Kaisen",
            "Bleach"
        ]
    },
    {
        niche: "Filmes",
        references: [
            "Universo Cinematográfico Marvel",
            "Universo DC",
            "Avengers",
            "Liga da Justiça",
            "Homem-Aranha",
            "Batman",
            "Superman",
            "Mulher-Maravilha",
            "Coringa",
            "Harry Potter",
            "O Senhor dos Anéis",
            "Jurassic Park",
            "Jurassic World",
            "Piratas do Caribe",
            "Matrix",
            "Avatar",
            "Toy Story",
            "Shrek"
        ]
    },
    {
        niche: "Séries",
        references: [
            "Breaking Bad",
            "Better Call Saul",
            "Game of Thrones",
            "House of the Dragon",
            "Stranger Things",
            "The Walking Dead",
            "The Last of Us",
            "Peaky Blinders",
            "Friends",
            "The Office",
            "Brooklyn Nine Nine",
            "Dark",
            "Wednesday"
        ]
    },
    {
        niche: "Games",
        references: [
            "Minecraft",
            "Fortnite",
            "GTA V",
            "God of War",
            "Call of Duty",
            "Warzone",
            "Counter Strike",
            "Valorant",
            "League of Legends",
            "Roblox",
        ]
    },
    {
        niche: "Futebol",
        references: [
            "Atlético-MG",
            "Bahia",
            "Botafogo",
            "Red Bull Bragantino",
            "Ceará",
            "Corinthians",
            "Cruzeiro",
            "Flamengo",
            "Fluminense",
            "Fortaleza",
            "Grêmio",
            "Internacional",
            "Juventude",
            "Mirassol",
            "Palmeiras",
            "Santos",
            "São Paulo",
            "Sport",
            "Vasco da Gama",
            "Vitória"
        ]
    },
    {
        niche: "Jogadores de Futebol",
        references: [
            "craques do futebol mundial",
            "ídolos do futebol brasileiro",
            "artilheiros históricos do futebol",
            "maiores camisas 10",
            "lendas da Seleção Brasileira",
            "jogadores decisivos em Copas do Mundo",
            "jogadores que marcaram época",
            "jovens promessas do futebol",
            "melhores atacantes da atualidade",
            "melhores meio-campistas da atualidade"
        ]
    },
    {
        niche: "Desenhos",
        references: [
            "Bob Esponja",
            "Os Simpsons",
            "Ben 10",
        ]
    },
    {
        niche: "História",
        references: [
            "Egito Antigo",
            "Roma Antiga",
            "Mitologia Grega",
            "Primeira Guerra Mundial",
            "Segunda Guerra Mundial",
            "Guerra Fria",
            "Império Romano",
            "Vikings",
            "Europa Medieval"
        ]
    },
    {
        niche: "Mitologia",
        references: [
            "Mitologia Grega",
            "Mitologia Nórdica",
            "Mitologia Egípcia",
        ]
    },
    {
        niche: "Ciência",
        references: [
            "Buracos Negros",
            "Sistema Solar",
            "Planetas",
            "Física",
            "Exploração Espacial",
            "NASA"
        ]
    },
    {
        niche: "Geografia",
        references: [
            "capitais do Brasil",
            "estados e capitais",
            "países e capitais",
            "bandeiras de países",
            "continentes e oceanos",
            "maiores países do mundo",
            "mapa-múndi",
            "relevo brasileiro",
            "rios mais famosos do mundo",
            "climas do Brasil"
        ]
    },
    {
        niche: "Matemática Básica",
        references: [
            "tabuada",
            "adição e subtração",
            "multiplicação e divisão",
            "frações",
            "porcentagem",
            "regra de três",
            "expressões numéricas",
            "números primos",
            "equações de 1º grau",
            "problemas de matemática do dia a dia"
        ]
    },
    {
        niche: "Curiosidades",
        references: [
            "curiosidades gerais",
            "fatos surpreendentes",
            "mistérios famosos",
            "recordes mundiais",
            "perguntas de conhecimento geral"
        ]
    }
]

import { randomInt } from "node:crypto"

export function getRandomQuizReference() {
    const niche = quizNiches[randomInt(quizNiches.length)]
    const reference = niche.references[randomInt(niche.references.length)]

    return {
        niche: niche.niche,
        reference
    }
}
