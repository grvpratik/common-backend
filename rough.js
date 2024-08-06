// const WSOL = 'So11111111111111111111111111111111111111112'

// function formatNumber(value, decimals) {
//     // Convert the value to a string and format it with the specified number of decimals
//     const factor = Math.pow(10, decimals)
//     const formattedValue = (value / factor).toFixed(decimals)

//     return formattedValue
// }
// function findTokenEntry(result, tokenAddress) {
//     return result.find((entry) => entry.token_address === tokenAddress)
// }

// function updateObject(array, address, newValues) {
//     const obj = array.find((item) => item.token_address === address)
//     if (obj) {
//         // Update the properties with newValues
//         Object.assign(obj, newValues)

//         // Ensure obj.list is an array and concatenate newList to it
//         // if (Array.isArray(obj.list)) {
//         //     obj.list = obj.list.concat(newList)
//         // } else {
//         //     obj.list = [...newList]
//         // }
//     }
// }

// function processTokenSwaps(data) {
//     // Result array to hold the new objects
//     const result = []

//     // Iterate over each transaction
//     data.forEach((transaction) => {
//         const {
//             token1,
//             token2,
//             token1_decimals,
//             amount1,
//             token2_decimals,
//             amount2,
//         } = transaction.amount_info
//         // console.log({
//         //     token1,
//         //     token2,
//         //     token1_decimals,
//         //     amount1,
//         //     token2_decimals,
//         //     amount2,
//         // })
//         // Check if token1 is SOL
//         if (token1 === WSOL) {
//             // Find existing object for token2 in the result array
//             let tokenEntry = result.find(
//                 (entry) => entry.token_address === token2,
//             )
//             if (tokenEntry) {
//                 const res = findTokenEntry(result, token2)
//                 updateObject(result, res.token_address, {
//                     total_token_brought:
//                         res.total_token_brought +
//                         formatNumber(amount2, token2_decimals),
//                     total_sol_spend:
//                         res.total_sol_spend +
//                         formatNumber(amount1, token1_decimals),
//                 })
//             }
//             if (!tokenEntry) {
//                 // Create a new object for token2 if it doesn't exist in the result array
//                 let tokenEntry = {
//                     token_address: token2,
//                     total_token_brought: formatNumber(amount2, token2_decimals),
//                     total_sol_spend: formatNumber(amount1, token1_decimals),
//                     total_token_sold: 0,
//                     total_sol_gained: 0,
//                     // list: [
//                     //     {
//                     //         total_token_brought: formatNumber(
//                     //             amount2,
//                     //             token2_decimals,
//                     //         ),
//                     //         total_sol_spend: formatNumber(
//                     //             amount1,
//                     //             token1_decimals,
//                     //         ),
//                     //     },
//                     // ],
//                 }
//                 result.push(tokenEntry)
//             }
//         }
//         if (token2 === WSOL) {
//             let tokenEntry = result.find(
//                 (entry) => entry.token_address === token1,
//             )
//             if (tokenEntry) {
//                 const res = findTokenEntry(result, token1)
//                 updateObject(
//                     result,
//                     res.token_address,
//                     {
//                         total_token_sold:
//                             res.total_token_sold +
//                             formatNumber(amount1, token1_decimals),
//                         total_sol_gained:
//                             res.total_sol_gained +
//                             formatNumber(amount2, token2_decimals),
//                     },
//                     //    {
//                     //        total_token_brought: formatNumber(
//                     //            amount2,
//                     //            token2_decimals,
//                     //        ),
//                     //        total_sol_spend: formatNumber(
//                     //            amount1,
//                     //            token1_decimals,
//                     //        ),
//                     //    },
//                 )
//             }
//             if (!tokenEntry) {
//                 // Create a new object for token2 if it doesn't exist in the result array
//                 let tokenEntry = {
//                     token_address: token1,
//                     total_token_sold: formatNumber(amount1, token1_decimals),
//                     total_sol_gained: formatNumber(amount2, token2_decimals),

//                     //   list: [
//                     //       {
//                     //           total_token_brought: formatNumber(
//                     //               amount2,
//                     //               token2_decimals,
//                     //           ),
//                     //           total_sol_spend: formatNumber(
//                     //               amount1,
//                     //               token1_decimals,
//                     //           ),
//                     //       },
//                     //   ],
//                 }
//                 result.push(tokenEntry)
//             }
//         }
//     })

//     return result
// }

// // Example usage:
// const data = [
//     {
//         block_id: 281701640,
//         trans_id:
//             '22xgwdXh34voyv91grP54PKANHQfpf9uMq6RFdyWKsgEQzTQ4JSc9Jzai6N8US5XzwaTtvaitkGcJARQEUZk5c7m',
//         block_time: 1722858562,
//         activity_type: 'ACTIVITY_TOKEN_SWAP',
//         from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
//         sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
//         platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
//         amount_info: {
//             token1: '3G3EU1G3N75eP7z2V8aBzgE771sYZNo3L3mmjFpL9EMa',
//             token1_decimals: 6,
//             amount1: 1833171901000,
//             token2: 'So11111111111111111111111111111111111111112',
//             token2_decimals: 9,
//             amount2: 6335896725,
//             routers: [],
//         },
//     },
//     {
//         block_id: 281701523,
//         trans_id:
//             '5Y8XTGXUmASXvhtMszWhBewfZGTnWQg5zmY5gJfoibdg8o5y3N41knxp3B8ng9x3e45J8PuNKV9vhg7EYjKBj32J',
//         block_time: 1722858511,
//         activity_type: 'ACTIVITY_TOKEN_SWAP',
//         from_address: 'BZsS3Vz7vgh5EKUDu5KjKjQPd7PH7Tb6GDoZUZg6ZtE2',
//         sources: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
//         platform: '4swapLFGX54axuTwXfkpYAoTpBBkSioaeitaBHiXigWC',
//         amount_info: {
//             token1: 'So11111111111111111111111111111111111111112',
//             token1_decimals: 9,
//             amount1: 1000000000,
//             token2: '3G3EU1G3N75eP7z2V8aBzgE771sYZNo3L3mmjFpL9EMa',
//             token2_decimals: 6,
//             amount2: 1833171901000,
//             routers: [],
//         },
//     },
// ]

// console.log(processTokenSwaps(data))
