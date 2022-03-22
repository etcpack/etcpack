/******/
/******/  // EtcPack Bootstrap
/******/  // （ https://etcpack.github.io/api/ ）
/******/  
/******/  // 记录bundle的函数源码
/******/  window.__etcpack__bundleSrc__ = {};
/******/  
/******/  // 记录bundle的运行结果
/******/  window.__etcpack__bundleObj__ = {};
/******/  
/******/  // 获取bundle结果
/******/  window.__etcpack__getBundle = function (bundleName) {
/******/  
/******/      // 一个bundle只有第一次导入的时候需要执行
/******/      if (!(bundleName in window.__etcpack__bundleObj__)) {
/******/          window.__etcpack__bundleObj__[bundleName] = window.__etcpack__bundleSrc__[bundleName]();
/******/      }
/******/  
/******/      // 返回需要的bundle的结果
/******/      return window.__etcpack__bundleObj__[bundleName];
/******/  }
/******/  
/******/  window.__etcpack__bundleFile__ = {};
/******/  
/******/  // 获取懒加载bundle结果
/******/  window.__etcpack__getLazyBundle = function (fileName, bundleName) {
/******/      return new Promise(function (resolve) {
/******/  
/******/          // 如果加载过了
/******/          if (window.__etcpack__bundleFile__[fileName]) {
/******/              resolve(window.__etcpack__getBundle(bundleName));
/******/              return;
/******/          }
/******/  
/******/          // 获取head标签
/******/          var head = document.getElementsByTagName('head')[0];
/******/  
/******/          // 创建script
/******/          var script = document.createElement('script');
/******/  
/******/          // 设置属性
/******/          script.src = fileName;
/******/  
/******/          // 追加到页面
/******/          head.appendChild(script);
/******/  
/******/          window.__etcpack__bundleFile__[fileName] = true;
/******/  
/******/          script.addEventListener('load', function () {
/******/              resolve(window.__etcpack__getBundle(bundleName));
/******/          }, false);
/******/  
/******/  
/******/      });
/******/  }
/******/  
/************************************************************************/
/******/

/*************************** [bundle] ****************************/
// Original file:./src/main.js
/*****************************************************************/
window.__etcpack__bundleSrc__['0']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    // import xhtmlToJson from '@hai2007/algorithm/xhtmlToJson';
// import template from './template'

// console.log(xhtmlToJson(template));

__etcpack__scope_args__=window.__etcpack__getBundle('1');
var demo =__etcpack__scope_args__.default;


demo();

__etcpack__scope_args__=window.__etcpack__getBundle('2');
var demo1 =__etcpack__scope_args__.default;


demo1();

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/demo.myfile?xxxxxx
/*****************************************************************/
window.__etcpack__bundleSrc__['1']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= function(){
    console.log('默认的');
}
/*---*/
  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/demo.myfile
/*****************************************************************/
window.__etcpack__bundleSrc__['2']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= function(){
    console.log('默认的');
}

  
    return __etcpack__scope_bundle__;
}

window.__etcpack__bundleSrc__['0']();