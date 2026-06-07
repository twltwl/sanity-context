import type { CurrentUser } from "sanity";
import { ForwardRefExoticComponent } from "react";
import { PluginOptions } from "sanity";
import { RefAttributes } from "react";
import { SVGProps } from "react";
import type { Workspace } from "sanity";

/** @public */
export declare interface ContextDefinition {
  id: string;
  title: string;
  options: ContextOption[];
  defaultValue: string;
}

/** @public */
export declare interface ContextEntry {
  enabled: boolean;
  value: string;
}

/** @public */
export declare const ContextIcon: ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>
>;

/** @public */
export declare interface ContextOption {
  value: string;
  title: string;
}

/** @public */
export declare function contextPlugin(
  config: ContextPluginConfig,
): PluginOptions;

/** @public */
export declare interface ContextPluginConfig {
  contexts: ContextDefinition[] | ContextsResolver;
  storageKey?: string;
}

/** @public */
export declare interface ContextResolverContext {
  currentUser: CurrentUser | null;
  workspace: Workspace;
}

/** @public */
export declare type ContextsResolver = (
  ctx: ContextResolverContext,
) => ContextDefinition[];

/** @public */
export declare type ContextState = Record<string, ContextEntry>;

/** @public */
export declare function getContext(): ContextState;

/** @public */
export declare function subscribeToContext(listener: () => void): () => void;

export {};
