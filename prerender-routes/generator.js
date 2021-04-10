/**
 * 根据 src/router/projects 下的项目路由文件自动生成预渲染所需的 routes
 * 项目路由文件中应以 routes=[***] 格式定义
 * 其它路由结构请自行修改相应 正则表达式，或者不使用自动，手动在 vue.config.js 中定义需要预渲染的路由
 * 
 * 或许 AST 可以优化匹配过程
 */
const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');

const toAbsolute = (p) => path.resolve(__dirname, '../', p);
const toRoutes = (p) => toAbsolute('src/router/projects/' + p);
const routesReg = /routes=\[.*\]/g;

const modules = fs
  .readdirSync(toRoutes(''))
  .map(file => {
    // 读取 modules 下 route 单文件内容 -> string
    // 去注释、换行、空格
    let str = fs.readFileSync(toRoutes(file)).toString();
    str = UglifyJS.minify(str).code.replace(/ /g, '');
    // 匹配出 routes 数组部分
    str = str.match(routesReg)[0].replace('routes=', '');
    // 去除 component:...(目前仅允许箭头函数或变量，其他表达式或异步 暂未处理) 、格式化，为 JSON.parse 作准备
    str = str.replace(/component:\(\)=>import[^{]+\),?/g, '')
      .replace(/component:[^,}]+,?/g, '')
      .replace(/(,}|,,})/g, '}')
      .replace(',]', ']');
    // 给键加双引号
    str = str.replace(/([{,}][a-zA-Z0-9_]+):/g, (all, key) => `${key[0]}"${key.substr(1)}":`);
    // return str
    return {
      path: '/' + file.replace(/(.js$|.ts$)/, ''),
      children: JSON.parse(str)
    }
  });

function getRoutePath(route) {
  return route.path || ''
}
// 处理路由到一维数组
function oneDimensionalRoutes(routes, parentPath) {
  let arr = [];
  routes.forEach(a => {
    let path = getRoutePath(a);
    if (parentPath) {
      const hasEnd = parentPath.endsWith('/');
      const hasStart = path.startsWith('/');
      if (!hasEnd && !hasStart) {
        path = parentPath + '/' + path
      } else if (hasEnd && hasStart) {
        path = parentPath + path.substr(1)
      } else {
        path = parentPath + path
      }
    }
    if (!path) path = '/';
    if (!a.children || !a.children.length) {
      arr.push(path);
    } else {
      arr = arr.concat(oneDimensionalRoutes(a.children, path))
    }
  });
  return arr
}

const projectRoutes = {};
const routes = ['/'].concat(oneDimensionalRoutes(modules));
modules.forEach(a => {
  const path = getRoutePath(a) || '/';
  const projectName = path.substr(1);
  if (!a.children || !a.children.length) {
    projectRoutes[projectName] = ['/']
  } else {
    projectRoutes[projectName] = oneDimensionalRoutes(a.children, '/')
  }
});

// 生成路由文件
const routesConfig = `
module.exports = {
  allRoutes: ${JSON.stringify(routes)},
  projectRoutes: ${JSON.stringify(projectRoutes)}
}
`;
fs.writeFileSync(path.resolve(__dirname, 'routes.js'), routesConfig)
