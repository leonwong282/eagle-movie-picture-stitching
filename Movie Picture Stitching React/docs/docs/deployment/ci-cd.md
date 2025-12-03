# CI/CD Pipeline

Automate testing, building, and deployment of your Eagle plugin using GitHub Actions or other CI/CD platforms.

## GitHub Actions Workflow

### Complete CI Pipeline

```yaml title=".github/workflows/ci.yml"
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Type checking
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck

  # Linting
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint

  # Unit tests
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true

  # E2E tests
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # Build verification
  build:
    runs-on: ubuntu-latest
    needs: [typecheck, lint, test]
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7
```

### Release Workflow

```yaml title=".github/workflows/release.yml"
name: Release

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Package plugin
        run: |
          # Create release package
          mkdir -p release
          cp -r dist/* release/
          cp manifest.json release/
          cp -r _locales release/
          cp -r public/* release/
          
          # Transform manifest paths
          node -e "
            const fs = require('fs');
            const manifest = JSON.parse(fs.readFileSync('release/manifest.json', 'utf8'));
            if (manifest.main?.url) manifest.main.url = manifest.main.url.replace('dist/', '');
            if (manifest.logo) manifest.logo = manifest.logo.replace('public/', '');
            fs.writeFileSync('release/manifest.json', JSON.stringify(manifest, null, 2));
          "
          
          # Create zip
          cd release && zip -r ../plugin-${{ github.ref_name }}.zip .
      
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          files: plugin-${{ github.ref_name }}.zip
          generate_release_notes: true
```

## Automated Version Bumping

### Using semantic-release

```yaml title=".github/workflows/release-auto.yml"
name: Release (Automated)

on:
  push:
    branches: [main]

permissions:
  contents: write
  issues: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release
```

**Configuration:**
```json title="package.json"
{
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      ["@semantic-release/npm", { "npmPublish": false }],
      "@semantic-release/github"
    ]
  }
}
```

## Visual Regression in CI

### Playwright Visual Tests

```yaml title=".github/workflows/visual.yml"
name: Visual Regression

on:
  pull_request:
    branches: [main]

jobs:
  visual:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run visual tests
        run: npm run test:visual
      
      - name: Upload diff images
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diff
          path: |
            e2e/**/*-diff.png
            e2e/**/*-actual.png
          retention-days: 7
```

### Updating Visual Snapshots

```yaml title=".github/workflows/update-snapshots.yml"
name: Update Visual Snapshots

on:
  workflow_dispatch:
  push:
    branches:
      - 'update-snapshots'

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Update snapshots
        run: npm run test:visual -- --update-snapshots
      
      - name: Commit updated snapshots
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A e2e/**/*.png
          git diff --staged --quiet || git commit -m "chore: update visual snapshots"
          git push
```

## Documentation Deployment

### Deploy Docusaurus to GitHub Pages

```yaml title=".github/workflows/docs.yml"
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: docs/package-lock.json
      
      - name: Install dependencies
        working-directory: docs
        run: npm ci
      
      - name: Build docs
        working-directory: docs
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Matrix Testing

Test across multiple Node.js versions and operating systems:

```yaml title=".github/workflows/matrix.yml"
name: Matrix Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [18, 20, 22]
    
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
```

## Caching Strategies

### Cache node_modules

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # Automatic npm cache
```

### Cache Playwright Browsers

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
    
- name: Install Playwright browsers
  run: npx playwright install --with-deps
```

### Cache Build Output

```yaml
- name: Cache build
  uses: actions/cache@v4
  with:
    path: dist
    key: build-${{ github.sha }}
```

## Secrets Management

### Required Secrets

| Secret | Purpose |
|--------|---------|
| `GITHUB_TOKEN` | Automatic, for releases |
| `CODECOV_TOKEN` | Coverage reporting |

### Using Secrets

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
```

## Branch Protection Rules

Configure in GitHub repository settings:

1. **Settings → Branches → Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Required status checks:
     - `typecheck`
     - `lint`
     - `test`
     - `build`

## Workflow Badges

Add status badges to README:

```markdown
![CI](https://github.com/user/repo/workflows/CI/badge.svg)
![Coverage](https://codecov.io/gh/user/repo/branch/main/graph/badge.svg)
```

## Debugging CI Failures

### Enable Debug Logging

```yaml
- name: Debug step
  run: npm test
  env:
    DEBUG: '*'
    ACTIONS_STEP_DEBUG: true
```

### SSH into Runner

```yaml
- name: Setup tmate session
  if: failure()
  uses: mxschmitt/action-tmate@v3
  timeout-minutes: 15
```

### Artifact Upload on Failure

```yaml
- name: Upload logs on failure
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: debug-logs
    path: |
      npm-debug.log
      coverage/
      playwright-report/
```

## Best Practices

### 1. Fail Fast

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Quick checks first
        run: |
          npm run typecheck
          npm run lint
      
      - name: Slow tests after
        run: npm test
```

### 2. Minimize Job Dependencies

```yaml
# ❌ Bad: Sequential jobs
jobs:
  lint:
    ...
  test:
    needs: lint
  build:
    needs: test

# ✅ Good: Parallel where possible
jobs:
  lint:
    ...
  test:
    ...
  build:
    needs: [lint, test]  # Parallel lint + test
```

### 3. Use Concurrency

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### 4. Pin Action Versions

```yaml
# ❌ Bad: Using @master
- uses: actions/checkout@master

# ✅ Good: Using specific version
- uses: actions/checkout@v4
```

## Related

- [Deploy Script](./deploy-script.md) - Local deployment
- [Testing Overview](../testing/overview.md) - Test configuration
- [E2E Testing](../testing/e2e-testing.md) - Playwright setup
