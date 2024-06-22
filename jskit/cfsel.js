window.queryClimbSelector = function(query, stepout = 10){
	if(!(this instanceof HTMLElement))
		return null;

	let el = this;
	while(stepout-- !== 0 && el && !el.matches(query))
		el = el.parentElement;

	return el;
}
