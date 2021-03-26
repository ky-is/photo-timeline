# photo-timeline

## Setup
1. [Create a repo from this template](https://github.com/ky-is/photo-timeline/generate)
2. [Deploy to Netlify](https://app.netlify.com/start) Publish directory: `site/.vitepress/dist`
3. [Enable Netlify Identity and Git Gateway](https://www.netlifycms.org/docs/add-to-your-site/#enable-identity-and-git-gateway)
4. [Install Netlify CLI and login](https://docs.netlify.com/cli/get-started/#installation)
```sh
npm install -g netlify-cli
netlify login
```
5. [Enable Netlify Large Media](https://docs.netlify.com/large-media/setup/)
```sh
brew install git-lfs
npm install -g netlify-cli
netlify link
netlify lm:setup
```
7. Replace all instances of `photo-timeline` with your branding
8. Commit and deploy!
6. Add content via CMS: https://YOUR_APP_NAME.netlify.app/admin/private/#/ (rename the `/admin/private/` directory to prevent access to your admin page if you allow open registration in Netlify Identity)
