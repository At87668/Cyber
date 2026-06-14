# MxSpace API v3 扫描结果文档

> 扫描时间：2026-06-14
> 后端路径：`core/apps/core/`
> 前端路径：`apps/web/`

---

## 1. 总体架构

### 1.1 路由前缀

- 开发环境：无前缀（如 `GET /posts`）
- 生产环境：`/api/v3`（如 `GET /api/v3/posts`）
- 版本常量：`core/apps/core/src/app.config.ts` → `export const API_VERSION = 3`
- 装饰器：`@ApiController('posts')` 自动拼接前缀

### 1.2 响应信封（v3）

#### 成功信封

```ts
// core/apps/core/src/common/response/envelope.types.ts
interface SuccessEnvelope<T> {
  data: T
  meta?: ResponseMeta
}
```

#### 错误信封

```ts
interface ErrorEnvelope {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}
```

#### Meta 结构

```ts
// core/apps/core/src/common/response/meta.types.ts
interface ResponseMeta {
  pagination?: { page: number; size: number; total: number; totalPages: number }
  view?: string
  translation?: EntryTranslation | Record<string, EntryTranslation>
  interaction?: InteractionMeta | Record<string, InteractionMeta>
  enrichments?: Record<string, EnrichmentResult>
  related?: RelatedRef[]
  articles?: Record<string, RelatedRef>
  insights?: InsightsMeta
  summary?: SummaryMeta
}
```

#### meta 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `pagination` | `{ page, size, total, totalPages }` | 分页信息（v3 用 `page`/`totalPages`，v2 用 `currentPage`/`totalPage`） |
| `view` | `string` | 浏览次数 |
| `translation` | 单对象或 Record<id, 对象> | 翻译信息（`isTranslated`, `sourceLang`, `targetLang`, `availableTranslations`） |
| `interaction` | 单对象或 Record<id, 对象> | 交互信息（`isLiked`, `likeCount`, `readCount`） |
| `enrichments` | Record<url, EnrichmentResult> | URL 富文本卡片数据 |
| `related` | `RelatedRef[]` | 相关文章引用 |
| `articles` | Record<id, RelatedRef> | 文章引用映射 |
| `insights` | `{ hasInLocale: boolean }` | AI 洞察元数据 |
| `summary` | `{ id, text, lang, createdAt }` | AI 摘要 |

---

## 2. 后端控制器端点扫描

### 2.1 ack — ACK 确认

控制器：`core/apps/core/src/modules/ack/ack.controller.ts`
前缀：`/api/v3/ack`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| POST | `/` | No | 发送阅读/点赞确认（200） |

### 2.2 activity — 活动

控制器：`core/apps/core/src/modules/activity/activity.controller.ts`
前缀：`/api/v3/activity`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/recent` | No | 最近活动 |
| GET | `/rooms` | No | 在线房间信息 |
| GET | `/presence` | No | 在线状态 |
| PATCH | `/presence` | No | 更新在线状态 |
| GET | `/top-readings` | No | 热门阅读排行 |
| GET | `/last-year/publication` | No | 去年发布统计 |
| GET | `/:type` | No | 按类型获取活动 |
| DELETE | `/:type/:id` | Auth | 删除活动 |
| POST | `/like` | No | 点赞 |
| GET | `/reading/rank` | No | 阅读排名 |
| GET | `/reading/top` | No | 阅读排行 |

### 2.3 aggregate — 聚合

控制器：`core/apps/core/src/modules/aggregate/aggregate.controller.ts`
前缀：`/api/v3/aggregate`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 聚合数据（主题配置、SEO、用户、URL） |
| GET | `/top/:count` | No | 最新 N 条（笔记+文章） |
| GET | `/latest` | No | 最新动态 |
| GET | `/timeline` | No | 时间线数据 |
| GET | `/feed` | No | RSS 聚合数据 |
| GET | `/read-and-like-count/:type` | No | 阅读和点赞统计 |
| GET | `/read-and-like-count` | No | 全部阅读和点赞统计 |

### 2.4 ai — AI

控制器：`core/apps/core/src/modules/ai/ai.controller.ts`
前缀：`/api/v3/ai`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/registry/models` | No | 获取模型列表 |
| POST | `/completions` | Auth | AI 补全 |

### 2.5 auth — 认证

控制器：`core/apps/core/src/modules/auth/auth.controller.ts`
前缀：`/api/v3/auth`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/token` | Auth | 获取/验证 token |
| POST | `/token` | Auth | 创建 token |
| DELETE | `/token/:id` | Auth | 删除 token |
| GET | `/session` | No | 获取当前 session |
| GET | `/providers` | No | 获取 OAuth 提供者 |
| POST | `/login` | No | 登录 |
| POST | `/logout` | No | 登出 |
| GET | `/callback/:provider` | No | OAuth 回调 |

### 2.6 backup — 备份

控制器：`core/apps/core/src/modules/backup/backup.controller.ts`
前缀：`/api/v3/backup`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | Auth | 获取备份列表 |
| POST | `/` | Auth | 创建备份 |
| DELETE | `/:id` | Auth | 删除备份 |
| POST | `/restore/:id` | Auth | 恢复备份 |

### 2.7 categories — 分类

控制器：`core/apps/core/src/modules/category/category.controller.ts`
前缀：`/api/v3/categories`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 获取分类列表（支持 `?ids` 参数批量查询） |
| GET | `/:slug` | No | 按 slug 获取分类 |
| POST | `/` | Auth | 创建分类 |
| PATCH | `/:id` | Auth | 更新分类 |
| DELETE | `/:id` | Auth | 删除分类 |
| PUT | `/reorder` | Auth | 重排分类 |

### 2.8 comments — 评论

控制器：`core/apps/core/src/modules/comment/comment.controller.ts`
前缀：`/api/v3/comments`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/ref/:refId` | No | 按 refId 获取评论列表 |
| GET | `/thread/:id` | No | 获取评论回复线程 |
| POST | `/` | No | 创建评论（需 idempotence） |
| DELETE | `/:id` | Auth | 删除评论 |
| PATCH | `/:id` | Auth | 更新评论状态 |
| POST | `/batch` | Auth | 批量操作 |
| GET | `/admin` | Auth | 管理端列表 |
| GET | `/admin/counts` | Auth | 评论计数统计 |
| GET | `/admin/authors` | Auth | 作者活动查询 |
| GET | `/admin/source-candidates` | Auth | 来源候选查询 |
| GET | `/uploads/config` | No | 上传配置 |

### 2.9 enrichment — 富文本/链接卡片

控制器：`core/apps/core/src/modules/enrichment/enrichment.controller.ts`
前缀：`/api/v3/enrichment`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/resolve` | No | 解析 URL 的富文本数据 |
| GET | `/admin/list` | Auth | 管理端列表 |
| GET | `/admin/capture/list` | Auth | 捕获列表 |
| POST | `/admin/probe` | Auth | 探测 URL |
| DELETE | `/admin/:id` | Auth | 删除富文本记录 |

### 2.10 files/objects — 文件管理

控制器：`core/apps/core/src/modules/file/file.controller.ts`
前缀：`/api/v3/objects` 或 `/api/v3/files`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | Auth | 文件列表 |
| POST | `/upload` | Auth | 上传文件 |
| DELETE | `/:id` | Auth | 删除文件 |
| PATCH | `/:id` | Auth | 重命名 |
| POST | `/batch` | Auth | 批量操作 |
| GET | `/orphan` | Auth | 孤儿文件 |
| GET | `/comment-uploads` | No | 评论上传配置 |

### 2.11 health — 健康检查

控制器：`core/apps/core/src/modules/health/health.controller.ts`
前缀：`/api/v3/health`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 健康检查（返回 `{ ok: true }`） |
| GET | `/email/test` | Auth | 测试邮件发送 |

### 2.12 links/friends — 友情链接

控制器：`core/apps/core/src/modules/link/link.controller.ts`
前缀：`/api/v3/links` 和 `/api/v3/friends`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 链接列表（分页） |
| GET | `/all` | No | 所有可用链接 |
| GET | `/audit` | No | 是否可以申请 |
| POST | `/audit` | No | 申请友情链接 |
| PATCH | `/audit/:id` | Auth | 批准链接 |
| GET | `/state` | Auth | 链接计数 |

### 2.13 notes — 笔记

控制器：`core/apps/core/src/modules/note/note.controller.ts`
前缀：`/api/v3/notes`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 笔记列表（分页） |
| GET | `/latest` | No | 最新笔记 |
| GET | `/nid/:nid` | No | 按 nid 获取笔记 |
| GET | `/:date/:slug` | No | 按日期+slug 获取 |
| POST | `/` | Auth | 创建笔记 |
| PATCH | `/:id` | Auth | 更新笔记 |
| DELETE | `/:id` | Auth | 删除笔记 |
| GET | `/list/:topicId` | No | 按 topic 获取列表 |
| GET | `/topics/:slug` | No | 按 topic slug 获取 |
| PUT | `/:id/pin` | Auth | 置顶/取消置顶 |
| PATCH | `/:id/publish` | Auth | 发布/取消发布 |

### 2.14 owner/user — 博主信息

控制器：`core/apps/core/src/modules/owner/owner.controller.ts`
前缀：`/api/v3/owner` 和 `/api/v3/user`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 获取博主信息 |
| PATCH | `/` | Auth | 更新博主信息 |
| GET | `/allow-login` | No | 允许登录方式 |
| GET | `/check_logged` | No | 检查是否已登录 |
| GET | `/check_token_valid` | No | 检查 token 有效性 |

### 2.15 pages — 独立页面

控制器：`core/apps/core/src/modules/page/page.controller.ts`
前缀：`/api/v3/pages`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 页面列表 |
| GET | `/:slug` | No | 按 slug 获取页面 |
| POST | `/` | Auth | 创建页面 |
| PATCH | `/:id` | Auth | 更新页面 |
| DELETE | `/:id` | Auth | 删除页面 |
| PUT | `/reorder` | Auth | 重排页面 |

### 2.16 polls — 投票

控制器：`core/apps/core/src/modules/poll/poll.controller.ts`
前缀：`/api/v3/polls`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 批量获取投票状态 |
| GET | `/:pollId` | No | 获取单个投票 |
| POST | `/:pollId` | No | 提交投票 |

### 2.17 posts — 文章

控制器：`core/apps/core/src/modules/post/post.controller.ts`
前缀：`/api/v3/posts`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 文章列表（分页，`?page`, `?size`, `?year`, `?sortBy`, `?sortOrder`, `?categoryIds`, `?lang`） |
| GET | `/latest` | No | 最新文章 |
| GET | `/:idOrCategory/:slug` | No | 按分类+slug 获取文章（支持 `?lang`, `?prefer`） |
| GET | `/:id` | No | 按 ID 获取文章 |
| POST | `/` | Auth | 创建文章 |
| PATCH | `/:id` | Auth | 更新文章 |
| DELETE | `/:id` | Auth | 删除文章 |
| PUT | `/:id/pin` | Auth | 置顶/取消置顶 |
| PATCH | `/:id/publish` | Auth | 发布/取消发布 |
| GET | `/get-url/:slug` | No | 获取完整 URL |

### 2.18 projects — 项目

控制器：`core/apps/core/src/modules/project/project.controller.ts`
前缀：`/api/v3/projects`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 项目列表（分页） |
| GET | `/all` | No | 所有项目 |
| GET | `/:id` | No | 获取单个项目 |
| POST | `/` | Auth | 创建项目 |
| PATCH | `/:id` | Auth | 更新项目 |
| DELETE | `/:id` | Auth | 删除项目 |

### 2.19 readers — 读者管理

控制器：`core/apps/core/src/modules/reader/reader.controller.ts`
前缀：`/api/v3/readers`（需 Auth）

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | Auth | 读者列表 |
| PATCH | `/:id` | Auth | 更新读者信息 |
| POST | `/:id/ban` | Auth | 封禁读者 |

### 2.20 recently/shorthand — 最近动态

控制器：`core/apps/core/src/modules/recently/recently.controller.ts`
前缀：`/api/v3/recently` 和 `/api/v3/shorthand`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/latest` | No | 最新一条 |
| GET | `/all` | No | 所有动态 |
| GET | `/` | No | 分页列表（`?before`, `?after`, `?size`） |
| GET | `/:id` | No | 按 ID 获取 |
| POST | `/` | Auth | 创建动态 |
| PUT | `/:id` | Auth | 更新动态 |
| DELETE | `/:id` | Auth | 删除动态 |
| POST | `/:id/attitude` | Auth | 设置态度 |

### 2.21 says — 说说

控制器：`core/apps/core/src/modules/say/say.controller.ts`
前缀：`/api/v3/says`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 说说列表（分页） |
| GET | `/all` | No | 所有说说 |
| GET | `/:id` | No | 获取单条 |
| POST | `/` | Auth | 创建 |
| PUT | `/:id` | Auth | 更新 |
| DELETE | `/:id` | Auth | 删除 |

### 2.22 search — 搜索

控制器：`core/apps/core/src/modules/search/search.controller.ts`
前缀：`/api/v3/search`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 搜索 |
| POST | `/rebuild` | Auth | 重建索引 |
| POST | `/rebuild/:refType` | Auth | 按类型重建索引 |
| GET | `/admin` | Auth | 管理端搜索 |

### 2.23 serverless — Serverless 函数

控制器：`core/apps/core/src/modules/serverless/serverless.controller.ts`
前缀：`/api/v3/serverless` 或 `/api/v3/fn`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/types` | Auth | 获取类型声明 |
| GET | `/logs/:id` | Auth | 调用日志 |
| ALL | `/:id` | No | 执行函数 |

### 2.24 snippets — 代码片段

控制器：`core/apps/core/src/modules/snippet/snippet.controller.ts`
前缀：`/api/v3/snippets`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | Auth | 列表（分页） |
| POST | `/` | Auth | 创建 |
| POST | `/import` | Auth | 批量导入 |
| PUT | `/:id` | Auth | 更新 |
| DELETE | `/:id` | Auth | 删除 |
| GET | `/:reference/:name` | No | 按 reference+name 获取 |

### 2.25 subscribe — 订阅

控制器：`core/apps/core/src/modules/subscribe/subscribe.controller.ts`
前缀：`/api/v3/subscribe`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/status` | No | 订阅状态 |
| GET | `/` | Auth | 订阅列表（分页） |
| POST | `/` | No | 创建订阅 |
| DELETE | `/` | Auth | 取消订阅 |
| POST | `/batch` | Auth | 批量取消 |

### 2.26 topics — 话题/系列

控制器：`core/apps/core/src/modules/topic/topic.controller.ts`
前缀：`/api/v3/topics`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/` | No | 话题列表（分页） |
| GET | `/all` | No | 所有话题 |
| GET | `/:slug` | No | 按 slug 获取 |
| POST | `/` | Auth | 创建 |
| PATCH | `/:id` | Auth | 更新 |
| DELETE | `/:id` | Auth | 删除 |
| PUT | `/reorder` | Auth | 重排 |

### 2.27 server-time — 服务器时间

控制器：`core/apps/core/src/modules/server-time/server-time.controller.ts`
前缀：`/api/v3/`

| 方法 | 路由 | Auth | 说明 |
|------|------|------|------|
| GET | `/server-time` | No | 返回服务器时间（RawResponse） |

### 2.8 其他模块（无前端直接调用或纯内部）

| 模块 | 说明 |
|------|------|
| configs | 配置管理（无独立 controller） |
| cron-task | 定时任务 |
| debug | 调试工具 |
| dependency | 依赖检查 |
| draft | 草稿管理 |
| feed | RSS/Atom feed（`@Controller()` 无 ApiController） |
| helper | 业务辅助 |
| init | 初始化 |
| markdown | Markdown 渲染 |
| meta-preset | Meta 预设 |
| option | 选项管理（无独立 controller） |
| pageproxy | Admin 页面代理 |
| render | EJS 渲染 |
| sitemap | Sitemap |
| slug-tracker | Slug 追踪 |
| task | 任务管理 |
| update | 更新检查 |
| webhook | Webhook 管理 |

---

## 3. api-client 前端映射

### 3.1 api-client 版本

- web 依赖：`@mx-space/api-client` `2.3.0`（npm 发布版）
- core 包版本：`5.3.1`（本地开发版）
- `./legacy` 子路径导出（v2↔v3 适配器）：**仅 v5.x 可用**

### 3.2 Controller → api-client 映射

| api-client Controller | 前缀 | 方法 |
|---|---|---|
| `PostController` | `posts` | `getList`, `getPost`, `getLatest`, `getFullUrl` |
| `NoteController` | `notes` | `getList`, `getNoteByNid`, `getNoteBySlug`, `getLatest` |
| `PageController` | `pages` | `getList`, `getBySlug` |
| `CategoryController` | `categories` | `getCategories` |
| `AggregateController` | `aggregate` | `getAggregateData`, `getTop`, `getLatest` |
| `CommentController` | `comments` | `getByRefId`, `getThread` |
| `RecentlyController` | `recently/shorthand` | `getAll`, `getById` |
| `LinkController` | `links/friends` | `getAll`, `canApplyLink` |
| `ActivityController` | `activity` | `getRoomsInfo`, `getRecentActivities` |
| `OwnerController` | `owner/user` | `getOwnerInfo`, `checkTokenValid`, `getAllowLogin` |
| `SubscribeController` | `subscribe` | `checkStatus` |
| `AckController` | `ack` | `read` |
| `TopicController` | `topics` | `getTopicBySlug` |
| `SearchController` | `search` | `search` |
| `SayController` | `says` | — |
| `ProjectController` | `projects` | — |
| `SnippetController` | `snippets` | — |
| `PollController` | `polls` | — |
| `EnrichmentController` | `enrichment` | `resolve` |
| `AiController` | `ai` | — |
| `AuthController` | `auth` | — |
| `ServerlessController` | `serverless/fn` | — |
| `FileController` | `objects/files` | — |

---

## 4. 前端当前修改状态

### 4.1 已完成的修改

| 文件 | 修改内容 |
|------|----------|
| `apps/web/src/constants/env.ts` | `API_URL` 默认值从 `/api/v2` 改为 `/api/v3` |
| `apps/web/src/lib/fetch/shared.ts` | 改用 `createClient` + `transformResponse: legacyTransformResponse` 处理 v3 信封 → v2 形状 |
| `apps/web/src/lib/request.shared.ts` | 错误处理支持 v3 `{ error: { code, message, details? } }` 格式 |
| `apps/web/.env.template` | 默认 `NEXT_PUBLIC_API_URL` 更新为 v3 |
| 所有 `.$serialized` 引用 | 已全部移除（13 处） |
| `apps/web/src/components/ui/rich-content/LexicalContent.tsx` | mx-space 适配器 `/api/v2` → `/api/v3` |

### 4.2 关键文件路径

| 文件 | 作用 |
|------|------|
| `apps/web/src/constants/env.ts` | API_URL 配置 |
| `apps/web/src/lib/fetch/shared.ts` | apiClient 创建、fetch adapter、v3→v2 转换 |
| `apps/web/src/lib/fetch/fetch.server.ts` | 服务端 fetch 实例 + apiClient |
| `apps/web/src/lib/fetch/fetch.client.ts` | 客户端 fetch 实例 + apiClient |
| `apps/web/src/lib/request.ts` | 统一 re-export |
| `apps/web/src/lib/request.shared.ts` | 错误信息提取 |
| `apps/web/src/lib/request.server.ts` | SSR/预渲染 fetch 工具 |
| `apps/web/src/queries/definition/*.ts` | React Query 定义 |

---

## 5. v2 → v3 差异速查表

| 方面 | v2 | v3 |
|------|----|----|
| 路由前缀 | `/api/v2` | `/api/v3` |
| 响应结构 | 直接数据对象 | `{ data, meta? }` 信封 |
| 错误结构 | `{ message }` | `{ error: { code, message, details? } }` |
| 分页字段 | `currentPage`, `totalPage` | `page`, `totalPages` |
| `sortBy` 参数 | `created`, `modified` | `createdAt`, `modifiedAt` |
| 翻译信息 | 在模型字段上 | 在 `meta.translation` 中 |
| 交互信息 | 在模型字段上 | 在 `meta.interaction` 中 |
| `isLiked`/`likeCount` | 直接在文章上 | `meta.interaction[id]` |
| Wire 格式 | camelCase | snake_case（后端自动转换） |

---

## 6. 后续注意事项

1. **api-client 版本**：当前 web 使用 `2.3.0`（npm），如果要直接使用 `./legacy` 子路径导出，需要升级到本地 `5.3.1` 或更新的 npm 版本
2. **enrichment 模块**：v3 新增了 enrichment 系统（链接卡片 OG 抓取），替代了之前的 page-proxy 方案
3. **AI 模块**：v3 集成了 AI 翻译、摘要、洞察功能，通过 `meta.translation`、`meta.insights`、`meta.summary` 返回
4. **内容格式**：v3 支持 `markdown` 和 `lexical` 两种内容格式，通过 `contentFormat` 字段区分
5. **翻译系统**：v3 的翻译不再通过模型字段直接暴露，而是通过 `meta.translation` 和 `meta.articles` 返回
