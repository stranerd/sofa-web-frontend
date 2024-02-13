export { Currencies, Purchasables } from './domain/types'
export type { Saleable } from './domain/types/purchases'
import { WalletRepository } from './data/repositories/wallets'
import { PlanRepository } from './data/repositories/plans'
import { TransactionRepository } from './data/repositories/transactions'
import { MethodRepository } from './data/repositories/methods'
import { WithdrawalRepository } from './data/repositories/withdrawals'
import { PurchaseRepository } from './data/repositories/purchases'

import { WalletsUseCase } from './domain/useCases/wallets'
import { PlansUseCase } from './domain/useCases/plans'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { MethodsUseCase } from './domain/useCases/methods'
import { WithdrawalsUseCase } from './domain/useCases/withdrawals'
import { PurchasesUseCase } from './domain/useCases/purchases'

export const MethodsUseCases = new MethodsUseCase(MethodRepository.getInstance())
export const PlansUseCases = new PlansUseCase(PlanRepository.getInstance())
export const PurchasesUseCases = new PurchasesUseCase(PurchaseRepository.getInstance())
export const TransactionsUseCases = new TransactionsUseCase(TransactionRepository.getInstance())
export const WalletsUseCases = new WalletsUseCase(WalletRepository.getInstance())
export const WithdrawalsUseCases = new WithdrawalsUseCase(WithdrawalRepository.getInstance())
