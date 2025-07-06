import type { fetchNative, globalFetch } from "../globalApi.svelte";
import type { OpenAIChat } from "../process/index.svelte";
import type { ScriptMode } from "../process/scripts";
import type { character } from "../storage/database";

/**
 * The provider argument.
 * @property {OpenAIChat[]} prompt_chat - The chat prompt.
 * @property {number} frequency_penalty - The frequency penalty.
 * @property {number} min_p - The minimum p value.
 * @property {number} presence_penalty - The presence penalty.
 * @property {number} repetition_penalty - The repetition penalty.
 * @property {number} top_k - The top k value.
 * @property {number} top_p - The top p value.
 * @property {number} temperature - The temperature value.
 * @property {number} max_tokens - The max tokens value.
 * @property {string} mode - The mode. One of model, submodel, memory, emotion, otherAx, translate.
 */
export type PluginV2ProviderArgument = {
  prompt_chat: OpenAIChat[];
  frequency_penalty: number;
  min_p: number;
  presence_penalty: number;
  repetition_penalty: number;
  top_k: number;
  top_p: number;
  temperature: number;
  mode: string;
  max_tokens: number;
  thinking_tokens: number;
};

/**
 * The provider options.
 * @property {string} [tokenizer] - The tokenizer name. must be one of "mistral", "llama", "novelai", "claude", "novellist", "llama3", "gemma", "cohere", "tiktoken" or "custom". If it's "custom", you have to provide tokenizerFunc.
 * @property {function (string): number[] | Promise<number[]>} [tokenizerFunc] - The tokenizer function.
 */
export type PluginV2ProviderOptions = {
  tokenizer?: string;
  tokenizerFunc?: (content: string) => number[] | Promise<number[]>;
};

/**
 * The provider result.
 * @property {boolean} success - If the provider was successful.
 * @property {string | ReadableStream<String>} content - The provider content.
 */
export type PluginV2ProviderResult = {
  success: boolean;
  content: string | ReadableStream<String>;
};

/**
 * The script handler.
 * @param {string} content - The content to handle.
 * @returns {string | null | undefined | Promise<string | null | undefined>} - The handler result. if it is a string or string promise, the data will be replaced with the result.
 */
export type EditFunction = (
  content: string
) => string | null | undefined | Promise<string | null | undefined>;

/**
 * The replacer type. One of beforeRequest, afterRequest.
 */
export type ReplacerType = "beforeRequest" | "afterRequest";

/**
 * The replacer function. vary depending on the type.
 * @param {OpenAIChat[] | string} content - If the type is beforeRequest, the content should be OpenAIChat[]. If the type is afterRequest, the content should be string.
 * @param {string} mode - Mode is one of model, submodel, memory, emotion, otherAx, translate.
 * @returns {OpenAIChat[] | string | Promise<OpenAIChat[] | string>} - If the type is beforeRequest, the result should be OpenAIChat[]. If the type is afterRequest, the result should be string.
 */
export type ReplacerFunction = (
  content: OpenAIChat[] | string,
  mode: string
) => OpenAIChat[] | string | Promise<OpenAIChat[] | string>;

/**
 * Fetches a URL with a native API, which doesn't have CORS restrictions.
 *
 * @param {string} url - The URL to fetch.
 * @param {GlobalFetchArgs} [arg={}] - The fetch arguments.
 * @returns {Promise<GlobalFetchResult>} - The fetch result.
 */
export declare const risuFetch: typeof globalFetch;

/**
 * Fetches a URL with the native API, which doesn't have CORS restrictions. this API is designed as a subset of fetch api, except it doesn't have CORS restrictions and default method is POST.
 *
 * @param {string} url - The URL to fetch.
 * @param {Object} arg - The fetch arguments.
 * @param {string} arg.body - The body to send with the request.
 * @param {Object} [arg.headers] - The headers to send with the request.
 * @param {string} [arg.method="POST"] - The method to use for the request. GET, POST, PUT, DELETE are supported. Default: POST.
 * @param {AbortSignal} [arg.signal] - The signal to use for aborting the request.
 * @returns {Promise<Response>} - The fetch result, in a Response object.
 */
export declare const nativeFetch: typeof fetchNative;

/**
 * Gets the argument value by name.
 *
 * @param {string} arg - The argument name. must be format of <plugin_name>::<arg_name> like exampleplugin::arg1.
 * @returns {string | number} - The argument value.
 */
export declare function getArg(arg: string): string | number;

/**
 * Gets the current character.
 * @returns {character} - The current character object.
 */
export declare function getChar(): character;

/**
 * Sets the current character.
 * @param {character} char - The character object.
 */
export declare function setChar(char: character): void;

/**
 * Adds a provider to the plugin.
 * @param {string} name - The provider name.
 * @param {function(PluginV2ProviderArgument, AbortSignal?): Promise<PluginV2ProviderResult>} func - The provider function.
 * @param {PluginV2ProviderOptions} [options] - The provider options.
 */
export declare function addProvider(
  name: string,
  func: (
    arg: PluginV2ProviderArgument,
    abortSignal?: AbortSignal
  ) => Promise<PluginV2ProviderResult>,
  options?: PluginV2ProviderOptions
): void;

/**
 * Adds a risu script handler to the plugin.
 * @param {ScriptMode} type - The handler type. One of display, output, input, process.
 * @param {EditFunction} func - The handler function.
 */
export declare function addRisuScriptHandler(
  type: ScriptMode,
  func: EditFunction
): void;

/**
 * Removes a risu script handler from the plugin.
 * @param {ScriptMode} type - The handler type. One of display, output, input, process.
 * @param {EditFunction} func - The handler function.
 */
export declare function removeRisuScriptHandler(
  type: ScriptMode,
  func: EditFunction
): void;

/**
 * Adds a risu replacer to the plugin.
 * @param {ReplacerType} type - The replacer type. One of beforeRequest, afterRequest.
 * @param {ReplacerFunction} func - The replacer function. vary depending on the type.
 */
export declare function addRisuReplacer(
  type: ReplacerType,
  func: ReplacerFunction
): void;

/**
 * Removes a risu replacer from the plugin.
 * @param {ReplacerType} type - The replacer type. One of beforeRequest, afterRequest.
 * @param {ReplacerFunction} func - The replacer function. vary depending on the type.
 */
export declare function removeRisuReplacer(
  type: ReplacerType,
  func: ReplacerFunction
): void;

/**
 * Adds an unload handler to the plugin.
 * @param {function(): void | Promise<void>} func - The unload handler.
 */
export declare function onUnload(func: () => void | Promise<void>): void;

/**
 * Sets the argument value by name.
 *
 * @param {string} arg - The argument name. must be format of <plugin_name>::<arg_name> like exampleplugin::arg1.
 * @param {string | number} value - The argument value.
 */
export declare function setArg(arg: string, value: string | number): void;
