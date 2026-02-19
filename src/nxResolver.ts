import * as vscode from "vscode";
import * as path from "node:path";
import * as fs from "node:fs";

/**
 * Get the file path of the currently active editor
 * @returns Active file path or undefined if no active editor
 */
export function getActiveFilePath(): string | undefined {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return undefined;
  }
  return activeEditor.document.uri.fsPath;
}

/**
 * Find the Nx project root directory for a given file path
 * @param filePath File path to start searching from
 * @returns Project root path or undefined if not found
 */
export async function findNxProjectRoot(
  filePath: string,
): Promise<string | undefined> {
  if (!filePath) {
    return undefined;
  }

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(
    vscode.Uri.file(filePath),
  );

  if (!workspaceFolder) {
    return undefined;
  }

  const workspaceRoot = workspaceFolder.uri.fsPath;
  let currentDir = path.dirname(filePath);

  // traverse upward from current file directory
  while (currentDir.startsWith(workspaceRoot)) {
    const projectJsonPath = path.join(currentDir, "project.json");
    if (fs.existsSync(projectJsonPath)) {
      return currentDir;
    }

    // Check if this is an apps/<name> or libs/<name> folder
    const parentDir = path.dirname(currentDir);
    const folderName = path.basename(parentDir);
    if (folderName === "apps" || folderName === "libs") {
      return currentDir;
    }

    const nextDir = path.dirname(currentDir);
    if (nextDir === currentDir) {
      // fs root reached without finding project.json
      break;
    }
    currentDir = nextDir;
  }

  return undefined;
}

/**
 * Get the relative path from workspace root to project root
 * @param projectRoot Absolute project root path
 * @returns Relative path or undefined
 */
export function getRelativeProjectPath(
  projectRoot: string,
): string | undefined {
  const { workspaceFolders } = vscode.workspace;
  if (!workspaceFolders?.length) {
    return undefined;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  const relativePath = path.relative(workspaceRoot, projectRoot);

  // x-platform compatibility
  return relativePath.split(path.sep).join("/");
}

/**
 * Get the project name from project root path
 * @param projectRoot Absolute project root path
 * @returns Project name
 */
export function getProjectName(projectRoot: string): string {
  return path.basename(projectRoot);
}
