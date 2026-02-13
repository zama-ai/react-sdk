# Function: encrypt()

```ts
function encrypt(config: FhevmConfig, params: EncryptParams): Promise<EncryptedOutput>;
```

Defined in: [core-sdk/src/actions/encrypt.ts:43](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/core-sdk/src/actions/encrypt.ts#L43)

Encrypt values for FHE contract calls.

Returns encrypted handles and proof that can be used in contract calls.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `FhevmConfig` |
| `params` | `EncryptParams` |

## Returns

`Promise`\<`EncryptedOutput`\>

## Example

```typescript
const result = await encrypt(config, {
  chainId: 11155111,
  values: [
    { type: 'uint64', value: 100n },
    { type: 'address', value: '0xRecipient...' },
  ],
  contractAddress: '0xContract...',
  userAddress: '0xUser...',
})

// Use in contract call
const [amountHandle, recipientHandle, proof] = [...result.handles, result.proof]
```
