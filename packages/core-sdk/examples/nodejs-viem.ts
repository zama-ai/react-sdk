/**
 * Basic Node.js example using viem with @zama-fhe/core-sdk
 *
 * This example demonstrates:
 * - Creating an FhevmConfig with wagmi-core style configuration
 * - Using viem's createWalletClient for transactions
 * - Reading confidential balances
 * - Performing confidential transfers
 *
 * Prerequisites:
 * - npm install viem @zama-fhe/core-sdk
 * - Set environment variables: INFURA_API_KEY, PRIVATE_KEY
 */

import { createFhevmConfig, http, confidentialBalance, confidentialTransfer } from '@zama-fhe/core-sdk'
import { sepolia, hardhatLocal } from '@zama-fhe/core-sdk/chains'
import { createWalletClient, createPublicClient, http as viemHttp, type Address } from 'viem'
import { sepolia as viemSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

// Environment variables
const INFURA_API_KEY = process.env.INFURA_API_KEY || 'YOUR_INFURA_KEY'
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}` || '0xYOUR_PRIVATE_KEY'
const ERC7984_TOKEN_ADDRESS = '0xYourTokenAddress' as Address

// 1. Configure core-sdk with wagmi-core style
const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
  transports: {
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
    [hardhatLocal.id]: http('http://127.0.0.1:8545'),
  },
})

// 2. Create viem clients
const account = privateKeyToAccount(PRIVATE_KEY)

const publicClient = createPublicClient({
  chain: viemSepolia,
  transport: viemHttp(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
})

const walletClient = createWalletClient({
  account,
  chain: viemSepolia,
  transport: viemHttp(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
})

/**
 * Example 1: Read confidential balance
 */
async function readConfidentialBalance() {
  console.log('📊 Reading confidential balance...')

  const balanceHandle = await confidentialBalance(config, {
    chainId: sepolia.id,
    contractAddress: ERC7984_TOKEN_ADDRESS,
    account: account.address,
    provider: publicClient, // Pass viem publicClient directly
  })

  if (!balanceHandle) {
    console.log('❌ No balance found (zero balance or not initialized)')
    return undefined
  }

  console.log('✅ Balance handle:', balanceHandle)
  return balanceHandle
}

/**
 * Example 2: Perform confidential transfer
 */
async function performConfidentialTransfer(
  recipientAddress: Address,
  amount: bigint
) {
  console.log('💸 Performing confidential transfer...')
  console.log(`   To: ${recipientAddress}`)
  console.log(`   Amount: ${amount}`)

  try {
    const result = await confidentialTransfer(config, {
      chainId: sepolia.id,
      contractAddress: ERC7984_TOKEN_ADDRESS,
      to: recipientAddress,
      amount,
      provider: walletClient, // Pass viem walletClient for transactions
    })

    console.log('✅ Transfer successful!')
    console.log(`   Transaction hash: ${result.hash}`)
    console.log(`   Encrypted amount: ${result.encryptedAmount}`)

    return result
  } catch (error) {
    console.error('❌ Transfer failed:', error)
    throw error
  }
}

/**
 * Example 3: Read multiple balances in parallel
 */
async function readMultipleBalances(addresses: Address[]) {
  console.log('📊 Reading multiple balances in parallel...')

  const balancePromises = addresses.map(address =>
    confidentialBalance(config, {
      chainId: sepolia.id,
      contractAddress: ERC7984_TOKEN_ADDRESS,
      account: address,
      provider: publicClient,
    })
  )

  const balances = await Promise.all(balancePromises)

  addresses.forEach((address, i) => {
    console.log(`   ${address}: ${balances[i] || 'No balance'}`)
  })

  return balances
}

/**
 * Main function - demonstrates usage
 */
async function main() {
  console.log('🚀 Starting Node.js + Viem Core SDK Example\n')
  console.log(`📍 Using account: ${account.address}`)
  console.log(`🌐 Network: ${viemSepolia.name} (Chain ID: ${sepolia.id})`)
  console.log(`🪙 Token: ${ERC7984_TOKEN_ADDRESS}\n`)

  try {
    // Example 1: Read own balance
    const myBalance = await readConfidentialBalance()
    console.log('')

    // Example 2: Transfer tokens (uncomment to use)
    // const recipientAddress = '0xRecipientAddress' as Address
    // const transferAmount = 100n
    // await performConfidentialTransfer(recipientAddress, transferAmount)
    // console.log('')

    // Example 3: Read multiple balances
    const addressesToCheck: Address[] = [
      account.address,
      '0x1234567890123456789012345678901234567890',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    ]
    await readMultipleBalances(addressesToCheck)

    console.log('\n✅ Example completed successfully!')
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

// Run the example
main()
