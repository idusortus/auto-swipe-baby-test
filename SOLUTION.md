# Solution: Where to Put Your Azure Deployment Token

## Problem
The GitHub Actions workflows are failing because the Azure deployment token hasn't been added to GitHub Secrets.

## Solution Summary

**You need to add the token as a GitHub Secret.** Here's where:

### Quick Steps:
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add this secret:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210`
   - **Value**: Your Azure deployment token from Azure Portal

### Direct Links:
- **Add Secret**: https://github.com/idusortus/auto-swipe-baby-test/settings/secrets/actions/new
- **View Actions**: https://github.com/idusortus/auto-swipe-baby-test/actions

## Detailed Documentation

See these files for more information:
- **[ADD-SECRET-HERE.md](./ADD-SECRET-HERE.md)** - Quick reference with direct links
- **[HOW-TO-ADD-AZURE-TOKEN.md](./HOW-TO-ADD-AZURE-TOKEN.md)** - Complete step-by-step guide
- **[DEPLOYMENT-FIX.md](./DEPLOYMENT-FIX.md)** - Detailed deployment troubleshooting

## Important Notes

1. **Secret Name Must Be Exact**: The workflow file expects exactly `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210`

2. **Token Security**: If your token was exposed publicly (e.g., in an issue), regenerate it in Azure Portal first before adding it to GitHub

3. **Multiple Workflows**: This repository has two workflow files. The primary one uses the token name above. If the other workflow fails, you may also need to add `AZURE_STATIC_WEB_APPS_API_TOKEN` with the same token value.

4. **After Adding**: Re-run the failed workflow from the Actions tab

## Why This Approach?

- GitHub Secrets are encrypted and secure
- Secrets are masked in logs (shown as `***`)
- This is the standard way to provide credentials to GitHub Actions
- Secrets cannot be read after being added (only updated or deleted)

## Result

Once the secret is added, your workflows will be able to authenticate with Azure and deploy your app successfully. ✅
