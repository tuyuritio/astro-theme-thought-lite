# Contribution Guide

> [!Important]
> To ensure effective collaboration, please use **English** as the *primary language* for all Issues, Pull Requests, and Commit Messages.
>
> If you're not comfortable writing in English, feel free to include a translation first, followed by your original text.

Thank you for your interest in contributing!

Before you dive in, please review the guidelines below.\
Following these steps ensures that all contributions align with the project’s vision and maintain a streamlined workflow.

## Issues

> [!Tip]
> **Developers in mainland China**:\
> Before creating an Issue regarding connectivity, please verify that the *terminal environment* has unrestricted access to GitHub and Google services.

- Check existing Issues (*including closed ones*) to avoid duplicates.
- Follow the provided **template** to ensure all necessary context is included.

### Bug Reports

- Document the steps to reproduce the bug and the expected behavior.
- Whenever possible, provide a link to a live demo, a screenshot, or the relevant configuration files to help isolate the Issue.

### Enhancement Proposals

- Clearly describe the proposed enhancement and its intended function.
- Outline the reasoning behind the request and how it improves the user experience.
- Whenever possible, provide examples, references, or mockups to illustrate the concept.

## Pull Requests

> [!Warning]
> **About AI Assistance**:\
> Pull Requests failing to meet the following requirements will be **closed immediately**:
> - Manually review and test all code to prevent hallucinated logic or syntax
> - Ensure PR descriptions provide clear, meaningful value to the review process
> - Maintain strict adherence to the established workflow and commit specifications
> - Disclose any use of AI tools for code or documentation generation within the PR description

- An Issue describing the problem or feature is **required** before submitting a Pull Request.
- A **single problem** or a **single feature** per Pull Request to avoid bundling unrelated changes.
- Updated documentation for any new **user-facing features** or **configuration options**.
- Separate Pull Requests for **code refactoring** before submitting a new feature.
- Compliance with **basic tests** and the project's existing **code style**.

> [!Note]
> This project uses [Biome](https://biomejs.dev/) as the primary formatter and linter.\
> Due to current limitations in Biome's formatting for **Astro** and **Svelte** files, Prettier is used as a fallback for those specific file types.\
> Please format with Prettier first, then run Biome.

### Development Workflow

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

**Common Types**:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring

---

Thank you for your contribution ❤️
