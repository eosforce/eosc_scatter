# 浏览器调用 Scatter Desktop 和 scatter chrome 插件

## 安装依赖
npm install

```js
npm install scatterjs-core
npm install scatterjs-plugin-eosjs
```

or use yarn add

```js
yarn add scatterjs-core
yarn add scatterjs-plugin-eosjs
```

## 示例代码

```js
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
ScatterJS.plugins( new ScatterEOS() );

// 安装过scatter chrome 插件, 插件会调用scatterLoaded事件, window.scatter 可以直接在代码调用
document.addEventListener('scatterLoaded', scatterExtension => {
    // i am in window now, you can call window.scatter
    alert(window.scatter);
});
// 调用 scatter 桌面
ScatterJS.scatter.connect("scatter").then(connected => {
    //可以在连接成功后，也将scatter绑定到window
    window.scatter = ScatterJS.scatter;
    alert(window.scatter);
})
```
