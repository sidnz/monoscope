import * as vscode from "vscode";
import { ScopeMode } from "./state";

let statusBarItem: vscode.StatusBarItem | undefined;

/**
 * Create and initialize the status bar item
 * @param context Extension context
 * @returns Status bar item
 */
export function createStatusBarItem(
  context: vscode.ExtensionContext,
): vscode.StatusBarItem {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100,
  );
  statusBarItem.command = "monoScope.toggleScope";
  context.subscriptions.push(statusBarItem);
  statusBarItem.show();
  return statusBarItem;
}

/**
 * Update the status bar item based on current scope mode
 * @param mode Current scope mode
 * @param projectName Optional project name to display in tooltip
 */
export function updateStatusBar(mode: ScopeMode, projectName?: string): void {
  if (!statusBarItem) {
    return;
  }

  if (mode === "project") {
    statusBarItem.text = "$(search) Project";
    statusBarItem.tooltip = projectName
      ? `MonoScope: ${projectName}\nClick to switch to workspace mode`
      : "MonoScope: Current project\nClick to switch to workspace mode";
  } else {
    statusBarItem.text = "$(globe) Workspace";
    statusBarItem.tooltip =
      "Quick Open shows entire workspace\nClick to switch to project mode";
  }
}

/**
 * Get the status bar item
 * @returns Status bar item or undefined
 */
export function getStatusBarItem(): vscode.StatusBarItem | undefined {
  return statusBarItem;
}
