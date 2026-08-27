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

After GitHub Pages has deployed a push, verify that the public home page and its
analytics scripts match the local release:

```sh
node scripts/audit-live-analytics-parity.mjs
```

This online check is intentionally separate from `verify-site.sh`, so offline
build verification does not depend on DNS or the public host.

Supabase Edge deployment from the workspace root:

```sh
scripts/deploy-supabase-site.sh <supabase-project-ref>
```

The deploy script runs `bash scripts/verify-site.sh` before publishing the `site`
Edge function.

DNS at Aliyun:

```text
Host: @
Type: A
Value: 185.199.108.153

Host: @
Type: A
Value: 185.199.109.153

Host: @
Type: A
Value: 185.199.110.153

Host: @
Type: A
Value: 185.199.111.153

Host: www
Type: CNAME
Value: kuangre123.github.io
```

Do not keep any other `@` A record for this GitHub Pages site. A stale apex
record such as `28.0.0.7` makes Google Search Console unable to fetch
`https://xiaozhonglvyou.com/robots.txt`, even when
`https://www.xiaozhonglvyou.com/robots.txt` is healthy.

Verification commands:

```sh
dig xiaozhonglvyou.com A +short
dig www.xiaozhonglvyou.com CNAME +short
curl -I https://xiaozhonglvyou.com/robots.txt
curl -I https://www.xiaozhonglvyou.com/
curl -I http://www.xiaozhonglvyou.com/
curl https://www.xiaozhonglvyou.com/robots.txt
curl https://www.xiaozhonglvyou.com/sitemap.xml
node scripts/audit-search-console-robots.mjs
```

If DNS returns the four GitHub Pages IPs but
`curl -I https://xiaozhonglvyou.com/robots.txt` still fails with a certificate
name mismatch, the remaining blocker is GitHub Pages HTTPS provisioning for the
apex domain. Open the GitHub repository settings:

```text
Settings > Pages > Custom domain
```

Confirm the custom domain is `www.xiaozhonglvyou.com`, click Save, then wait for
the DNS check and certificate provisioning to finish. If it stays stuck after
DNS has propagated, remove the custom domain, save, re-enter
`www.xiaozhonglvyou.com`, save again, and wait for GitHub to issue the
certificate. Keep "Enforce HTTPS" enabled once available.
