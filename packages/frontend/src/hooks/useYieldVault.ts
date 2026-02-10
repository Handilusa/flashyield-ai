import {
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { CONTRACTS } from "@/config/contracts";
import { YieldVaultABI } from "@/lib/abis/YieldVault";
import { MockUSDCABI } from "@/lib/abis/MockUSDC";
import { YieldOptimizerABI } from "@/lib/abis/YieldOptimizer";

// ─── Contract Addresses ────────────────────────────────────────
const VAULT = CONTRACTS.VAULT as `0x${string}`;
const USDC = CONTRACTS.USDC as `0x${string}`;
const OPTIMIZER = CONTRACTS.OPTIMIZER as `0x${string}`;

const USDC_DECIMALS = 6;
const REFETCH_INTERVAL = 10_000; // 10 seconds

/**
 * useYieldVault — Main hook for interacting with the FlashYield contracts
 *
 * Reads:
 *  - YieldVault.totalDeposits()
 *  - YieldVault.balances(address)
 *  - YieldVault.getCurrentAPY()
 *  - MockUSDC.balanceOf(address)
 *  - MockUSDC.allowance(address, vault)
 *  - YieldOptimizer.poolAPY_A / poolAPY_B
 *
 * Writes:
 *  - MockUSDC.approve(vault, amount)
 *  - YieldVault.deposit(amount)
 *  - MockUSDC.mint(to, amount)
 *
 * All reads auto-refresh every 10 seconds.
 */
export function useYieldVault() {
    const { address, isConnected } = useAccount();

    // ═══════════════════ CONTRACT READS ═══════════════════

    // ── TVL (Total Deposits in Vault) ──
    const {
        data: totalDepositsRaw,
        isLoading: isLoadingTVL,
        refetch: refetchTVL,
    } = useReadContract({
        address: VAULT,
        abi: YieldVaultABI,
        functionName: "totalDeposits",
        query: { refetchInterval: REFETCH_INTERVAL, enabled: true },
    });

    // ── User's vault balance ──
    const {
        data: userVaultBalanceRaw,
        isLoading: isLoadingUserVault,
        refetch: refetchUserVault,
    } = useReadContract({
        address: VAULT,
        abi: YieldVaultABI,
        functionName: "balances",
        args: address ? [address] : undefined,
        query: {
            refetchInterval: REFETCH_INTERVAL,
            enabled: !!address,
        },
    });

    // ── Current APY from Vault (delegates to Optimizer) ──
    const {
        data: currentAPYRaw,
        isLoading: isLoadingAPY,
    } = useReadContract({
        address: VAULT,
        abi: YieldVaultABI,
        functionName: "getCurrentAPY",
        query: { refetchInterval: REFETCH_INTERVAL, enabled: true },
    });

    // ── User's USDC wallet balance ──
    const {
        data: usdcBalanceRaw,
        isLoading: isLoadingUSDCBalance,
        refetch: refetchUSDCBalance,
    } = useReadContract({
        address: USDC,
        abi: MockUSDCABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            refetchInterval: REFETCH_INTERVAL,
            enabled: !!address,
        },
    });

    // ── USDC allowance for Vault ──
    const {
        data: allowanceRaw,
        refetch: refetchAllowance,
    } = useReadContract({
        address: USDC,
        abi: MockUSDCABI,
        functionName: "allowance",
        args: address ? [address, VAULT] : undefined,
        query: {
            refetchInterval: REFETCH_INTERVAL,
            enabled: !!address,
        },
    });

    // ── Optimizer Pool APYs ──
    const { data: poolAPY_A } = useReadContract({
        address: OPTIMIZER,
        abi: YieldOptimizerABI,
        functionName: "poolAPY_A",
        query: { refetchInterval: REFETCH_INTERVAL, enabled: true },
    });

    const { data: poolAPY_B } = useReadContract({
        address: OPTIMIZER,
        abi: YieldOptimizerABI,
        functionName: "poolAPY_B",
        query: { refetchInterval: REFETCH_INTERVAL, enabled: true },
    });

    // ── Optimizer total assets ──
    const { data: optimizerAssetsRaw } = useReadContract({
        address: OPTIMIZER,
        abi: YieldOptimizerABI,
        functionName: "getTotalAssets",
        query: { refetchInterval: REFETCH_INTERVAL, enabled: true },
    });

    // ═══════════════════ CONTRACT WRITES ═══════════════════

    const {
        writeContract,
        data: hash,
        isPending,
        error: writeError,
        reset: resetWrite,
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: txError,
    } = useWaitForTransactionReceipt({ hash });

    // ── Approve USDC for Vault ──
    const approveUSDC = (amountHuman: string) => {
        if (!amountHuman || parseFloat(amountHuman) <= 0) return;
        const amount = parseUnits(amountHuman, USDC_DECIMALS);
        writeContract({
            address: USDC,
            abi: MockUSDCABI,
            functionName: "approve",
            args: [VAULT, amount],
        });
    };

    // ── Deposit USDC into Vault ──
    const deposit = (amountHuman: string) => {
        if (!amountHuman || parseFloat(amountHuman) <= 0) return;
        const amount = parseUnits(amountHuman, USDC_DECIMALS);
        writeContract({
            address: VAULT,
            abi: YieldVaultABI,
            functionName: "deposit",
            args: [amount],
        });
    };

    // ── Withdraw USDC from Vault ──
    const withdraw = (amountHuman: string) => {
        if (!amountHuman || parseFloat(amountHuman) <= 0) return;
        const amount = parseUnits(amountHuman, USDC_DECIMALS);
        writeContract({
            address: VAULT,
            abi: YieldVaultABI,
            functionName: "withdraw",
            args: [amount],
        });
    };

    // ── Mint test USDC (1000 USDC) ──
    const mintTestUSDC = () => {
        if (!address) return;
        const amount = parseUnits("1000", USDC_DECIMALS); // 1000 USDC
        writeContract({
            address: USDC,
            abi: MockUSDCABI,
            functionName: "mint",
            args: [address, amount],
        });
    };

    // ═══════════════════ FORMATTED VALUES ═══════════════════

    const totalDeposits = totalDepositsRaw
        ? formatUnits(totalDepositsRaw as bigint, USDC_DECIMALS)
        : "0";

    const userVaultBalance = userVaultBalanceRaw
        ? formatUnits(userVaultBalanceRaw as bigint, USDC_DECIMALS)
        : "0";

    const usdcBalance = usdcBalanceRaw
        ? formatUnits(usdcBalanceRaw as bigint, USDC_DECIMALS)
        : "0";

    const allowance = allowanceRaw
        ? formatUnits(allowanceRaw as bigint, USDC_DECIMALS)
        : "0";

    // APY is returned as basis points (e.g. 500 = 5.00%)
    const currentAPY = currentAPYRaw
        ? (Number(currentAPYRaw) / 100).toFixed(2)
        : "0.00";

    const poolApyA = poolAPY_A ? (Number(poolAPY_A) / 100).toFixed(2) : "0.00";
    const poolApyB = poolAPY_B ? (Number(poolAPY_B) / 100).toFixed(2) : "0.00";

    const optimizerAssets = optimizerAssetsRaw
        ? formatUnits(optimizerAssetsRaw as bigint, USDC_DECIMALS)
        : "0";

    // Check if user needs to approve before deposit
    const needsApproval = (amountHuman: string): boolean => {
        if (!amountHuman || parseFloat(amountHuman) <= 0) return false;
        return parseFloat(allowance) < parseFloat(amountHuman);
    };

    const error = writeError || txError;

    // Refetch all data after a successful transaction
    const refetchAll = () => {
        refetchTVL();
        refetchUserVault();
        refetchUSDCBalance();
        refetchAllowance();
    };

    return {
        // Wallet
        address,
        isConnected,

        // USDC balance (in wallet)
        usdcBalance,
        usdcBalanceRaw: usdcBalanceRaw as bigint | undefined,

        // Vault balance (deposited)
        userVaultBalance,
        userVaultBalanceRaw: userVaultBalanceRaw as bigint | undefined,

        // TVL
        totalDeposits,
        totalDepositsRaw: totalDepositsRaw as bigint | undefined,

        // APY
        currentAPY,
        poolApyA,
        poolApyB,

        // Optimizer
        optimizerAssets,

        // Allowance
        allowance,
        needsApproval,

        // Loading states
        isLoadingTVL,
        isLoadingUserVault,
        isLoadingAPY,
        isLoadingUSDCBalance,

        // Write actions
        approveUSDC,
        deposit,
        withdraw,
        mintTestUSDC,

        // Transaction state
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        error,
        resetWrite,

        // Refetch helpers
        refetchAll,
        refetchTVL,
        refetchUserVault,
        refetchUSDCBalance,
        refetchAllowance,

        // Constants
        explorerUrl: "https://testnet.monad.xyz",
        usdcDecimals: USDC_DECIMALS,
    };
}
