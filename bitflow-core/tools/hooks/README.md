# Git Hooks

We use [pre-commit](https://pre-commit.com/) to run linters and tests before each commit.

## Setup

```bash
pip install pre-commit
pre-commit install
```

This installs hooks defined in `.pre-commit-config.yaml` which run:

- `composer lint` via PHP_CodeSniffer
- `composer format -- --dry-run` to ensure formatting
- `composer test` (fast test suite)

If hooks fail you must fix the issues before committing or bypass with `git commit --no-verify` (only for emergencies).
