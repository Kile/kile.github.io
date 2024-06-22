let moonsole = document.querySelector(".moonsole");
let moonsoleLimit = 18;
if(!moonsole)
	moonsole = document.createElement("div")
;

//alert("Helo");

moonsole.classList.add("moonsole");

function moonsoleError(... args){
	moonsoleLog(... args);
}

function moonsoleLog(origin, error, ...args){
	if(moonsoleLimit){
		let buff = Array.from(moonsole.children);
		moonsole.textContent = '';
		buff.slice(-1*moonsoleLimit)
			.map(e => moonsole.appendChild(e));
	}

	const el = document.createElement("div");
	if(typeof error === "string"){
		el.textContent = error + args.join(' ');

		moonsole.appendChild(el);
		moonsole.scrollTo(0, moonsole.scrollHeight);
		return ;
	}

	if(!error)
		return ;

	el.classList.add("error")
	el.textContent = error.lineNumber ||(
		`${error.filename}[${error.lineno}:${error.colno}] `
	) || '';
	el.textContent += error.stack
		|| (error.reason && error.reason.stack || error.reason)
		|| error.cause
		|| error.message
		|| error.toString()
	;

	if(origin === "error") alert(
		error.message || error.stack || error.reason || error
	);

	moonsoleLog.noscroll && Array.from(moonsole.children)
		.slice(0, -10)
		.map(c => c.remove())
	;

	moonsole.appendChild(el);
	moonsole.scrollTo(0, moonsole.scrollHeight);

}

window.console = Object.create(console, {
	log: { value(... args){
		moonsoleLog("log", ... args);
	} },
	error: { value(... args){
		moonsoleLog("error", ... args);
	} },
	warn: { value(... args){
		moonsoleLog("warn", ... args);
	} },
	clear: { value(){
		moonsole.textContent = '';
	} }
});

window.addEventListener("unhandledrejection", function(error){
	moonsoleError("error", error);
});

window.addEventListener("error", function(error){
	moonsoleError("error", error);

	//alert(error.stack)
});

window.addEventListener("DOMContentLoaded", function(){
	document.body.appendChild(moonsole);
})
