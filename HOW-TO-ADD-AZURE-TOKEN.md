# How to Add Your Azure Deployment Token

## Quick Answer

You need to add your Azure deployment token as a **GitHub Secret** in your repository settings.

## Step-by-Step Instructions

### 1. Go to Your Repository Settings
1. Open your repository on GitHub: https://github.com/idusortus/auto-swipe-baby-test
2. Click on **Settings** (near the top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**

### 2. Add the Secret
1. Click the **New repository secret** button
2. Fill in the form:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210`
   - **Value**: Paste your Azure deployment token here
3. Click **Add secret**

### 3. Where to Find Your Azure Token

If you need to get your Azure deployment token:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Static Web App resource
3. On the **Overview** page, you'll find the deployment token
4. Click to copy it

**⚠️ IMPORTANT**: If your token was previously exposed (e.g., posted in an issue), **regenerate it first**:
- In Azure Portal → Your Static Web App → **Overview** → **Reset deployment token**
- Then use the new token

### 4. Verify It Works

After adding the secret:

1. Go to the **Actions** tab in your GitHub repository
2. Find any failed workflow run
3. Click **Re-run all jobs**
4. The deployment should now succeed ✅

## Troubleshooting

### The secret name must be EXACTLY:
```
AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210
```

Do not use a different name. The workflow file specifically looks for this name.

### Still Having Issues?

Check that:
- The secret name matches exactly (including underscores and numbers)
- You copied the complete token value from Azure (no extra spaces)
- Your Azure Static Web App is still active and not deleted

## Visual Guide

```
GitHub Repository
    └── Settings
        └── Secrets and variables
            └── Actions
                └── New repository secret
                    ├── Name: AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210
                    └── Value: <paste your token here>
```

---

**Note**: GitHub Secrets are encrypted and cannot be viewed after being added. They will appear as `***` in logs and settings.
