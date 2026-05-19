# TEco Lab — 韩语播客学习 App

## 本地运行

```bash
npm install
npm run dev
```

## 部署到 Vercel（3步）

### 方法一：拖拽部署（最简单）

1. 运行 `npm install && npm run build`
2. 打开 https://vercel.com/new
3. 将 `dist/` 文件夹直接拖入页面
4. 点击 Deploy — 完成！

### 方法二：GitHub 自动部署（推荐长期维护）

1. 将此文件夹推送到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git remote add origin https://github.com/你的用户名/teco-lab.git
   git push -u origin main
   ```
2. 打开 https://vercel.com/new
3. 选择 "Import Git Repository"，选中刚推送的仓库
4. Framework 选 **Vite**，其余默认
5. 点击 Deploy

之后每次 `git push`，Vercel 自动重新部署。

## 项目结构

```
teco-lab/
├── index.html          # 入口 HTML
├── vercel.json         # Vercel SPA 路由配置
├── vite.config.js      # Vite 配置
├── tailwind.config.js  # Tailwind 配置
├── package.json
└── src/
    ├── main.jsx        # React 入口
    ├── App.jsx         # 主应用（所有页面）
    └── index.css       # 全局样式
```
