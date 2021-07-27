/* 
  @parmas
    el: String 用于传输被加载随端变化的顶端盒子，一般用于body下属的第一个主container
    options: {
      first: boolean 用于标记第一次调用，
      fill: String 'width' | 'height' 以 width/height 为标准适配，传入之后会保证一边为百分之百适配
      setWidth: 设定 原始页面 的设定宽度
      setHeight: 设定 原始页面 的设定高度

      计划加入：
      align: 用于设定初始状态下的居中/置顶/置底
      insertBg: 用于填充在缩小之后产生的白底背景
    }
*/
// 插件用于实现屏幕在以宽度或高度某一项为标准自适应化，el用于挂载body下的第一个子项
(function ($el) {
  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
    };

    var throttled = function () {
      var now = Date.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    }
    throttled.cancel = function () {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };
    return throttled;
  }

  function setFillScreen(el, options = {}) {
    const {
      setWidth = 1920,
        setHeight = 1080,
        first,
        fill
    } = options
    const htmlWidth = document.body.clientWidth;
    const htmlHeight = document.body.clientHeight;
    const widthScale = htmlWidth / setWidth;
    const heightScale = htmlHeight / setHeight;
    if ((widthScale === 1 && fill === 'width') || (heightScale === 1 && fill === 'height') || (widthScale === 1 && heightScale === 1)) return

    const body = document.querySelector('body')
    const $el = document.querySelector(el)
    body.style.position = 'relative'
    $el.style.transformOrigin = '0 0'
    $el.style.position = 'absolute'
    $el.style.top = '50%'
    $el.style.left = '50%'
    // 不希望第一次加载时画面产生抖动
    if (!first) $el.style.transition = '0.3s'

    switch (fill) {
      case 'width':
        _scale = widthScale
        $el.style.transform = `scale(${_scale}) translate(-50%, 0)`
        break
      case 'height':
        _scale = widthScale
        $el.style.transform = `scale(${_scale}) translate(-50%, -50%)`
        break
      default:
        _scale = widthScale > heightScale ? heightScale : widthScale
        $el.style.transform = `scale(${_scale}) translate(-50%, -50%)`
        break
    }
  }

  const _setFillScreen = throttle(setFillScreen, 1000)

  function resetInit(el, options) {
    _setFillScreen(el, {
      ...options,
      first: true
    })
    window.addEventListener('resize', function () {
      _setFillScreen(el, options)
    })
  }
  $el.resetInit = resetInit
})(window)