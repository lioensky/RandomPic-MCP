# RandomPic MCP 服务器

这是一个基于Model Context Protocol (MCP)的服务器，允许AI通过MCP协议从 `moe.jitsu.top` API 获取随机图片。

## 功能特点

- 允许AI助手通过MCP协议调用 `moe.jitsu.top` API 获取随机图片。
- 支持多种图片分类 (`sort`)。
- 支持指定图片尺寸 (`size`)，但可能被某些API端点忽略。
- 支持返回JSON格式 (`type='json'`) 或直接进行302重定向。
- 支持一次获取多张图片 (`num`，仅当 `type='json'` 时有效)。
- 可选择使用 `/api/` 或 `/img/` 端点 (`useApiEndpoint`)。
- 默认返回 Markdown 格式的图片链接，方便AI直接展示。
- 可选支持返回图片的 Base64 编码数据 (`include_base64=true`)，允许 AI 直接“看到”图片内容（会显著增加 Token 消耗）。

## 系统要求

- Node.js v18.0.0 或更高版本

您可以通过以下命令验证Node.js安装：

```bash
node --version  # 应显示v18.0.0或更高版本
```

## 安装步骤

1. 克隆仓库：

```bash
git clone 本项目
```

2. 安装依赖：

```bash
npm install
```

3. 构建项目：

```bash
npm run build
```

## 配置说明

### MCP服务器配置

在您的MCP客户端（如 VS Code 扩展）的配置文件中添加或修改以下内容，以注册此服务器：

```json
{
  "mcpServers": {
    "random-pic-mcp-server": { // 使用新的服务器名称
      "command": "node",
      "args": ["路径/到/RandomPic-mcp-server/build/index.js"], // 确保路径正确
      "enabled": true // 确保服务器已启用
    }
    // ... 其他服务器配置
  }
}
```

**注意:**
- 将 `"路径/到/RandomPic-mcp-server/build/index.js"` 替换为您项目中 `build/index.js` 文件的实际绝对路径或相对路径（相对于MCP客户端的工作目录）。
- 无需配置API密钥。

## 使用方法

配置完成后，AI助手可以通过MCP协议调用此服务获取随机图片。服务提供了 `get_random_pic` 工具，接受以下参数：

- `sort` (可选, 数组): 图片分类。例如 `["r18", "pixiv"]`。默认为 `["all"]`。可选值: `"all"`, `"mp"`, `"pc"`, `"silver"`, `"furry"`, `"r18"`, `"pixiv"`, `"jitsu"`。
- `size` (可选, 字符串): 图片尺寸。依赖于 `sort` 的值，并且在 `useApiEndpoint=true` 时会被忽略。请参考 `moe.jitsu.top` API 文档。
- `type` (可选, 字符串): 返回格式。`"json"` 是推荐值，获取 R18 图片时必须为 `"json"`。默认为 302 重定向。
- `num` (可选, 整数): 获取图片的数量 (1-100)。仅当 `type='json'` 时有效。默认为 1。
- `useApiEndpoint` (可选, 布尔值): 是否使用 `/api/` 端点（忽略 `size` 参数，可能更快）。默认为 `false` (使用 `/img/` 端点)。
- `include_base64` (可选, 布尔值): 是否返回图片的 Base64 编码数据而不是 Markdown 链接。默认为 `false`。**注意：设置为 `true` 会显著增加 Token 消耗和处理时间。**

**返回示例 (content):**

**默认 (`include_base64: false`):**

```json
[
  {
    "type": "text",
    "text": "![Random Pic (r18)](https://i.pixiv.re/img-master/img/2022/04/19/08/02/55/97729768_p0_master1200.jpg)"
  }
]
```
]
```
AI 应该直接将 `text` 字段的内容输出到聊天窗口中以显示图片。

**当 `include_base64: true` 时:**

```json
[
  {
    "type": "image",
    "mimeType": "image/jpeg", // 或 image/png, image/gif 等
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAUA..." // 很长的 Base64 编码字符串
  }
  // 如果 num > 1, 可能有多个 image 对象
]
```
AI 可以直接处理 `data` 字段中的 Base64 图片数据（如果其模型支持）。

## 开发者工具

您可以使用MCP Inspector工具来测试服务器：

```bash
npm run inspector
```

## 许可证

请参阅项目仓库中的许可证文件。