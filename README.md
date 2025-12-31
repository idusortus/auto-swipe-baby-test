# 👶 Baby Name Swiper

Allow users to use a Tinder-like swipe interface to sort through possible baby names!

## Features

- 🎴 **Swipe Interface** - Drag cards left to pass or right to like baby names
- 📱 **Mobile-Friendly** - Responsive design that works perfectly on phones and tablets
- 🚻 **Gender Filters** - Filter by Boy, Girl, or Whatever (all names)
- 📊 **Stats Tracking** - See how many names you've liked and how many remain
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
- Click **Start Over** when you've finished to reset and try again

## Dataset

Includes **110 popular baby names**:
- 50 Boy names
- 60 Girl names

Names are randomly shuffled each time you filter or reset.

## Technical Details

- Pure vanilla JavaScript - no frameworks or libraries required
- Touch and mouse event support for universal compatibility
- Smooth animations using CSS transitions
- Responsive design with mobile-first approach
- No backend, database, or authentication (Proof of Concept)

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
   - After deployment, Azure will automatically add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to your GitHub repository
   - The GitHub Actions workflow (`.github/workflows/azure-static-web-apps-deploy.yml`) will use this token automatically

3. **Automatic Deployment**:
   - Every push to the `main` branch will trigger an automatic deployment
   - Pull requests will create preview deployments
   - You can view deployment status in the "Actions" tab of your GitHub repository

4. **Access Your Site**:
   - After deployment, your site will be available at: `https://<your-app-name>.azurestaticapps.net`
   - You can also configure a custom domain in the Azure Portal

### Configuration Files
- `.github/workflows/azure-static-web-apps-deploy.yml` - GitHub Actions workflow for CI/CD
- `staticwebapp.config.json` - Azure Static Web Apps configuration (routing, headers, etc.)

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
