# Deployment Fix for Issue #6

## Current Status

✅ **Documentation Added**: Updated README with troubleshooting steps
⚠️ **Action Required**: GitHub secret must be added manually by repository administrator

## Why Manual Action is Required

GitHub secrets cannot be added programmatically through the GitHub API without specific elevated permissions. This is a security feature to protect sensitive credentials.

## Steps to Fix the Deployment Issue

### Option 1: Using GitHub Web Interface (Recommended)

1. Navigate to your repository settings
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the following details:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210`
   - **Secret**: Generate a new token from Azure Portal (see Security Note below)
5. Click **Add secret**

### Option 2: Using GitHub CLI (If authenticated)

```bash
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210 \
  --repo OWNER/REPOSITORY
```

You'll be prompted to paste the secret value.

## Important Security Note

⚠️ **The token in Issue #6 has been publicly exposed.** Before using it:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Static Web App resource
3. Go to **Overview** → **Reset deployment token**
4. Copy the new token and use it instead of the exposed one

## After Adding the Secret

1. Go to the **Actions** tab
2. Find the failed workflow run
3. Click **Re-run all jobs**
4. The deployment should now succeed

## Verification

To confirm the secret is properly configured:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You should see `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210` in the list
3. The value will be masked (shown as `***`)

## Technical Details

The GitHub Actions workflow at `.github/workflows/azure-static-web-apps-agreeable-field-0ababe210.yml` references this secret:

```yaml
azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210 }}
```

Once the secret is available, the Azure Static Web Apps deployment action will authenticate successfully and deploy your application.

---

**Need Help?** If you encounter any issues after adding the secret, please comment on Issue #6.
