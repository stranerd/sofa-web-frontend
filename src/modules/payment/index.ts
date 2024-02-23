export { Currencies, Purchasables, TransactionType } from './domain/types'
export type { FlutterwaveSecrets, Saleable } from './domain/types'
import { MethodRepository } from './data/repositories/methods'
import { PlanRepository } from './data/repositories/plans'
import { PurchaseRepository } from './data/repositories/purchases'
import { TransactionRepository } from './data/repositories/transactions'
import { WalletRepository } from './data/repositories/wallets'
import { WithdrawalRepository } from './data/repositories/withdrawals'

import { MethodsUseCase } from './domain/useCases/methods'
import { PlansUseCase } from './domain/useCases/plans'
import { PurchasesUseCase } from './domain/useCases/purchases'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { WalletsUseCase } from './domain/useCases/wallets'
import { WithdrawalsUseCase } from './domain/useCases/withdrawals'

export const MethodsUseCases = new MethodsUseCase(MethodRepository.getInstance())
export const PlansUseCases = new PlansUseCase(PlanRepository.getInstance())
export const PurchasesUseCases = new PurchasesUseCase(PurchaseRepository.getInstance())
export const TransactionsUseCases = new TransactionsUseCase(TransactionRepository.getInstance())
export const WalletsUseCases = new WalletsUseCase(WalletRepository.getInstance())
export const WithdrawalsUseCases = new WithdrawalsUseCase(WithdrawalRepository.getInstance())

export { MethodEntity } from './domain/entities/methods'
export { PlanEntity } from './domain/entities/plans'
export { PurchaseEntity } from './domain/entities/purchases'
export { TransactionEntity } from './domain/entities/transactions'
export { WalletEntity } from './domain/entities/wallets'
export { WithdrawalEntity } from './domain/entities/withdrawals'

export { FundWalletFactory } from './domain/factories/fundWallet'
export { WithdrawalFactory } from './domain/factories/withdrawal'
