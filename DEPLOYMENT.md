# Deployment

Public site:

```text
https://www.xiaozhonglvyou.com/
```

GitHub repository:

```text
https://github.com/kuangre123/xiaozhonglvyou-apps-site
```

GitHub Pages settings:

```text
Source: main branch, root folder
Custom domain: www.xiaozhonglvyou.com
HTTPS: enforced
```

Local verification from the workspace root:

```sh
bash scripts/verify-site.sh
```

This runs the static site audit, regenerates the Supabase Edge bundle, and verifies
the generated Edge assets match the source site before any deployment.

Supabase Edge deployment from the workspace root:

```sh
scripts/deploy-supabase-site.sh <supabase-project-ref>
```

The deploy script runs `bash scripts/verify-site.sh` before publishing the `site`
Edge function.

DNS at Aliyun:

```text
Host: www
Type: CNAME
Value: kuangre123.github.io
```

Verification commands:

```sh
curl -I https://www.xiaozhonglvyou.com/
curl -I http://www.xiaozhonglvyou.com/
curl https://www.xiaozhonglvyou.com/robots.txt
curl https://www.xiaozhonglvyou.com/sitemap.xml
```
