var endTime = function(expr, time){
  time = time || 0;
  if(expr.tag === 'par'){
    var t1 = endTime(expr.left, time);
    var t2 = endTime(expr.right, time);
    time = t1 > t2 ? t1 : t2;
  }else if(expr.tag === 'seq'){
    time = endTime(expr.left, time);
    time = endTime(expr.right, time);
  }else{
    time += expr.dur;
  }
  return time;
};

var compile = function(expr){
  var result = [];

  var parseMus = function(e, timer){

    if(e.tag === 'par'){
      parseMus(e.left, timer);
      parseMus(e.right, timer);
    }else if (e.tag === 'seq'){
      parseMus(e.left, timer);
      parseMus(e.right, endTime(e.left, timer));
    }else{
      e.start = timer;
      result.push(e);
    }
  };

  parseMus(expr, 0);

  return result;

};