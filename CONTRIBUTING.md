# Code Contributing Guide

Thank you for your interest in contributing!

## Guidelines

Before you dive in, to keep things running smoothly for everyone and make sure your contribution aligns with the project's goals, please take a moment to review these guidelines:

- If you plan to add a **new feature** or make a significant **architectural change**, please open an [Issue](https://github.com/tuyuritio/astro-theme-thought-lite/issues) first to discuss your idea and design plan.
- A Pull Request should **solve only one problem** or **add one feature**. Please avoid bundling multiple, unrelated changes into a single PR.
- If you need to **refactor existing code** to support your new feature, please submit the refactoring as a separate PR *before* submitting the feature PR.
- If your PR introduces a **new user-facing feature** or **configuration option**, you **must** update relevant documentation to explain how to use it.
- Please make sure your changes pass **basic tests** and follow the project's existing **code style**.

> [!Note]
> This project uses [Biome](https://biomejs.dev/) as the primary formatter and linter. However, due to poor formatting support for HTMLish code in Svelte and Astro files, Prettier is used as a fallback for those files.\
> Please format with Prettier first, then format with Biome.

## How to Contribute

1. [Fork](https://github.com/tuyuritio/astro-theme-thought-lite/fork) this repository to your own GitHub account.
2. Create a new branch for your changes: `git checkout -b feat/your-feature`
3. Make your changes and [commit](#commit-convention) them: `git commit -m "feat: add new feature"`.
4. Pull the latest changes from the base repository to avoid conflicts: `git pull origin main`
5. Push your branch to your fork: `git push origin feat/your-feature`
6. Open a Pull Request from your branch to the appropriate base branch in this repository.

### Commit Convention

Using [Conventional Commits](https://www.conventionalcommits.org/). The commit message format is:

```
<type>[(<scope>)]: <description>
```

---

Thank you for your contribution ❤️
