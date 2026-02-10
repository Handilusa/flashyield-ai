import {
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount,
} from "wagmi";
import { formatUnits, parseUnits, formatEther, parseEther } from "viem";
import { CONTRACTS } from "@/config/contracts";
import { SimpleDEXABI } from "@/lib/abis/SimpleDEX";
import { MockUSDCABI } from "@/lib/abis/MockUSDC";

const DEX = CONTRACTS.DEX as `0x${string}`;
const USDC = CONTRACTS.USDC as `0x${string}`;
const USDC_DECIMALS = 6;

export function useSwap() {
    const { address } = useAccount();

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

    // ── READS ──

    // Check USDC allowance for DEX
    const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
        address: USDC,
        abi: MockUSDCABI,
        functionName: "allowance",
        args: address ? [address, DEX] : undefined,
    });

    const approveUSDC = (amountHuman: string) => {
        const amount = parseUnits(amountHuman, USDC_DECIMALS);
        writeContract({
            address: USDC,
            abi: MockUSDCABI,
            functionName: "approve",
            args: [DEX, amount],
        });
    };

    const swapMONForUSDC = (amountHuman: string) => {
        const amount = parseEther(amountHuman);
        writeContract({
            address: DEX,
            abi: SimpleDEXABI,
            functionName: "swapMONForUSDC",
            value: amount,
        });
    };

    const swapUSDCForMON = (amountHuman: string) => {
        const amount = parseUnits(amountHuman, USDC_DECIMALS);
        writeContract({
            address: DEX,
            abi: SimpleDEXABI,
            functionName: "swapUSDCForMON",
            args: [amount],
        });
    };

    const allowance = allowanceRaw
        ? formatUnits(allowanceRaw as bigint, USDC_DECIMALS)
        : "0";

    const needsApproval = (amountHuman: string) => {
        if (!amountHuman || parseFloat(amountHuman) <= 0) return false;
        return parseFloat(allowance) < parseFloat(amountHuman);
    };

    return {
        swapMONForUSDC,
        swapUSDCForMON,
        approveUSDC,
        needsApproval,
        allowance,
        refetchAllowance,
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        error: writeError || txError,
        resetWrite,
    };
}
