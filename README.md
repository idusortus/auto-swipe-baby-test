# 👶 Baby Name Swiper

Allow users to use a Tinder-like swipe interface to sort through possible baby names!

## 📋 Documentation

- **[CODE-REVIEW-SUMMARY.md](CODE-REVIEW-SUMMARY.md)** - Comprehensive code review with architecture analysis, UX improvements, and roadmap for database/API migration (1,300+ lines)
- **[AI-AGENT-CONTEXT.md](AI-AGENT-CONTEXT.md)** - Technical implementation guide for developers
- **[DEVELOPMENT-SUMMARY.md](DEVELOPMENT-SUMMARY.md)** - Project history and key decisions
- **[DEPLOYMENT-FIX.md](DEPLOYMENT-FIX.md)** - Azure deployment troubleshooting

## Features

- 🎴 **Swipe Interface** - Drag cards left to pass or right to like baby names
- 📱 **Mobile-Friendly** - Responsive design that works perfectly on phones and tablets
- 🚻 **Gender Filters** - Filter by Boy, Girl, or Whatever (all names)
- 📊 **Stats Tracking** - See how many names you've liked and how many remain
- 🔗 **Share Links** - Generate encoded shareable links to compare lists with your partner
- 🤝 **Partner Comparison** - Compare your picks with a partner's list and reveal matches
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 📦 **No Setup Required** - Pure HTML/CSS/JavaScript with no build tools

## Quick Start

1. Clone the repository
2. Open `index.html` in your web browser
3. Start swiping!

Or use a simple HTTP server:
```bash
python3 -m http.server 8080
# Then open http://localhost:8080 in your browser
```

## How to Use

- **Swipe Right** or click ❤️ to like a name
- **Swipe Left** or click ❌ to pass on a name
- Use the **filter buttons** at the top to show only Boy names, Girl names, or all names
- Track your progress with the **Liked** and **Remaining** counters
- Click **Done Choosing** when finished to see your favorites
- **Share Link** - Generate an encoded URL to share with your partner (keeps names secret!)
- **Compare Lists** - Paste your partner's link or enter names manually to find matches

## Dataset

Includes **110 popular baby names**:
- 50 Boy names
- 60 Girl names

Names are randomly shuffled each time you filter or reset.

## Sharing & Comparing Names

The app now supports **shareable encoded links** to compare baby name choices with your partner while maintaining the suspense!

### How It Works

1. **Swipe and Like**: Choose your favorite names by swiping through the list
2. **Generate Link**: Click the "🔗 Share Link" button to create an encoded URL
3. **Share Securely**: The link contains your choices in encoded format (names stay hidden!)
4. **Partner Opens**: Your partner opens the link and swipes through their own choices
5. **Compare**: Click "Compare Lists" and paste the shared link
6. **Reveal**: After a dramatic countdown, matching names are revealed! 🎉

### Sharing Options

- **🔗 Share Link**: Generate an encoded URL (recommended - keeps suspense!)
- **📧 Email**: Send an email with your encoded link
- **💬 Text**: Send an SMS with your encoded link
- **Manual Entry**: Still available as a backup option

The encoded links ensure **no spoilers** - names remain secret until both partners are ready to reveal matches!

## Technical Details

- Pure vanilla JavaScript - no frameworks or libraries required
- Touch and mouse event support for universal compatibility
- Smooth animations using CSS transitions
- Responsive design with mobile-first approach
- Client-side Base64 encoding for shareable links (no backend needed)
- URL parameter handling for automatic shared list detection
- Native Web Share API support with clipboard fallback

## Deployment to Azure

This project is configured for deployment to **Azure Static Web Apps**. 

### Prerequisites
1. An Azure account (create one at [azure.microsoft.com](https://azure.microsoft.com))
2. A GitHub repository with this code

### Setup Steps

1. **Create an Azure Static Web App**:
   - Go to the [Azure Portal](https://portal.azure.com)
   - Click "Create a resource" → Search for "Static Web App"
   - Click "Create"
   - Fill in the details:
     - Resource group: Create new or use existing
     - Name: Choose a name for your app
     - Region: Choose closest to your users
     - Source: Select "GitHub"
     - Sign in to GitHub and authorize Azure
     - Select your organization, repository, and branch (usually `main`)
     - Build presets: Select "Custom"
     - App location: `/`
     - API location: (leave empty)
     - Output location: (leave empty)
   - Click "Review + create" → "Create"

2. **Configure the API Token**:
   - After deployment, Azure will automatically add deployment tokens to your GitHub repository
   - For the specific workflow `azure-static-web-apps-agreeable-field-0ababe210.yml`, add the secret `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210`
   - See the Troubleshooting section below if deployments fail due to missing secrets

3. **Automatic Deployment**:
   - Every push to the `main` branch will trigger an automatic deployment
   - Pull requests will create preview deployments
   - You can view deployment status in the "Actions" tab of your GitHub repository

4. **Access Your Site**:
   - After deployment, your site will be available at: `https://<your-app-name>.azurestaticapps.net`
   - You can also configure a custom domain in the Azure Portal

### Configuration Files
- `.github/workflows/azure-static-web-apps-agreeable-field-0ababe210.yml` - Deployment workflow for the specific Azure Static Web App instance
- `.github/workflows/azure-static-web-apps-deploy.yml` - Alternative workflow using standard secret name (AZURE_STATIC_WEB_APPS_API_TOKEN)
- `staticwebapp.config.json` - Azure Static Web Apps configuration (routing, headers, etc.)

**Note:** The instance-specific workflow uses the secret `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210`, which corresponds to your Azure Static Web App deployment.

### Troubleshooting Deployment Issues

If you're experiencing deployment failures, verify that the Azure deployment token is configured as a GitHub secret:

1. **Check if the secret exists:**
   - Go to repository **Settings** → **Secrets and variables** → **Actions**
   - Look for a secret named `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210`

2. **Add the secret if missing:**
   - In repository **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210`
   - Value: Copy the deployment token from Azure Portal → Your Static Web App → **Overview** page
   - Click **Add secret**

3. **Security Best Practice:**
   - If your deployment token has been exposed (e.g., posted in an issue), regenerate it immediately
   - Go to Azure Portal → Your Static Web App → **Overview** → **Reset deployment token**
   - Update the GitHub secret with the new token value

4. **Verify workflow configuration:**
   - The workflow file should reference: `${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210 }}`
   - Check `.github/workflows/azure-static-web-apps-agreeable-field-0ababe210.yml`

Once the secret is configured, re-run the failed workflow or trigger a new deployment by pushing changes to the `main` branch.

## Browser Compatibility

Works in all modern browsers that support:
- CSS Grid and Flexbox
- Touch events
- ES6 JavaScript

## Screenshots

### Desktop View
![Desktop View](https://github.com/user-attachments/assets/37fb065f-3fed-4de1-9126-8f2030d04a11)

### Mobile View
![Mobile View](https://github.com/user-attachments/assets/be5dfee7-ff0c-42e8-b2d1-3ae3086c24fc)

## Future Enhancements

Potential additions for future versions:
- Save liked names to local storage
- Export liked names list
- Add more names to the database
- Name details and meanings
- User authentication
- Backend API integration
- Share liked names with partner
