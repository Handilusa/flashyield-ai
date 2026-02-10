
import { Buffer } from "buffer";

// Polyfill Buffer for WalletConnect v2
if (typeof window !== "undefined") {
    window.Buffer = window.Buffer || Buffer;
}
