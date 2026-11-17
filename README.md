# Mr.Dhole（豺狼先生）的小站

[打开网站](https://dhole-wolf.github.io/) · [修改中文文字](https://github.com/dhole-wolf/dhole-wolf.github.io/edit/main/_data/zh.yml) · [新建随笔](https://github.com/dhole-wolf/dhole-wolf.github.io/new/main/_posts)

## 修改主页文字

1. 打开上方“修改中文文字”。
2. 每一项前面都有中文说明。只改冒号后面的文字，保留左侧名称。
3. 点击 **Commit changes…**，再确认 **Commit changes**，提交到 `main`。
4. GitHub Pages 构建成功后，刷新网站即可看到修改。可以在仓库的 **Actions** 中查看发布进度。

例如：

```yaml
# 开场 · 开场大标题
"home.greeting": "今天想写点什么？"

# 关于我 · 正文
"about.body": |-
  第一段，写点自己的事。

  第二段，慢慢写。
```

多行正文要保留行首两个空格。英文文字在 [_data/en.yml](_data/en.yml)。中文和英文分别编辑，不会自动翻译。

## 写一篇随笔

1. 打开上方“新建随笔”。
2. 文件名填写 `年-月-日-短名字.md`，例如 `2026-11-17-first-note.md`；日期改成实际发布日期。
3. 复制下面的内容，替换标题和正文。
4. **Commit changes… → Commit changes**。文章会出现在「闲谈」中。

```markdown
---
title: "随笔标题"
category: talk
---

从这里开始写正文。

段落之间空一行。
```

`category: talk` 对应「闲谈」；改为 `category: offbeat`，文章就会进入「道在屎溺」。如果不填写分类，默认为「闲谈」。

更多写法见 [文章模板](docs/post-template.md)。模板不会显示为正式文章。文章正文保留你写作时的语言。

## 改资源或外观

| 内容 | 文件 |
| --- | --- |
| 主页、各栏目和卡片上的文字 | [_data/zh.yml](_data/zh.yml)、[_data/en.yml](_data/en.yml) |
| 学习资料和课程的链接、卡片顺序 | [content.js](content.js) |
| 已发布随笔 | [_posts](_posts) |
| 页面排版 | [index.html](index.html)、[styles.css](styles.css) |
| 文章排版 | [_layouts/post.html](_layouts/post.html) |

本站由 GitHub Pages 自动发布，发布来源是 `main` 分支的根目录。保留 `_config.yml` 和页面顶部的 `---`，它们让文章与文字配置自动生成网页。

这是公开仓库：这里的文件和提交记录都可被他人查看，未发表的私人草稿请留在自己的设备上。旧网站的编辑入口不会同步到这里，之后以这个仓库为准。
