import { createWalletClient, http, createPublicClient } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const account = privateKeyToAccount('0x0123456789012345678901234567890123456789012345678901234567890123')

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http('https://rpc.sepolia.org'),
})

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://rpc.sepolia.org'),
})

console.log('=== WalletClient Properties ===')
console.log('Keys:', Object.keys(walletClient))
console.log('\nHas mode?', 'mode' in walletClient)
console.log('Has account?', 'account' in walletClient)
console.log('Has chain?', 'chain' in walletClient)
console.log('Has sendTransaction?', 'sendTransaction' in walletClient)
console.log('Has readContract?', 'readContract' in walletClient)

console.log('\n=== PublicClient Properties ===')
console.log('Keys:', Object.keys(publicClient))
console.log('\nHas mode?', 'mode' in publicClient)
console.log('Has account?', 'account' in publicClient)
console.log('Has chain?', 'chain' in publicClient)
console.log('Has sendTransaction?', 'sendTransaction' in publicClient)
console.log('Has readContract?', 'readContract' in publicClient)
