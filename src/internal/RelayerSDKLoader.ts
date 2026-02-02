import { SDK_CDN_URL } from "./constants";
import { FhevmRelayerSDKType, FhevmWindowType } from "./fhevmTypes";

type TraceType = (message?: unknown, ...optionalParams: unknown[]) => void;

/**
 * Options for RetrySDKLoader.
 */
export interface RelayerSDKLoaderOptions {
  /** Optional trace function for logging */
  trace?: TraceType;
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay in ms before first retry (default: 1000) */
  initialDelay?: number;
  /** Maximum delay in ms between retries (default: 10000) */
  maxDelay?: number;
}

/**
 * Delay helper that returns a promise resolving after the specified time.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter.
 * @param attempt - The current attempt number (0-indexed)
 * @param initialDelay - The initial delay in ms
 * @param maxDelay - The maximum delay in ms
 */
function calculateBackoff(attempt: number, initialDelay: number, maxDelay: number): number {
  // Exponential backoff: initialDelay * 2^attempt
  const exponentialDelay = initialDelay * Math.pow(2, attempt);
  // Add jitter (±25%) to prevent thundering herd
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
  const delayWithJitter = exponentialDelay + jitter;
  // Cap at maxDelay
  return Math.min(delayWithJitter, maxDelay);
}

export class RelayerSDKLoader {
  private _trace?: TraceType;
  private _maxRetries: number;
  private _initialDelay: number;
  private _maxDelay: number;

  constructor(options: RelayerSDKLoaderOptions = {}) {
    this._trace = options.trace;
    this._maxRetries = options.maxRetries ?? 3;
    this._initialDelay = options.initialDelay ?? 1000;
    this._maxDelay = options.maxDelay ?? 10000;
  }

  public isLoaded() {
    if (typeof window === "undefined") {
      throw new Error("RelayerSDKLoader: can only be used in the browser.");
    }
    return isFhevmWindowType(window, this._trace);
  }

  /**
   * Load the Relayer SDK with automatic retry on failure.
   * Uses exponential backoff with jitter between retry attempts.
   */
  public async load(): Promise<void> {
    console.log("[RelayerSDKLoader] load...");
    // Ensure this only runs in the browser
    if (typeof window === "undefined") {
      console.log("[RelayerSDKLoader] window === undefined");
      throw new Error("RelayerSDKLoader: can only be used in the browser.");
    }

    // Check if already loaded
    if ("relayerSDK" in window) {
      if (!isFhevmRelayerSDKType(window.relayerSDK, this._trace)) {
        console.log("[RelayerSDKLoader] window.relayerSDK === undefined");
        throw new Error("RelayerSDKLoader: Unable to load FHEVM Relayer SDK");
      }
      return;
    }

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this._maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const backoffDelay = calculateBackoff(attempt - 1, this._initialDelay, this._maxDelay);
          console.log(
            `[RelayerSDKLoader] Retry attempt ${attempt}/${this._maxRetries} after ${Math.round(backoffDelay)}ms delay`
          );
          await delay(backoffDelay);
        }

        await this._loadScript();
        console.log("[RelayerSDKLoader] Successfully loaded Relayer SDK");
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `[RelayerSDKLoader] Load attempt ${attempt + 1}/${this._maxRetries + 1} failed:`,
          lastError.message
        );

        // Remove failed script to allow retry
        if (attempt < this._maxRetries) {
          this._removeScript();
        }
      }
    }

    // All retries exhausted
    throw new Error(
      `RelayerSDKLoader: Failed to load Relayer SDK after ${this._maxRetries + 1} attempts. ` +
        `Last error: ${lastError?.message ?? "Unknown error"}. ` +
        `Please check your network connection and try again.`
    );
  }

  /**
   * Remove any existing script tag for the SDK.
   * Called before retry to ensure clean state.
   */
  private _removeScript(): void {
    const existingScript = document.querySelector(`script[src="${SDK_CDN_URL}"]`);
    if (existingScript) {
      existingScript.remove();
    }
  }

  /**
   * Internal method to load the script once.
   */
  private _loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${SDK_CDN_URL}"]`);
      if (existingScript) {
        if (!isFhevmWindowType(window, this._trace)) {
          reject(
            new Error("RelayerSDKLoader: window object does not contain a valid relayerSDK object.")
          );
          return;
        }
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = SDK_CDN_URL;
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => {
        if (!isFhevmWindowType(window, this._trace)) {
          console.log("[RelayerSDKLoader] script onload FAILED...");
          reject(
            new Error(
              `RelayerSDKLoader: Relayer SDK script has been successfully loaded from ${SDK_CDN_URL}, however, the window.relayerSDK object is invalid.`
            )
          );
          return;
        }
        resolve();
      };

      script.onerror = () => {
        console.log("[RelayerSDKLoader] script onerror... ");
        reject(new Error(`RelayerSDKLoader: Failed to load Relayer SDK from ${SDK_CDN_URL}`));
      };

      console.log("[RelayerSDKLoader] add script to DOM...");
      document.head.appendChild(script);
      console.log("[RelayerSDKLoader] script added!");
    });
  }
}

function isFhevmRelayerSDKType(o: unknown, trace?: TraceType): o is FhevmRelayerSDKType {
  if (typeof o === "undefined") {
    trace?.("RelayerSDKLoader: relayerSDK is undefined");
    return false;
  }
  if (o === null) {
    trace?.("RelayerSDKLoader: relayerSDK is null");
    return false;
  }
  if (typeof o !== "object") {
    trace?.("RelayerSDKLoader: relayerSDK is not an object");
    return false;
  }
  if (!objHasProperty(o, "initSDK", "function", trace)) {
    trace?.("RelayerSDKLoader: relayerSDK.initSDK is invalid");
    return false;
  }
  if (!objHasProperty(o, "createInstance", "function", trace)) {
    trace?.("RelayerSDKLoader: relayerSDK.createInstance is invalid");
    return false;
  }
  if (!objHasProperty(o, "SepoliaConfig", "object", trace)) {
    trace?.("RelayerSDKLoader: relayerSDK.SepoliaConfig is invalid");
    return false;
  }
  if ("__initialized__" in o) {
    if (o.__initialized__ !== true && o.__initialized__ !== false) {
      trace?.("RelayerSDKLoader: relayerSDK.__initialized__ is invalid");
      return false;
    }
  }
  return true;
}

export function isFhevmWindowType(win: unknown, trace?: TraceType): win is FhevmWindowType {
  if (typeof win === "undefined") {
    trace?.("RelayerSDKLoader: window object is undefined");
    return false;
  }
  if (win === null) {
    trace?.("RelayerSDKLoader: window object is null");
    return false;
  }
  if (typeof win !== "object") {
    trace?.("RelayerSDKLoader: window is not an object");
    return false;
  }
  if (!("relayerSDK" in win)) {
    trace?.("RelayerSDKLoader: window does not contain 'relayerSDK' property");
    return false;
  }
  return isFhevmRelayerSDKType(win.relayerSDK);
}

function objHasProperty<
  T extends object,
  K extends PropertyKey,
  V extends string, // "string", "number", etc.
>(
  obj: T,
  propertyName: K,
  propertyType: V,
  trace?: TraceType
): obj is T &
  Record<
    K,
    V extends "string"
      ? string
      : V extends "number"
        ? number
        : V extends "object"
          ? object
          : V extends "boolean"
            ? boolean
            : V extends "function"
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (...args: any[]) => any
              : unknown
  > {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  if (!(propertyName in obj)) {
    trace?.(`RelayerSDKLoader: missing ${String(propertyName)}.`);
    return false;
  }

  const value = (obj as Record<K, unknown>)[propertyName];

  if (value === null || value === undefined) {
    trace?.(`RelayerSDKLoader: ${String(propertyName)} is null or undefined.`);
    return false;
  }

  if (typeof value !== propertyType) {
    trace?.(`RelayerSDKLoader: ${String(propertyName)} is not a ${propertyType}.`);
    return false;
  }

  return true;
}
