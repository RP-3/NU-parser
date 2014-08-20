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

var noteToMidi = function(note){

  var noteMap = {
    c: 0,
    d: 2,
    e: 4,
    f: 5,
    g: 7,
    a: 9,
    b: 11
  };

  var base = 12 + (parseInt(note[1]) * 12);
  var scale = noteMap[note[0]];
  return base + scale;
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
      e.pitch = noteToMidi(e.pitch);
      e.start = timer;
      result.push(e);
    }
  };

  parseMus(expr, 0);

  return result;

};

var melody_mus =
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));