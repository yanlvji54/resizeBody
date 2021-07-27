# resize页面自适应

提供大屏自适应的一个方案， 解决数据可视化页面在多比例不同大屏下转换的问题。

## 使用方法
目前要求大屏满足以下结构， 将body下的整体进行挂载。
引入script， 并执行挂载。 要求contaienr盒子有一个确定的宽高。

    <body>
      <div class='container' style='width: 1920px; height: 1080px'>
        ...
      </div>
      <script src='./sizeReset.js'></script>
      <script>
        resetInit('.container', {
          fill: 'width'
        })
      </script>
    <body>

## 参数

|  参数   | 类型  | 描述 |
|  ----  | ----  | --- |
|  el | String | 挂载的类名
|  options  | Object | 对于挂载后的设置
|  options.first  | Boolean | 用于标记第一次调用
|  options.fill  | String | 可选值 width/height 为标准适配，传入之后会保证一边为百分之百适配
|  options.setWidth  | Number | 设定原始页面的设定宽度
|  options.setHeight  | Number | 设定原始页面的设定高度