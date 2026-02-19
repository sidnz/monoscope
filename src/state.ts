import * as vscode from "vscode";

export type ScopeMode = "project" | "workspace";

const SCOPE_MODE_KEY = "monoScope.scopeMode";

/**
 * Get the current scope mode from workspace state
 * @param context Extension context
 * @returns Current scope mode ('project' or 'workspace')
 */
export function getScopeMode(context: vscode.ExtensionContext): ScopeMode {
  const scopeMode = context.workspaceState.get<ScopeMode>(SCOPE_MODE_KEY);
  if (scopeMode) {
    return scopeMode;
  }

  const config = vscode.workspace.getConfiguration("monoScope");
  const defaultScope = config.get<ScopeMode>("defaultScope", "project");
  return defaultScope;
}

/**
 * Toggle the scope mode between 'project' and 'workspace'
 * @param context Extension context
 * @returns New scope mode after toggle
 */
export async function toggleScopeMode(
  context: vscode.ExtensionContext,
): Promise<ScopeMode> {
  const currentMode = getScopeMode(context);
  const newMode: ScopeMode =
    currentMode === "project" ? "workspace" : "project";
  await context.workspaceState.update(SCOPE_MODE_KEY, newMode);
  return newMode;
}
