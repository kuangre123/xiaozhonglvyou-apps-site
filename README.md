# Summer Chen Apps site

Static international portfolio site for `www.xiaozhonglvyou.com`.

Hosted with GitHub Pages from the `main` branch root.

Local verification from the workspace root:

```sh
bash scripts/verify-site.sh
```

Supabase Edge deployment from the workspace root:

```sh
scripts/deploy-supabase-site.sh <supabase-project-ref>
```

Public URLs:

- https://www.xiaozhonglvyou.com/
- https://kuangre123.github.io/xiaozhonglvyou-apps-site/

DNS:

```text
@ A 185.199.108.153
@ A 185.199.109.153
@ A 185.199.110.153
@ A 185.199.111.153
www CNAME kuangre123.github.io
```

The apex `@` records are required for Google Search Console checks against
`https://xiaozhonglvyou.com/robots.txt`. The canonical customer URL remains
`https://www.xiaozhonglvyou.com/`.
