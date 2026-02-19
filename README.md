# MonoScope

**Scope Quick Open (Ctrl+P) to your current project in monorepos.**

Perfect for Nx. Stop searching through thousands of files across your entire workspace - focus on what matters.

## Features

- 🎯 **Smart Project Detection** - Automatically detects your current project
- 📁 **Filtered File List** - Shows only files from your current project
- 🌍 **Easy Toggle** - Switch between project and workspace scope with one click
- 💾 **Persistent State** - Remembers your preferred scope mode
- 📊 **Status Bar Indicator** - Always know your current scope

## Usage

1. **Open scoped Quick Pick**: Press `Ctrl+P` (or `Cmd+P` on Mac) - automatically scoped to your current project
2. **Toggle scope**: Click the status bar indicator (bottom left) or use Command Palette > "MonoScope: Toggle Scope Mode"
3. **Access workspace files**: Select "🌍 Show Entire Workspace" option in the Quick Pick

## Supported Monorepo Tools

Currently optimized for:

- ✅ **Nx** - Full support with `project.json` detection
- 🚧 **Other monorepos** - Coming soon (Turborepo, pnpm workspaces, Yarn workspaces, Lerna)

## Extension Settings

Configure in your VS Code settings:

```json
{
  "monoScope.defaultScope": "project"  // or "workspace"
}
```

## Commands

- `MonoScope: Open Current Project` - Open Quick Pick scoped to current project
- `MonoScope: Toggle Scope Mode` - Switch between project and workspace mode

## Known Issues

For best results:

- Ensure your projects have `project.json` files (Nx)
- Projects should be in `apps/` or `libs/` directories

## Contributing

Found a bug or want to request a feature? [Open an issue](https://github.com/sidnz/monoscope/issues)!
