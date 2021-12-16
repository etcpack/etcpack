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
    __etcpack__scope_args__=window.__etcpack__getBundle('1');
var xhtmlToJson =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('16');
var template =__etcpack__scope_args__.default;


console.log(xhtmlToJson(template));

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/algorithm/xhtmlToJson.js
/*****************************************************************/
window.__etcpack__bundleSrc__['1']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    /*!
 * 🔪 - 解析xhtml为json对象返回
 * https://github.com/hai2007/algorithm.js/blob/master/xhtmlToJson.js
 *
 * author hai2007 < https://hai2007.gitee.io/sweethome >
 *
 * Copyright (c) 2020-present hai2007 走一步，再走一步。
 * Released under the MIT license
 */

__etcpack__scope_args__=window.__etcpack__getBundle('2');
var $RegExp =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('3');
var isString=__etcpack__scope_args__.isString;

__etcpack__scope_args__=window.__etcpack__getBundle('13');
var nextTagFun =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('15');
var analyseDeep =__etcpack__scope_args__.default;


// 获取一棵DOM树
// noIgnore为true表示不忽略任何标签
__etcpack__scope_bundle__.default= function (template, noIgnore) {

    if (!isString(template)) throw new Error("Template must be a String!");

    // 获取读取下一个标签对象
    var nextTag = nextTagFun(template.trim());

    var tag = nextTag(), DomTree = [];
    while (tag != null) {

        if (tag.type == 'textcode' && $RegExp.blanksReg.test(tag.tagName)) {

            // 空白文本结点过滤掉

        } else if (tag.type == 'DOCTYPE') {

            // DOCTYPE过滤掉

        } else if (tag.type == 'comment') {

            // 注释目前也默认过滤掉，除非显示声明不忽略
            if (noIgnore) {
                DomTree.push(tag);
            }

        } else {
            tag.tagName = tag.tagName.trim();
            DomTree.push(tag);
        }

        tag = nextTag();
    }

    // 分析层次
    DomTree = analyseDeep(DomTree);

    /**
     * 模仿浏览器构建的一棵树,每个结点有如下属性：
     *
     * 1.parentNode index  父结点
     * 2.childNodes []     孩子结点
     * 3.preNode    index  前一个兄弟结点
     * 4.nextNode   index  后一个兄弟结点
     *
     * 5.attrs:{}          当前结点的属性
     * 6.name              节点名称
     * 7.type              节点类型（tag和text）
     * 8.content           文本结点内容
     *
     * 需要注意的是：如果一个文本结点内容只包含回车，tab，空格等空白字符，会直接被忽视
     */

    var presNode = [null], preDeep = 0;
    for (var i = 0; i < DomTree.length; i++) {

        // 当前结点
        var currentIndex = i, currentDeep = DomTree[i].__deep__;
        DomTree[i].childNodes = [];
        DomTree[i].preNode = null;
        DomTree[i].nextNode = null;

        // 前置三个结点
        var lastPre = presNode[presNode.length - 1];
        var last2Pre = presNode.length > 1 ? presNode[presNode.length - 2] : null;


        // 如果遇到的是兄弟结点
        if (currentDeep == preDeep) {

            // 修改兄弟关系
            DomTree[currentIndex].preNode = lastPre;
            DomTree[lastPre].nextNode = currentIndex;

            // 修改父子关系
            DomTree[currentIndex].parentNode = last2Pre;
            DomTree[last2Pre].childNodes.push(currentIndex);

            // 校对presNode
            presNode[presNode.length - 1] = currentIndex;
        }

        // 如果是遇到了孩子
        else if (currentDeep > preDeep) {

            // 修改兄弟关系
            // todo

            // 修改父子关系
            DomTree[currentIndex].parentNode = lastPre;
            if (lastPre != null) DomTree[lastPre].childNodes.push(currentIndex);

            // 校对presNode
            presNode.push(currentIndex);
        }

        // 如果是遇到了祖先
        else {

            var preTempIndex = presNode[presNode.length - 1 - (preDeep - currentDeep)];
            var preTemp2Index = presNode[presNode.length - 2 - (preDeep - currentDeep)];

            // 修改兄弟关系
            DomTree[currentIndex].preNode = preTempIndex;
            if (preTempIndex != null) DomTree[preTempIndex].nextNode = currentIndex;

            // 修改父子关系
            DomTree[currentIndex].parentNode = preTemp2Index;
            if (preTemp2Index != null) DomTree[preTemp2Index].childNodes.push(currentIndex);

            // 校对presNode
            for (var j = 0; j < preDeep - currentDeep; j++) { presNode.pop(); }
            presNode[presNode.length - 1] = currentIndex;

        }

        preDeep = currentDeep;

    }

    return DomTree;

};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/algorithm/.inner/RegExp.js
/*****************************************************************/
window.__etcpack__bundleSrc__['2']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= {

    // 空白字符:http://www.w3.org/TR/css3-selectors/#whitespace
    blankReg: new RegExp("[\\x20\\t\\r\\n\\f]"),
    blanksReg: /^[\x20\t\r\n\f]{0,}$/,

    // 标志符
    identifier: /^[a-zA-Z_$][0-9a-zA-Z_$]{0,}$/,

};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/tool/type.js
/*****************************************************************/
window.__etcpack__bundleSrc__['3']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_args__=window.__etcpack__getBundle('4');
var _isObject =__etcpack__scope_args__.default;


__etcpack__scope_args__=window.__etcpack__getBundle('5');
var _isBoolean =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('7');
var _isNumber =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('8');
var _isString =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('9');
var _isSymbol =__etcpack__scope_args__.default;


__etcpack__scope_args__=window.__etcpack__getBundle('10');
var _isFunction =__etcpack__scope_args__.default;


__etcpack__scope_args__=window.__etcpack__getBundle('11');
var _isError =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('12');
var _isPlainObject =__etcpack__scope_args__.default;


var domTypeHelp = function (types, value) {
    return value !== null && typeof value === 'object' &&
        types.indexOf(value.nodeType) > -1 &&
        !_isPlainObject(value);
};

/*!
 * 💡 - 值类型判断方法
 * https://github.com/hai2007/tool.js/blob/master/type.js
 *
 * author hai2007 < https://hai2007.gitee.io/sweethome >
 *
 * Copyright (c) 2020-present hai2007 走一步，再走一步。
 * Released under the MIT license
 */

__etcpack__scope_bundle__.isObject = _isObject;

// 基本类型
__etcpack__scope_bundle__.isUndefined = function (input) { return input === undefined };
__etcpack__scope_bundle__.isNull = function (input) { return input === null };
__etcpack__scope_bundle__.isBoolean = _isBoolean;
__etcpack__scope_bundle__.isNumber = _isNumber;
__etcpack__scope_bundle__.isString = _isString;
__etcpack__scope_bundle__.isSymbol = _isSymbol;

// 引用类型
__etcpack__scope_bundle__.isFunction = _isFunction;
__etcpack__scope_bundle__.isArray = function (input) { return Array.isArray(input) };
__etcpack__scope_bundle__.isError = _isError;
__etcpack__scope_bundle__.isPlainObject = _isPlainObject;

// 结点类型
__etcpack__scope_bundle__.isElement = function (input) { return domTypeHelp([1, 9, 11], input) };
__etcpack__scope_bundle__.isAttribute = function (input) { return domTypeHelp([2], input) };
__etcpack__scope_bundle__.isText = function (input) { return domTypeHelp([3], input) };
__etcpack__scope_bundle__.isComment = function (input) { return domTypeHelp([8], input) };

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/tool/.inner/type/isObject.js
/*****************************************************************/
window.__etcpack__bundleSrc__['4']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    /**
 * 判断一个值是不是Object。
 *
 * @param {*} value 需要判断类型的值
 * @returns {boolean} 如果是Object返回true，否则返回false
 */
__etcpack__scope_bundle__.default= function (value) {
    var type = typeof value;
    return value != null && (type === 'object' || type === 'function');
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/tool/.inner/type/isBoolean.js
/*****************************************************************/
window.__etcpack__bundleSrc__['5']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_args__=window.__etcpack__getBundle('6');
var getType =__etcpack__scope_args__.default;


/**
 * 判断一个值是不是Boolean。
 *
 * @param {*} value 需要判断类型的值
 * @returns {boolean} 如果是Boolean返回true，否则返回false
 */
__etcpack__scope_bundle__.default= function (value) {
    return value === true || value === false ||
        (value !== null && typeof value === 'object' && getType(value) === '[object Boolean]');
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/tool/.inner/type/getType.js
/*****************************************************************/
window.__etcpack__bundleSrc__['6']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    var toString = Object.prototype.toString;

/**
 * 获取一个值的类型字符串[object type]
 *
 * @param {*} value 需要返回类型的值
 * @returns {string} 返回类型字符串
 */
__etcpack__scope_bundle__.default= function (value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
    }
    return toString.call(value);
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/tool/.inner/type/isNumber.js
/*****************************************************************/
window.__etcpack__bundleSrc__['7']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_args__=window.__etcpack__getBundle('6');
var getType =__etcpack__scope_args__.default;


/**
 * 判断一个值是不是number。
 *
 * @param {*} value 需要判断类型的值
 * @returns {boolean} 如果是number返回true，否则返回false
 */
__etcpack__scope_bundle__.default= function (value) {
    return typeof value === 'number' || (
        value !== null && typeof value === 'object' &&
        getType(value) === '[object Number]'
    );
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/tool/.inner/type/isString.js
/*****************************************************************/
window.__etcpack__bundleSrc__['8']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_args__=window.__etcpack__getBundle('6');
var getType =__etcpack__scope_args__.default;


/**
 * 判断一个值是不是String。
 *
 * @param {*} value 需要判断类型的值
 * @returns {boolean} 如果是String返回true，否则返回false
 */
__etcpack__scope_bundle__.default= function (value) {
    var type = typeof value;
    return type === 'string' || (type === 'object' && value != null && !Array.isArray(value) && getType(value) === '[object String]');
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/tool/.inner/type/isSymbol.js
/*****************************************************************/
window.__etcpack__bundleSrc__['9']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_args__=window.__etcpack__getBundle('6');
var getType =__etcpack__scope_args__.default;


/**
 * 判断一个值是不是symbol。
 *
 * @param {*} value 需要判断类型的值
 * @returns {boolean} 如果是symbol返回true，否则返回false
 */
__etcpack__scope_bundle__.default= function (value) {
    var type = typeof value;
    return type === 'symbol' || (type === 'object' && value !== null && getType(value) === '[object Symbol]');
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/tool/.inner/type/isFunction.js
/*****************************************************************/
window.__etcpack__bundleSrc__['10']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_args__=window.__etcpack__getBundle('6');
var getType =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('4');
var isObject =__etcpack__scope_args__.default;


/**
 * 判断一个值是不是Function。
 *
 * @param {*} value 需要判断类型的值
 * @returns {boolean} 如果是Function返回true，否则返回false
 */
__etcpack__scope_bundle__.default= function (value) {
    if (!isObject(value)) {
        return false;
    }

    var type = getType(value);
    return type === '[object Function]' || type === '[object AsyncFunction]' ||
        type === '[object GeneratorFunction]' || type === '[object Proxy]';
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/tool/.inner/type/isError.js
/*****************************************************************/
window.__etcpack__bundleSrc__['11']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_args__=window.__etcpack__getBundle('12');
var isPlainObject =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('6');
var getType =__etcpack__scope_args__.default;


/**
 * 判断一个值是不是错误对象。
 * `Error`, `EvalError`, `RangeError`, `ReferenceError`,`SyntaxError`, `TypeError`, or `URIError`
 *
 * @param {*} value 需要判断类型的值
 * @returns {boolean} 如果是错误对象返回true，否则返回false
 */
__etcpack__scope_bundle__.default= function (value) {
    if (value === null || typeof value !== 'object') {
        return false;
    }

    var type = getType(value);
    return type === '[object Error]' || type === '[object DOMException]' ||
        (typeof value.message === 'string' && typeof value.name === 'string' && !isPlainObject(value));
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/tool/.inner/type/isPlainObject.js
/*****************************************************************/
window.__etcpack__bundleSrc__['12']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_args__=window.__etcpack__getBundle('6');
var getType =__etcpack__scope_args__.default;


/**
 * 判断一个值是不是一个朴素的'对象'
 * 所谓"纯粹的对象"，就是该对象是通过"{}"或"new Object"创建的
 *
 * @param {*} value 需要判断类型的值
 * @returns {boolean} 如果是朴素的'对象'返回true，否则返回false
 */

__etcpack__scope_bundle__.default= function (value) {
    if (value === null || typeof value !== 'object' || getType(value) != '[object Object]') {
        return false;
    }

    // 如果原型为null
    if (Object.getPrototypeOf(value) === null) {
        return true;
    }

    var proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/algorithm/.inner/xhtmlToJson/nextTag.js
/*****************************************************************/
window.__etcpack__bundleSrc__['13']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_args__=window.__etcpack__getBundle('2');
var $RegExp =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('14');
var analyseTag =__etcpack__scope_args__.default;


__etcpack__scope_bundle__.default= function (template) {

    var i = -1,

        // 当前面对的字符
        currentChar = null;

    // 如果前面是获取的js或css，还有pre等开始标签，比较特殊，直接寻址闭合的
    var preIsSpecial = false, specialCode = "";
    var specialTag = ['script', 'pre', 'style', 'code'];

    // 获取下一个字符
    var next = function () {
        currentChar = i++ < template.length - 1 ? template[i] : null;
        return currentChar;
    };

    // 获取往后n个值
    var nextNValue = function (n) {
        return template.substring(i, n + i > template.length ? template.length : n + i);
    };

    next();
    // 剔除开头的空白
    while ($RegExp.blankReg.test(currentChar) && i < template.length - 1) next();


    /**
     * 一个Tag存在哪些类型？如下：
     * 1.<tag-name>       { tagName:'tag-name', type:'beginTag', attrs:{} }      开始标签
     * 2.</tag-name>      { tagName:'tag-name', type:'endTag'   }                结束标签
     * 3.<tag-name />     { tagName:'tag-name', type:'fullTag',  attrs:{} }      自闭合标签
     * 4.text             { tagName:'text',     type:'textcode' }                文本结点
     * 5.<!-- text -->    { tagName:'text',     type:'comment'  }                注释
     * 6.<!DOCTYPE text>  { tagName:'text',     type:'DOCTYPE'  }                声明
     *
     *
     */
    return function () {

        var tag = currentChar, tagObj = {};

        if (tag == null) return null;

        /**
         * 特殊标签内容获取
         * ========================================
         */

        // 如果是获取特殊标签里面的内容
        // 先不考虑里面包含'</XXX>'
        if (preIsSpecial) {
            tagObj.type = 'textcode';
            tagObj.tagName = tag;
            while (nextNValue(specialCode.length + 3) != '</' + specialCode + '>' && i < template.length) {
                tagObj.tagName += next();
            }
            tagObj.tagName = tagObj.tagName.replace(/<$/, '');
            preIsSpecial = false;
            return tagObj;
        }

        /**
         * 特殊标签获取
         * ========================================
         */
        // 针对特殊的comment
        if (nextNValue(4) == '<!--') {
            tagObj.type = 'comment';
            tagObj.tagName = tag;
            while (nextNValue(3) != '-->' && i < template.length) {
                tagObj.tagName += next();
            }
            next(); next(); next();
            tagObj.tagName = tagObj.tagName.replace(/^<!--/, '').replace(/-$/, '');
            return tagObj;
        }

        // 针对特殊的doctype
        if (nextNValue(9) == '<!DOCTYPE') {
            tagObj.type = 'DOCTYPE';
            tagObj.tagName = tag;
            while (nextNValue(1) != '>' && i < template.length) {
                tagObj.tagName += next();
            }
            next();
            tagObj.tagName = tagObj.tagName.replace(/^<!DOCTYPE/, '').replace(/>$/, '');
            return tagObj;
        }

        /**
         * 普通的
         * ========================================
         */

        // 如果是期望归结非文本结点
        else if (tag == '<') {

            // 标记是否处于属性值是字符串包裹中
            var isAttrString = false, attrLeftValue = null, attrLeftLen = null;

            // 如果在包裹中或者没有遇到‘>’说明没有结束
            while ((isAttrString || currentChar != '>') && i < template.length) {

                tag += next();

                // 如果是包裹里面，试探是否即将遇到了结束
                if (isAttrString) {

                    var next23Value = nextNValue(attrLeftLen + 1).substring(1);
                    if (next23Value == attrLeftValue) {
                        isAttrString = false;
                    }

                }

                // 如果在包裹外面，试探是否即将进入包裹
                else {

                    var next23Value = nextNValue(2);
                    if (next23Value == '="' || next23Value == "='") {
                        attrLeftValue = next23Value.replace('=', '');
                        attrLeftLen = 1;
                        isAttrString = true;
                    }

                    next23Value = nextNValue(3);
                    if (next23Value == '=\"' || next23Value == "=\'") {
                        attrLeftValue = next23Value.replace('=', '');
                        attrLeftLen = 2;
                        isAttrString = true;
                    }

                }


            }

            // 针对特殊的结束标签
            if (/^<\//.test(tag)) {
                tagObj.tagName = tag.replace(/^<\//, '').replace(/>$/, '');
                tagObj.type = 'endTag';
            } else {

                if (/\/>$/.test(tag)) {
                    tagObj.type = 'fullTag';
                    tag = tag.replace(/\/>$/, '');
                } else {
                    tagObj.type = 'beginTag';
                    tag = tag.replace(/>$/, '');
                }

                tag = tag.replace(/^</, '');

                tagObj.tagName = "";
                var j = 0;
                for (; j < tag.length; j++) {
                    if (tag[j] == ' ') break;
                    tagObj.tagName += tag[j];
                }

                var attrString = tag.substring(j);
                if ($RegExp.blanksReg.test(attrString)) {
                    tagObj.attrs = {};
                } else {
                    tagObj.attrs = analyseTag(attrString);
                }

            }

        }

        // 如果是归结文本结点
        // 如果文本中包含<的先忽略考虑
        else {
            tagObj.type = 'textcode';
            tagObj.tagName = currentChar;
            while (nextNValue(1) != '<' && i < template.length) {
                tagObj.tagName += next();
            }
            tagObj.tagName = tagObj.tagName.replace(/<$/, '');
            i -= 1;
        }


        // 如果遇到开始script或者style、pre等特殊标签，标记开始获取特殊文本
        if (tagObj.type == 'beginTag') {
            if (specialTag.indexOf(tagObj.tagName.toLowerCase()) > -1) {
                preIsSpecial = true;
                specialCode = tagObj.tagName;
            }

        }

        // 如果遇到结束script或者style、pre等特殊标签，标记结束获取特殊文本
        else if (tagObj.type == 'endTag') {
            if (specialTag.indexOf(tagObj.tagName.toLowerCase()) > -1) {
                preIsSpecial = false;
            }
        }

        next();

        return tagObj;

    };

};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/algorithm/.inner/xhtmlToJson/analyseTag.js
/*****************************************************************/
window.__etcpack__bundleSrc__['14']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_args__=window.__etcpack__getBundle('2');
var $RegExp =__etcpack__scope_args__.default;


// 分析结点的属性
__etcpack__scope_bundle__.default= function (attrString) {
    var attr = {}, index = 0;

    attrString = attrString.trim();

    var getOneAttr = function () {

        // 属性名和属性值
        var attrName = "", attrValue = "";

        // 先寻找属性名
        for (; index < attrString.length; index++) {

            // 寻找属性名的时候遇到空白或结尾的时候，肯定没有属性值
            if ($RegExp.blanksReg.test(attrString[index]) || index == attrString.length - 1) {

                attrName += attrString[index];

                // 如果属性名是空白，就不需要记录了
                if (!$RegExp.blanksReg.test(attrName)) {
                    attr[attrName.trim()] = "";
                }
                index += 1;
                break;

            }

            // 如果遇到等号，说明属性名寻找结束了
            else if (attrString[index] == '=') {

                // 接着寻找属性值
                index += 1;

                // 由于属性可能由引号包裹或直接暴露
                var preCode = null, preLeng = -1;

                // 如果是由'或者"包裹
                if (attrString.substr(index, 1) == '"' || attrString.substr(index, 1) == "'") {
                    preCode = attrString.substr(index, 1);
                    preLeng = 1;
                    index += 1;
                }

                // 如果是由\'或\"包裹
                else if (attrString.substr(index, 2) == '\"' || attrString.substr(index, 2) == "\'") {
                    preCode = attrString.substr(index, 2);
                    preLeng = 2;
                    index += 2;
                }

                // 开始正式寻找属性值

                // 如果没有包裹，是直接暴露在外面的
                // 我们寻找到空格或结尾即可
                if (preCode !== null) {

                    for (; index < attrString.length; index++) {
                        if (attrString.substr(index, preLeng) == preCode) {
                            attr[attrName.trim()] = attrValue.trim();
                            index += 2;
                            break;
                        } else {
                            attrValue += attrString[index];
                        }
                    }

                }

                // 如果是包裹的
                // 我们确定寻找到对应的包裹闭合即可
                else {
                    for (; index < attrString.length; index++) {
                        if ($RegExp.blanksReg.test(attrString[index])) {
                            attr[attrName.trim()] = attrValue.trim();
                            index += 1;
                            break;
                        } else {
                            attrValue += attrString[index];
                        }
                    }
                }

                break;

            } else {
                attrName += attrString[index];
            }
        }

        // 如果还有字符串，继续解析
        if (index < attrString.length) {
            getOneAttr();
        }

    };

    getOneAttr();

    return attr;
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./node_modules/@hai2007/algorithm/.inner/xhtmlToJson/analyseDeep.js
/*****************************************************************/
window.__etcpack__bundleSrc__['15']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    // 分析deep
// 我们会在这里校对那些没有结束标签的开始标签
// 这步结束以后，每个都是一个单独的标签
// 也就是不用再区分开始或闭合了
__etcpack__scope_bundle__.default= function (tagArray) {

    // 闭合标签
    tagArray = closeTag(tagArray);

    var deep = 0, tagDeepArray = [];

    tagArray.forEach(function (tag) {

        if (tag.type == 'beginTag') {

            tagDeepArray.push({
                type: "tag",
                name: tag.tagName,
                attrs: tag.attrs,
                __deep__: ++deep,
                __tagType__: "double"
            });

        } else if (tag.type == 'endTag') {

            deep -= 1;


        } else if (tag.type == 'textcode') {

            // 如果是文本
            tagDeepArray.push({
                type: "text",
                content: tag.tagName,
                __deep__: deep + 1
            });

        } else if (tag.type == 'comment') {

            // 如果是注释
            tagDeepArray.push({
                type: "comment",
                content: tag.tagName,
                __deep__: deep + 1
            });

        } else {

            // 如果是自闭合结点
            tagDeepArray.push({
                type: "tag",
                name: tag.tagName,
                attrs: tag.attrs,
                __deep__: deep + 1,
                __tagType__: "single"
            });

        }

    });

    return tagDeepArray;

};

// 标记所有没有闭合结点的直接自闭合
var closeTag = function (tagArray) {

    var needClose = [];

    tagArray.forEach(function (tag, i) {
        if (tag.type == 'beginTag') {

            needClose.push([i, tag.tagName]);

        } else if (tag.type == 'endTag') {

            while (needClose.length > 0) {

                var needCloseTag = needClose.pop();

                if (needCloseTag[1] == tag.tagName) {
                    break;
                } else {
                    tagArray[needCloseTag[0]].type = 'fullTag';
                }

            }

        }
    });

    return tagArray;
};

  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/template.js
/*****************************************************************/
window.__etcpack__bundleSrc__['16']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= `<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>`;

  
    return __etcpack__scope_bundle__;
}

window.__etcpack__bundleSrc__['0']();