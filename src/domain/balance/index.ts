export { BALANCE_CONFIG } from "../../data/balance/balance.config";
export type {
  BalanceConfig,
  BalanceRole,
  FactionBalanceProfile,
} from "../../data/balance/balance.config";
export { BalanceSystem } from "./balanceSystem";
export {
  buildSampleArmy,
  runDefaultBalanceSuite,
  simulateMatch,
  simulateMatchup,
  type MatchupStats,
  type SimulationMatchResult,
  type SimulationSuiteReport,
} from "./battleSimulation";