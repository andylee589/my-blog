// GitHub 集成测试脚本
// 使用方法：node test-github.js

require('dotenv').config({ path: '.env.local' });

const { Octokit } = require('@octokit/rest');

async function testGitHubIntegration() {
  console.log('🚀 测试 GitHub 集成...\n');

  // 检查环境变量
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  console.log('📋 配置信息：');
  console.log(`  Token: ${token ? '✅ 已设置 (' + token.substring(0, 10) + '...)' : '❌ 未设置'}`);
  console.log(`  Owner: ${owner || '❌ 未设置'}`);
  console.log(`  Repo:  ${repo || '❌ 未设置'}`);
  console.log(`  Branch: ${branch}\n`);

  if (!token || !owner || !repo) {
    console.log('❌ 错误：环境变量未完全配置');
    console.log('请检查 .env.local 文件\n');
    process.exit(1);
  }

  try {
    const octokit = new Octokit({ auth: token });

    // 测试 1: 验证 Token
    console.log('🔑 测试 1: 验证 GitHub Token...');
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`  ✅ Token 有效，用户: ${user.login}\n`);

    // 测试 2: 验证仓库访问
    console.log('📦 测试 2: 验证仓库访问...');
    const { data: repository } = await octokit.repos.get({
      owner,
      repo,
    });
    console.log(`  ✅ 仓库可访问: ${repository.full_name}`);
    console.log(`  📝 默认分支: ${repository.default_branch}\n`);

    // 测试 3: 检查 content/posts 目录
    console.log('📁 测试 3: 检查 posts 目录...');
    try {
      const { data: contents } = await octokit.repos.getContent({
        owner,
        repo,
        path: 'content/posts',
        ref: branch,
      });
      if (Array.isArray(contents)) {
        console.log(`  ✅ posts 目录存在，包含 ${contents.length} 个文件\n`);
      }
    } catch (error) {
      if (error.status === 404) {
        console.log('  ⚠️  posts 目录不存在，将在首次发布时自动创建\n');
      } else {
        throw error;
      }
    }

    // 测试 4: 测试写入权限（可选）
    console.log('✍️  测试 4: 测试写入权限...');
    console.log('  将创建一个测试文件来验证写入权限...\n');

    const testContent = `---
title: 测试文章
date: ${new Date().toISOString().split('T')[0]}
excerpt: 这是 GitHub 集成测试文章
tags:
  - 测试
---

# GitHub 集成测试

如果你看到这篇文章，说明 GitHub 集成配置成功！

测试时间：${new Date().toLocaleString('zh-CN')}
`;

    const path = 'content/posts/github-integration-test.mdx';
    const message = 'Test: GitHub integration test';

    try {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(testContent).toString('base64'),
        branch,
      });
      console.log(`  ✅ 测试文件创建成功！`);
      console.log(`  📄 文件路径: ${path}`);
      console.log(`  🔗 查看地址: https://github.com/${owner}/${repo}/blob/${branch}/${path}\n`);

      // 清理：删除测试文件
      console.log('🧹 清理测试文件...');
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });

      if ('sha' in fileData) {
        await octokit.repos.deleteFile({
          owner,
          repo,
          path,
          message: 'Test: Cleanup test file',
          sha: fileData.sha,
          branch,
        });
        console.log('  ✅ 测试文件已清理\n');
      }
    } catch (error) {
      console.log(`  ❌ 写入测试失败: ${error.message}\n`);
      throw error;
    }

    console.log('🎉 所有测试通过！GitHub 集成配置正确。');
    console.log('\n📖 下一步：');
    console.log('  1. 启动开发服务器: npm run dev');
    console.log('  2. 访问: http://localhost:3000/editor');
    console.log('  3. 创建一篇文章并发布');
    console.log('  4. 到 GitHub 查看提交记录\n');

  } catch (error) {
    console.log('❌ 测试失败:\n');
    if (error.status === 401) {
      console.log('  错误: Token 无效或已过期');
      console.log('  解决: 重新生成 GitHub Personal Access Token\n');
    } else if (error.status === 404) {
      console.log('  错误: 仓库不存在或无法访问');
      console.log('  解决: 检查 GITHUB_OWNER 和 GITHUB_REPO 配置\n');
    } else if (error.status === 403) {
      console.log('  错误: 权限不足');
      console.log('  解决: 确保 Token 有 "repo" 权限\n');
    } else {
      console.log(`  错误: ${error.message}\n`);
    }
    process.exit(1);
  }
}

testGitHubIntegration();
