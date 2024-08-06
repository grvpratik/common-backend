interface TokenEntry {
    token_address: string
    total_token_brought?: number
    total_sol_spend?: number
    total_token_sold?: number
    total_sol_gained?: number
}

interface AmountInfo {
    token1: string
    token1_decimals: number
    amount1: number
    token2: string
    token2_decimals: number
    amount2: number
    routers: string[]
}

interface Transaction {
    block_id: number
    trans_id: string
    block_time: number
    activity_type: string
    from_address: string
    sources: string[]
    platform: string
    amount_info: AmountInfo
}


const WSOL = 'So11111111111111111111111111111111111111112'

function formatNumber(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals)
    return parseFloat((value / factor).toFixed(decimals))
}

function findTokenEntry(
    result: TokenEntry[],
    tokenAddress: string,
): TokenEntry | undefined {
    return result.find((entry) => entry.token_address === tokenAddress)
}


function updateObject(
    array: TokenEntry[],
    address: string,
    newValues: Partial<TokenEntry>,
): void {
    const obj :any= array.find((item) => item.token_address === address)
    if (obj) {
        Object.keys(newValues).forEach((key) => {
            const typedKey = key as keyof TokenEntry
            const value = newValues[typedKey]
            if (value !== undefined) {
                const currentValue =
                    typeof obj[typedKey] === 'number'
                        ? (obj[typedKey] as number)
                        : 0
                const newValue =
                    typeof value === 'number' ? value : parseFloat(value)

                if (isNaN(newValue)) {
                    console.error(`Invalid value ${value} for key ${typedKey}`)
                    return
                }

                obj[typedKey] = currentValue + newValue
            }
        })
    }
}


export default function processTokenSwaps(data: Transaction[]): TokenEntry[] {
    const result: TokenEntry[] = []

    data.forEach((transaction) => {
        const {
            token1,
            token2,
            token1_decimals,
            amount1,
            token2_decimals,
            amount2,
        } = transaction.amount_info

        // Check if token1 is SOL
        if (token1 === WSOL) {
            let tokenEntry = findTokenEntry(result, token2)
            if (tokenEntry) {
                updateObject(result, token2, {
                    total_token_brought: formatNumber(amount2, token2_decimals),
                    total_sol_spend: formatNumber(amount1, token1_decimals),
                })
            } else {
                tokenEntry = {
                    token_address: token2,
                    total_token_brought: formatNumber(amount2, token2_decimals),
                    total_sol_spend: formatNumber(amount1, token1_decimals),
                    total_token_sold: 0,
                    total_sol_gained: 0,
                }
                result.push(tokenEntry)
            }
        }

        // Check if token2 is SOL
        if (token2 === WSOL) {
            let tokenEntry = findTokenEntry(result, token1)
            if (tokenEntry) {
                updateObject(result, token1, {
                    total_token_sold: formatNumber(amount1, token1_decimals),
                    total_sol_gained: formatNumber(amount2, token2_decimals),
                })
            } else {
                tokenEntry = {
                    token_address: token1,
                    total_token_sold: formatNumber(amount1, token1_decimals),
                    total_sol_gained: formatNumber(amount2, token2_decimals),
                }
                result.push(tokenEntry)
            }
        }
    })

    return result
}

// Example usage
const data: Transaction[] = [
    {
        block_id: 281909496,
        trans_id:
            '5p8k3UYon1CAXvFprmWq3rT44yJzAUxBbHekBZpBB94HqskaRm7ayCPYMi39hf3SGj7behK1H1GMRdTTU2pvZvhS',
        block_time: 1722947897,
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
        sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
        amount_info: {
            token1: 'WriPiB9YFK6TpTF8s9oZS6DVSkMAtToQ7CMQfzjpump',
            token1_decimals: 6,
            amount1: 2512232674566,
            token2: 'So11111111111111111111111111111111111111112',
            token2_decimals: 9,
            amount2: 2129968165,
            routers: [],
        },
    },
    {
        block_id: 281909388,
        trans_id:
            '356byiLeBHiCvQu3EYxrbVn369HbWLDHc4axSL7Apzaf9nZ3vrbUyVu4FZVcwtRL2jaX1xYikobKrJAdwzsVhpz5',
        block_time: 1722947852,
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
        sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
        amount_info: {
            token1: 'WriPiB9YFK6TpTF8s9oZS6DVSkMAtToQ7CMQfzjpump',
            token1_decimals: 6,
            amount1: 1570145421604,
            token2: 'So11111111111111111111111111111111111111112',
            token2_decimals: 9,
            amount2: 979761149,
            routers: [],
        },
    },
    {
        block_id: 281909370,
        trans_id:
            '4FkwPXwkrdDyca3PNJGXqMbkWr6BDwN6tFZwwPPgTTAhqT1KVtcLUS12G1SzhFFJoWDxok4HdJZDfDx6p9UrZ511',
        block_time: 1722947844,
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
        sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
        amount_info: {
            token1: 'WriPiB9YFK6TpTF8s9oZS6DVSkMAtToQ7CMQfzjpump',
            token1_decimals: 6,
            amount1: 3364597332008,
            token2: 'So11111111111111111111111111111111111111112',
            token2_decimals: 9,
            amount2: 1962005871,
            routers: [],
        },
    },
    {
        block_id: 281909359,
        trans_id:
            'TJNhsvDviNw4RLPHcSekRZKB5w2dZdwUPqTABCLQ3DFQJLyVBzseWtNH74atE1S38VGggSa3PaTy51AzrYtcdPu',
        block_time: 1722947839,
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
        sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
        amount_info: {
            token1: 'WriPiB9YFK6TpTF8s9oZS6DVSkMAtToQ7CMQfzjpump',
            token1_decimals: 6,
            amount1: 4806567617155,
            token2: 'So11111111111111111111111111111111111111112',
            token2_decimals: 9,
            amount2: 2842213382,
            routers: [],
        },
    },
    {
        block_id: 281909347,
        trans_id:
            '3C6DD7BfY1J2i6A1hdUztvQu9ZvPkNaq1iQu4SHzs8SYNv5AGB91pjLKRWUnM4UjyrAijT7oaYcszyCMTJWvZdFY',
        block_time: 1722947835,
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
        sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
        amount_info: {
            token1: 'WriPiB9YFK6TpTF8s9oZS6DVSkMAtToQ7CMQfzjpump',
            token1_decimals: 6,
            amount1: 16021892057183,
            token2: 'So11111111111111111111111111111111111111112',
            token2_decimals: 9,
            amount2: 9149800906,
            routers: [],
        },
    },
    {
        block_id: 281909338,
        trans_id:
            '2EPpv7aEo7isLD6LmQfH5oujq9mcjWXKMLrzaL4G1BqNt5VXqZr4aMcuWguB6BUoUHNyCNLJvEDUgnjXZWpVk8JS',
        block_time: 1722947831,
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
        sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
        amount_info: {
            token1: 'So11111111111111111111111111111111111111112',
            token1_decimals: 9,
            amount1: 15000000000,
            token2: 'WriPiB9YFK6TpTF8s9oZS6DVSkMAtToQ7CMQfzjpump',
            token2_decimals: 6,
            amount2: 32043784114366,
            routers: [],
        },
    },
    {
        block_id: 281902272,
        trans_id:
            '2qo54ZPKZwAZJUW1VdQGFQw2ZFbe1nSteSS2Uh3DgAF6pmhUxu1UxtvahisMgSjNBzC6gyzUdQ8cT5zW24KfTjUK',
        block_time: 1722944865,
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
        sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
        amount_info: {
            token1: 'w1qRJro4Z9jDL5T1xdMxWj5VJDKMdXkTh42VqoSpump',
            token1_decimals: 6,
            amount1: 309563047654,
            token2: 'So11111111111111111111111111111111111111112',
            token2_decimals: 9,
            amount2: 162442841,
            routers: [],
        },
    },
    {
        block_id: 281902259,
        trans_id:
            '2UVgnGizoDo63XavZ3MyAfFQ9jZZZHUYjRiru9VMmE4jcRFYX66wB9iiD5aDpEiuF2Uk9AXNJVUYWUsBfDse46Fe',
        block_time: 1722944859,
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
        sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
        amount_info: {
            token1: 'nuDkj3KD2kgjJDbmoZMR8Bc6kSjtsh1Jr8ozxWZpump',
            token1_decimals: 6,
            amount1: 723962811161,
            token2: 'So11111111111111111111111111111111111111112',
            token2_decimals: 9,
            amount2: 358722100,
            routers: [],
        },
    },
    {
        block_id: 281901641,
        trans_id:
            '2jAAQdYVhGePf8MYh8AX6GuxEyaQqp5x7MUtX5HQJYoVSJ7ttDXi6YyR8W73LR6GMZU9d6mAtvhao9ha3yYZbYqS',
        block_time: 1722944600,
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
        sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
        amount_info: {
            token1: 'nuDkj3KD2kgjJDbmoZMR8Bc6kSjtsh1Jr8ozxWZpump',
            token1_decimals: 6,
            amount1: 1689246559376,
            token2: 'So11111111111111111111111111111111111111112',
            token2_decimals: 9,
            amount2: 708864163,
            routers: [],
        },
    },
    {
        block_id: 281901631,
        trans_id:
            '5cHPxPocfJkXmZhqRdCgmHmbaa72uoPCt68r8swu8eYndUUCmcs7ctLCboYhGfCVnZsoqRJ4dsHEUvNH5XSyAfjY',
        block_time: 1722944597,
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
        sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
        amount_info: {
            token1: 'So11111111111111111111111111111111111111112',
            token1_decimals: 9,
            amount1: 1000000000,
            token2: 'nuDkj3KD2kgjJDbmoZMR8Bc6kSjtsh1Jr8ozxWZpump',
            token2_decimals: 6,
            amount2: 2413209370537,
            routers: [],
        },
    },
]
console.log(processTokenSwaps(data))
