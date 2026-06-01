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
