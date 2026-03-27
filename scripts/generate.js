const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const moduleName = args[0];

if (!moduleName) {
  console.error('\n  ❌ 请提供模块名称: node scripts/generate.js <module-name>\n');
  process.exit(1);
}

// nest g resource 的路径相对于 sourceRoot (src)，所以用 modules/test
const modulesPath = path.join('modules', moduleName);

console.log('\n  🚀 开始生成模块\n');
console.log(`  📁 模块名称: ${moduleName}`);
console.log(`  📍 生成路径: src/${modulesPath}\n`);

try {
  execSync(`./node_modules/.bin/nest g resource ${modulesPath}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
  console.log('\n  ✅ 模块生成成功!\n');
} catch (error) {
  console.error('\n  ❌ 模块生成失败\n');
  process.exit(1);
}
