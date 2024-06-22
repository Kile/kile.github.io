// DOM manipulation relying on classes

class Klaws {
	constructor(namespace){
		if(namespace instanceof HTMLElement){
			this.document = namespace;
			this._namespace = '';

			return ;
		}

		this._namespace = namespace || "body";
		this.document = document;
	}
}

Klaws._namespace = "body";
Klaws.document = document;

Object.defineProperties(Klaws, {
	element: { get(){
		if(!this._namespace)
			return this.document;

		return this.document.querySelector(this._namespace);
	} }
});

Klaws.get = function get(name){
	const query = `${this._namespace} .template.${name}`;

	return new KlawsInstance(
		this,
		this.document.querySelector(query),
		query
	);
}

Klaws.namespace = function namespace(namespace){
	return new Klaws(namespace);
}

Object.defineProperties(Klaws.prototype, Object
	.getOwnPropertyDescriptors(Klaws)
);

class KlawsInstance {
	constructor(klaws, element, query){
		this.klaws = klaws;
		if(element){
			this.template = element;
			this.parent = element.parentElement;
			this._element = element.cloneNode(1);
			this._element.classList.remove("template");
		}

		this.query = query;
	}
}

Object.defineProperties(KlawsInstance.prototype, {
	element: { get(){
		if(!this._element){
			this.template = document
				.querySelector(this.query)
			;
			this.parent = this.template.parentElement;
			this._element = this.template.cloneNode(1);
			this._element.classList.remove("template");
		}

		return this._element;
	} }
});

KlawsInstance.prototype.get = function get(query){
	query = query.split(/ +/);

	let current = this.element;
	for(const selector of query){
		if(!current)
			return null;

		current = current.querySelector(`.${selector}`);
	}

	return current;
}

KlawsInstance.prototype.getAll = function get(query){
	query = query.split(/ +/);

//	alert(query.join(' .'))

	return this.element.querySelectorAll('.' + query.join(' .'));

	let current = this.element;
	for(const selector of query){
		if(!current)
			return null;

		current = current.querySelectorAll(`.${selector}`);
	}

	return current;
}


KlawsInstance.prototype.apply = function(query, option){
	const target = typeof query === "string"
		? this.getAll(query)
		: query
	;

	if(target instanceof Array){
		return target.map((element) => this.apply(element, option));
	}

	if(target instanceof NodeList){
		return this.apply(Array.from(target), option);
	}

	if(!target)
		return null;

	if(option instanceof Object){
		let obj = target;
		for(const [ key, value ] of Object.entries(option)){ (function f(){
			if(obj[key] instanceof Function){
				// alert(value)
				obj[key](... value);

				return ;
			}

			if(obj[key] instanceof Object){
				obj = obj[key];

				return f();
			}

			obj[key] = value;
		})(); obj = target; };

		return target;
	}

	target.textContent = option;

	return target;
}

KlawsInstance.prototype.compose = function compose(...args){
	for(let i = 0; i < args.length; i += 2){
		this.apply(args[i], args[i + 1]);
	}

	return 0;
}

KlawsInstance.prototype.new = function _new(){
	this._element = this._element.cloneNode(1);

	return this;
}

KlawsInstance.prototype.append = function(element){
	if(!element)
		element = this.parent;

	element.appendChild(this._element);
}

KlawsInstance.prototype.appendTo = KlawsInstance.prototype.append;

