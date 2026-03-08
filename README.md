# wechat-h5-game-demo

一个适合手机浏览器 / 微信内打开的静态 H5 小游戏 Demo。

## 玩法

- 点击屏幕或按钮，让小鱼上浮
- 躲开绿色管道
- 每通过一组管道得 1 分
- 本地会自动保存最高分

## 本地运行

直接双击 `index.html` 就能玩。

如果想更像正式托管环境，也可以在项目目录起一个静态服务器，例如：

```bash
python3 -m http.server 8080
```

然后打开：`http://localhost:8080`

## GitHub Pages 部署

仓库已经带了 `.github/workflows/deploy.yml`。

推到 GitHub 后：

1. 打开仓库 Settings → Pages
2. Build and deployment 选择 **GitHub Actions**
3. 推送到 `main` 分支后会自动部署

## 适配说明

- 纯静态 HTML / CSS / JS
- 无依赖、无构建工具
- 触控优先，适合微信 WebView 演示
- 第一版故意不接微信授权 / JSSDK，避免部署链路过重
