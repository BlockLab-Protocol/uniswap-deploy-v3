import { ContractInterface, ContractFactory } from '@ethersproject/contracts'
import { MigrationState, MigrationStep } from '../../migrations'

export default function createDeployLibraryStep({
  key,
  artifact: { contractName, abi, bytecode },
}: {
  key: keyof MigrationState
  artifact: { contractName: string; abi: ContractInterface; bytecode: string }
}): MigrationStep {
  return async (state, { signer, gasPrice }) => {
    if (state[key] === undefined) {
      const factory = new ContractFactory(abi, bytecode, signer)

      const library = await factory.deploy({ gasPrice })
      state[key] = library.address

      console.log("Deployed Library: " +library.address+" In Tx: "+library?.deployTransaction?.hash)

      return [
        {
          message: `Library ${contractName} deployed`,
          address: library.address,
          hash: library.deployTransaction.hash,
        },
      ]
    } else {
      return [{ message: `Library ${contractName} was already deployed`, address: state[key] }]
    }
  }
}
