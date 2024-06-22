/*
*/

window.qeventBubble = function(){

}

window.qeventCheck = function(queries, target, ...args){
}

window.qeventTransform = function(ev){
	return Object.create(ev, {
		currentTarget: null
	})
}

window.qevent = function(event, query, f){
  const _this = this || window;
  let queries = _this.qeventListeners[event];
  
  if(queries){
    const listeners = queries.find(([ name ]) => name === query);
    if(listeners){
      listeners[1].push(f);
      
      return this;
    }
    
    queries.push([ query, [ f ] ]);
    
    return this;
  }
  
  queries = _this.qeventListeners[event] = [ [ query, [ f ] ] ];
  _this.addEventListener(event, function(ev){
    let parent = ev.target;
    while(parent){
        for(const [ q, fs ] of queries){ // alert(`${parent.getAttribute("class")}:${q}`);
          if(parent.matches(q)){ // alert("Match")
            for(const f of fs)
              if(f.apply(this, [ev, parent])) return ev.stopPropagation();
          }
	}

        // bubble (not exactly)
        parent = parent.parentElement;
    }
  });
  
  return _this;
}

window.qeventListeners = {};
