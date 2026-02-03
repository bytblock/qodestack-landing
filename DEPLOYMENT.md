# Netlify Deployment Guide

## Quick Deploy Steps

1. **Push to Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Qodestack landing page"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Choose your repository
   - Netlify auto-detects Next.js settings
   - Click "Deploy site"

3. **Configure Contact Form**
   - After deployment, go to "Forms" in Netlify dashboard
   - Set up email notification to `hello@qodestack.com`
   - Form submissions will appear in the Forms tab

4. **Add Custom Domain (Optional)**
   - In Netlify dashboard: "Domain settings" → "Add custom domain"
   - Follow DNS configuration instructions
   - SSL certificate is automatically provisioned

## Build Settings (Auto-detected)

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20

## Testing Locally

```bash
# Install dependencies
npm install

# Development mode
npm run dev
# Visit http://localhost:3000

# Production build (test before deploying)
npm run build
npm start
```

## Troubleshooting

### Forms not working
- Ensure `public/contact-form.html` exists
- Check Netlify Forms tab for submissions
- Verify form has `data-netlify="true"` attribute

### Build fails
- Check Node version is 20+
- Clear `.next` directory and rebuild
- Verify all dependencies are installed

### 404 errors
- `_redirects` file should be in `public/` directory
- Netlify should handle SPA routing automatically

## Post-Deployment Checklist

- [ ] Test all sections scroll smoothly
- [ ] Submit test form and verify receipt
- [ ] Check mobile responsiveness
- [ ] Verify SEO metadata in browser
- [ ] Test on different browsers
- [ ] Set up email notifications for form submissions
- [ ] Configure custom domain (if applicable)
- [ ] Add site to Google Search Console

## Support

For deployment issues, contact Netlify support or email hello@qodestack.com
