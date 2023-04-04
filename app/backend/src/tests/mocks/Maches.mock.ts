import Matche from "../../database/models/Matche";
import INewMatch from "../../interfaces/INewMatches";



export const matches = [
    {
        "id": 1,
        "homeTeamId": 16,
        "homeTeamGoals": 1,
        "awayTeamId": 8,
        "awayTeamGoals": 1,
        "inProgress": false,
        "homeTeam": {
            "teamName": "São Paulo"
        },
        "awayTeam": {
            "teamName": "Grêmio"
        }
    },
    {
        "id": 2,
        "homeTeamId": 9,
        "homeTeamGoals": 1,
        "awayTeamId": 14,
        "awayTeamGoals": 1,
        "inProgress": false,
        "homeTeam": {
            "teamName": "Internacional"
        },
        "awayTeam": {
            "teamName": "Santos"
        }
    },
    {
        "id": 41,
        "homeTeamId": 16,
        "homeTeamGoals": 2,
        "awayTeamId": 9,
        "awayTeamGoals": 0,
        "inProgress": true,
        "homeTeam": {
            "teamName": "São Paulo"
        },
        "awayTeam": {
            "teamName": "Internacional"
        }
    },
    {
        "id": 42,
        "homeTeamId": 6,
        "homeTeamGoals": 1,
        "awayTeamId": 1,
        "awayTeamGoals": 0,
        "inProgress": true,
        "homeTeam": {
            "teamName": "Ferroviária"
        },
        "awayTeam": {
            "teamName": "Avaí/Kindermann"
        }
    },
    {
        "id": 43,
        "homeTeamId": 11,
        "homeTeamGoals": 0,
        "awayTeamId": 10,
        "awayTeamGoals": 0,
        "inProgress": true,
        "homeTeam": {
            "teamName": "Napoli-SC"
        },
        "awayTeam": {
            "teamName": "Minas Brasília"
        }
    },
] as unknown as Matche[]


export const finishedMatches = [
    {
        "id": 46,
        "homeTeamId": 4,
        "awayTeamId": 12,
        "homeTeamGoals": 1,
        "awayTeamGoals": 1,
        "inProgress": true,
        "homeTeam": {
            "id": 4,
            "teamName": "Corinthians"
        },
        "awayTeam": {
            "id": 12,
            "teamName": "Palmeiras"
        }
    },
    {
        "id": 47,
        "homeTeamId": 8,
        "awayTeamId": 14,
        "homeTeamGoals": 1,
        "awayTeamGoals": 2,
        "inProgress": true,
        "homeTeam": {
            "id": 8,
            "teamName": "Grêmio"
        },
        "awayTeam": {
            "id": 14,
            "teamName": "Santos"
        }
    },
] as unknown as Matche[]


export const inProgressMatches = [{
    "id": 41,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 9,
    "awayTeamGoals": 0,
    "inProgress": true,
    "homeTeam": {
        "teamName": "São Paulo"
    },
    "awayTeam": {
        "teamName": "Internacional"
    }
},
{
    "id": 42,
    "homeTeamId": 6,
    "homeTeamGoals": 1,
    "awayTeamId": 1,
    "awayTeamGoals": 0,
    "inProgress": true,
    "homeTeam": {
        "teamName": "Ferroviária"
    },
    "awayTeam": {
        "teamName": "Avaí/Kindermann"
    }
},
{
    "id": 43,
    "homeTeamId": 11,
    "homeTeamGoals": 0,
    "awayTeamId": 10,
    "awayTeamGoals": 0,
    "inProgress": true,
    "homeTeam": {
        "teamName": "Napoli-SC"
    },
    "awayTeam": {
        "teamName": "Minas Brasília"
    }
},] as unknown as Matche[]

export const updateMatchesMock = {
    "homeTeamGoals": 3,
    "awayTeamGoals": 1
}

export const newMatchMock = {
    "homeTeamId": 16,
    "awayTeamId": 8,
    "homeTeamGoals": 2,
    "awayTeamGoals": 2,
}

export const newMatchReturnMock = {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 8,
    "awayTeamGoals": 2,
    "inProgress": true,
} as INewMatch


export const matchesEquals = {
    "homeTeamId": 8,
    "awayTeamId": 8,
    "homeTeamGoals": 1,
    "awayTeamGoals": 2
}


export const matchesIncorrect = {
    // "homeTeamId": 8,
    "awayTeamId": 8,
    "homeTeamGoals": 1,
    "awayTeamGoals": 2
}