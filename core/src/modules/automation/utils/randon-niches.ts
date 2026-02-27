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
            "Boruto",
            "Dragon Ball",
            "Dragon Ball Z",
            "Dragon Ball Super",
            "One Piece",
            "Attack on Titan",
            "Death Note",
            "Demon Slayer",
            "Jujutsu Kaisen",
            "Tokyo Ghoul",
            "Fullmetal Alchemist",
            "Fullmetal Alchemist Brotherhood",
            "Hunter x Hunter",
            "Bleach",
            "My Hero Academia",
            "Chainsaw Man",
            "Black Clover",
            "Sword Art Online",
            "Blue Lock",
            "Haikyuu",
            "Spy x Family",
            "Fairy Tail",
            "Mob Psycho 100"
        ]
    },

    {
        niche: "Filmes",
        references: [
            "Marvel Cinematic Universe",
            "Avengers",
            "Spider-Man",
            "Batman",
            "Superman",
            "The Dark Knight",
            "Star Wars",
            "Harry Potter",
            "The Lord of the Rings",
            "The Hobbit",
            "Jurassic Park",
            "Jurassic World",
            "Transformers",
            "Pirates of the Caribbean",
            "Indiana Jones",
            "Matrix",
            "Avatar",
            "Frozen",
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
            "The Witcher",
            "Peaky Blinders",
            "Friends",
            "The Office",
            "Brooklyn Nine Nine",
            "Dark",
            "Wednesday",
            "Euphoria",
            "Vikings",
            "Lost",
            "Prison Break"
        ]
    },

    {
        niche: "Games",
        references: [
            "Minecraft",
            "Fortnite",
            "GTA V",
            "GTA San Andreas",
            "Red Dead Redemption 2",
            "The Witcher 3",
            "Elden Ring",
            "Dark Souls",
            "Bloodborne",
            "God of War",
            "God of War Ragnarok",
            "The Legend of Zelda",
            "Breath of the Wild",
            "Tears of the Kingdom",
            "Call of Duty",
            "Warzone",
            "Counter Strike",
            "Valorant",
            "League of Legends",
            "Dota 2",
            "Overwatch",
            "Roblox",
            "Among Us"
        ]
    },

    {
        niche: "Futebol",
        references: [
            "Real Madrid",
            "Barcelona",
            "Liverpool",
            "Manchester United",
            "Manchester City",
            "Chelsea",
            "Arsenal",
            "Bayern Munich",
            "Paris Saint Germain",
            "Juventus",
            "AC Milan",
            "Inter Milan",
            "Flamengo",
            "Palmeiras",
            "Corinthians",
            "Santos",
            "São Paulo FC",
            "Seleção Brasileira",
            "Champions League",
            "Copa do Mundo"
        ]
    },

    {
        niche: "Jogadores de Futebol",
        references: [
            "Lionel Messi",
            "Cristiano Ronaldo",
            "Neymar",
            "Kylian Mbappe",
            "Erling Haaland",
            "Ronaldinho Gaucho",
            "Ronaldo Fenomeno",
            "Zinedine Zidane",
            "David Beckham",
            "Pelé",
            "Maradona",
            "Luka Modric",
            "Kevin De Bruyne",
            "Vinicius Junior",
            "Jude Bellingham"
        ]
    },

    {
        niche: "Cartoons",
        references: [
            "SpongeBob SquarePants",
            "Rick and Morty",
            "The Simpsons",
            "Family Guy",
            "Adventure Time",
            "Regular Show",
            "Ben 10",
            "Teen Titans",
            "Teen Titans Go",
            "Gravity Falls",
            "Steven Universe",
            "Avatar The Last Airbender",
            "The Legend of Korra"
        ]
    },

    {
        niche: "YouTube",
        references: [
            "MrBeast",
            "PewDiePie",
            "Markiplier",
            "Dream",
            "Technoblade",
            "Ludwig",
            "IShowSpeed",
            "Sidemen",
            "KSI",
            "Logan Paul"
        ]
    },

    {
        niche: "Tecnologia",
        references: [
            "Apple",
            "iPhone",
            "Steve Jobs",
            "Microsoft",
            "Bill Gates",
            "Windows",
            "Google",
            "Android",
            "Samsung",
            "Tesla",
            "Elon Musk",
            "SpaceX",
            "NVIDIA",
            "Intel"
        ]
    },

    {
        niche: "História",
        references: [
            "Ancient Egypt",
            "Ancient Rome",
            "Greek Mythology",
            "World War I",
            "World War II",
            "Cold War",
            "Napoleon Bonaparte",
            "Roman Empire",
            "Vikings",
            "Medieval Europe"
        ]
    },

    {
        niche: "Mitologia",
        references: [
            "Greek Mythology",
            "Norse Mythology",
            "Egyptian Mythology",
            "Zeus",
            "Odin",
            "Thor",
            "Loki",
            "Hades",
            "Athena",
            "Poseidon"
        ]
    },

    {
        niche: "Ciência",
        references: [
            "Albert Einstein",
            "Isaac Newton",
            "Nikola Tesla",
            "Stephen Hawking",
            "Black Holes",
            "Solar System",
            "Planets",
            "Physics",
            "Space Exploration",
            "NASA"
        ]
    },

    {
        niche: "Carros",
        references: [
            "Ferrari",
            "Lamborghini",
            "Bugatti",
            "Porsche",
            "BMW",
            "Audi",
            "Mercedes Benz",
            "Tesla",
            "Nissan GTR",
            "Supra"
        ]
    },

    {
        niche: "Marcas",
        references: [
            "Nike",
            "Adidas",
            "Supreme",
            "Gucci",
            "Louis Vuitton",
            "Rolex",
            "McDonalds",
            "Coca Cola",
            "Pepsi",
            "Starbucks"
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