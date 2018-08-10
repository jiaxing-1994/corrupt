//接口参数替换
String.prototype.format = function() {
  if(arguments.length == 0) return this;
  var param = arguments[0];
  var s = this;
  if(typeof(param) == 'object') {
    for(var key in param)
      s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
    return webApi.Host + s;
  } else {
    for(var i = 0; i < arguments.length; i++)
      s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return webApi.Host + s;
  }
};

//删除字符两端空格
String.prototype.trim=function()
{
  return this.replace(/(^\s*)|(\s*$)/g,'');
}

//判断两个数组是否相等
Array.prototype.equals = function(array, key, order) {
  // array--要比较的数组（必需）
  // key--如果数组里边包裹着对象，则可以比较对象的某个键值对（可选）
  // order--数组中的顺序是否可以打乱（可选）
  if (!array instanceof Array) return false;
  if (this.length != array.length) return false;
  if(order) {// 顺序要求一致
      for (let i = 0; i < this.length; i++) {
          if (isNotBlank(key)) {
              if (this[i][key] !== array[i][key]) {
                  return false;
                  break;
              }
          } else {
              if (this[i] !== array[i]) {
                  return false;
                  break;
              }
          }
      }
  } else {// 顺序可以不一致
      for (let i = 0; i < this.length; i++) {
          let log = false;
          for(let j = 0; j < array.length; j++) {
              if(isNotBlank(key)) {
                  if (this[i][key] === array[j][key]) {
                      log = true;
                      break;
                  }
              } else {
                  if(this[i] === array[j]) {
                      log = true;
                      break;
                  }
              }
          }
          if(!log) {
              return false;
              break;
          }
      }
  }
  return true;   
}
