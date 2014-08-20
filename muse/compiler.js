var endTime = function(expr, time){
  time = time || 0;

  if(expr.tag === 'par'){

    var t1 = endTime(expr.left, time);
    var t2 = endTime(expr.right, time);
    time = t1 > t2 ? t1 : t2;

  }else if(expr.tag === 'seq'){

    time = endTime(expr.left, time);
    time = endTime(expr.right, time);

  }else if(expr.tag === 'repeat'){

    for(var i=0; i<expr.count; i++){
      endTime(expr.section, time);
    }

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

  var base = 12 + (parseInt(note[1], 10) * 12);
  var scale = noteMap[note[0]];
  return base + scale;
};

var compile = function(expr){
  var result = [];

  var parseMus = function(e, timer){

    if(e.tag === 'repeat'){
      for(var i=0; i<e.count; i++){
        parseMus(e.section, timer);
        timer = endTime(e.section, timer);
      }
    }else if(e.tag === 'par'){
      parseMus(e.left, timer);
      parseMus(e.right, timer);
    }else if (e.tag === 'seq'){
      parseMus(e.left, timer);
      parseMus(e.right, endTime(e.left, timer));
    }else{
      var pitch = noteToMidi(e.pitch);
      var eCopy = JSON.parse(JSON.stringify(e));
      eCopy.pitch = pitch;
      eCopy.start = timer;
      result.push(eCopy);
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
         right: { tag: 'note', pitch: 'b4', dur: 250 }
       },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right:
         { tag: 'repeat',
          section: { tag: 'note', pitch: 'c5', dur: 250 },
          count: 3
          }
        }
      };

console.log(melody_mus);
console.log(compile(melody_mus));









