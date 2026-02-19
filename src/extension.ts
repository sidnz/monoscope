import * as vscode from "vscode";
import * as path from "node:path";
import { getScopeMode, toggleScopeMode } from "./state";
import {
  getActiveFilePath,
  findNxProjectRoot,
  getRelativeProjectPath,
  getProjectName,
} from "./nxResolver";
import { createStatusBarItem, updateStatusBar } from "./ui";

export function activate(context: vscode.ExtensionContext) {
  console.log("MonoScope extension is now active");

  createStatusBarItem(context);

  const initialMode = getScopeMode(context);
  updateStatusBar(initialMode);

  // register cmd
  const openCommand = vscode.commands.registerCommand(
    "monoScope.open",
    async () => {
      const currentMode = getScopeMode(context);

      if (currentMode === "workspace") {
        // use default quick open
        await vscode.commands.executeCommand("workbench.action.quickOpen");
        return;
      }

      // project mode - try resolve project root
      const activeFilePath = getActiveFilePath();
      if (!activeFilePath) {
        await vscode.commands.executeCommand("workbench.action.quickOpen");
        return;
      }

      const projectRoot = await findNxProjectRoot(activeFilePath);
      if (!projectRoot) {
        await vscode.commands.executeCommand("workbench.action.quickOpen");
        return;
      }

      const relativePath = getRelativeProjectPath(projectRoot);
      if (!relativePath) {
        await vscode.commands.executeCommand("workbench.action.quickOpen");
        return;
      }

      // Find all files in the project
      const globPattern = `${relativePath}/**/*`;
      const files = await vscode.workspace.findFiles(
        globPattern,
        "**/node_modules/**",
      );

      if (!files?.length) {
        vscode.window.showInformationMessage(
          "No files found in current project",
        );
        return;
      }

      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      const items: vscode.QuickPickItem[] = [
        {
          label: "$(globe) Show Entire Workspace",
          description: "Switch to workspace-wide file search",
          alwaysShow: true,
        },
        { label: "", kind: vscode.QuickPickItemKind.Separator },
      ];

      // add project files
      const projectName = getProjectName(projectRoot);
      files.forEach((file) => {
        const relativePath = workspaceRoot
          ? path.relative(workspaceRoot, file.fsPath)
          : file.fsPath;
        items.push({
          label: path.basename(file.fsPath),
          description: relativePath,
          detail: projectName,
        });
      });

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: `Files in ${projectName} (${files.length} files)`,
        matchOnDescription: true,
        matchOnDetail: true,
      });

      if (!selected) {
        return;
      }

      // handle selection
      if (selected.label === "$(globe) Show Entire Workspace") {
        await vscode.commands.executeCommand("workbench.action.quickOpen");
      } else if (selected.description) {
        // user selected a file -> open it
        const fullPath = workspaceRoot
          ? path.join(workspaceRoot, selected.description)
          : selected.description;

        const document = await vscode.workspace.openTextDocument(fullPath);
        await vscode.window.showTextDocument(document);
      }
    },
  );

  // register cmd to toggle scope mode
  const toggleCommand = vscode.commands.registerCommand(
    "monoScope.toggleScope",
    async () => {
      const newMode = await toggleScopeMode(context);
      updateStatusBar(newMode);
      vscode.window.showInformationMessage(
        `Quick Open scope changed to: ${newMode}`,
      );
    },
  );

  // editor change listener to update status bar
  const editorChangeListener = vscode.window.onDidChangeActiveTextEditor(
    async (editor) => {
      if (!editor) {
        return;
      }

      const currentMode = getScopeMode(context);
      const filePath = editor.document.uri.fsPath;

      if (currentMode === "project") {
        const projectRoot = await findNxProjectRoot(filePath);

        if (projectRoot) {
          const projectName = getProjectName(projectRoot);
          updateStatusBar(currentMode, projectName);
        } else {
          updateStatusBar(currentMode);
        }
      } else {
        updateStatusBar(currentMode);
      }
    },
  );

  // push disposables to context.subscriptions
  context.subscriptions.push(openCommand);
  context.subscriptions.push(toggleCommand);
  context.subscriptions.push(editorChangeListener);
}

export function deactivate() {}
