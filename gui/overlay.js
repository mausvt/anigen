/**
 *  @author		Ondrej Benda
 *  @date		2011-2016
 *  @copyright	GNU GPLv3
 *	@brief		Overlay UI element for messages and dialogues intended to block entire UI
 */
function overlay() {
    this.container = document.createElement("div");
    this.header = document.createElement("h1");
    this.content = document.createElement("div");
    this.buttonsTop = document.createElement("div");
	this.buttons = document.createElement("div");

	this.container.appendChild(this.buttonsTop);
    this.container.appendChild(this.header);
    this.container.appendChild(this.content);
    this.container.appendChild(this.buttons);

	var overlay = document.createElement('div')
		overlay.setAttribute('class', 'overlay');
		overlay.appendChild(this.container);
	document.body.appendChild(overlay);
	
	this.hidden = false;
}

overlay.prototype.hide = function() {
	this.container.parentNode.style.transition = "opacity .25s ease-in 0s, height 0s linear 0.25s"; 
	this.container.parentNode.style.opacity = 0;
	this.container.parentNode.style.height = "0%";
	this.hidden = true;
	document.body.focus();
}
overlay.prototype.show = function() {
	this.container.parentNode.style.transition = "opacity .25s ease-in 0s, height 0s linear 0s"; 
	this.container.parentNode.style.opacity = 1;
	this.container.parentNode.style.height = "100%";
	this.hidden = false;
}

overlay.prototype.reset = function() {
	this.hide();
	this.header.removeChildren();
	this.content.removeChildren();
	this.buttons.removeChildren();
	this.buttonsTop.removeChildren();
}

overlay.prototype.setHeader = function(text) {
	this.header.removeChildren();
	var span = document.createElement("span");
	span.appendChild(document.createTextNode(text));
	this.header.appendChild(span);
}

overlay.prototype.add = function(element) {
	this.content.appendChild(element);
	return element;
}

overlay.prototype.addButton = function(button, onlyOne) {
	this.buttons.appendChild(button);
	if(!onlyOne) {
		this.buttonsTop.appendChild(button.cloneNode(true));
	}
	return button;
}
overlay.prototype.addButtonOk = function(action, onlyOne) {
	var button = document.createElement("button");
	button.setAttribute("class", "black");
	if(action) {
		button.setAttribute("onclick", "overlay.hide();"+action);
	} else {
		button.setAttribute("onclick", "overlay.hide();");
	}
	button.appendChild(document.createTextNode("Ok"));
	return this.addButton(button, onlyOne);
}
overlay.prototype.addButtonCancel = function(action, onlyOne) {
	var button = document.createElement("button");
	if(action) {
		button.setAttribute("onclick", "overlay.hide();"+action);
	} else {
		button.setAttribute("onclick", "overlay.hide();");
	}
	button.appendChild(document.createTextNode("Cancel"));
	return this.addButton(button, onlyOne);
}


overlay.prototype.macroDisclaimer = function() {
	this.reset();
	this.setHeader("Welcome to aniGen");
	
	this.add(build.img("_png/logo_large_center.png", "aniGen logo", { 'class': 'logo' }));

	this.add(build.p("AniGen is a browser-based editor whose main focus is the creation and editing of SVG animations. It requires an SVG-capable browser and javascript to run. Cookies may be used in broswers which do not support local storage."));
	this.add(build.p("AniGen is free software available as is. It is distributable under GPLv3. The author holds no responsibility for any use of the software."));
	this.add(build.p("By using aniGen, you accept these terms and conditions."));

	this.addButtonOk('anigenActual.confirm();overlay.macroOpen();', true);
	this.addButtonCancel('location.href="http://google.com";', true).setAttribute('onclick', 'location.href="http://google.com";');
	
	this.show();
}

overlay.prototype.macroAbout = function() {
	this.reset();
	this.setHeader("About");
	
	this.add(build.img("_png/logo_large_center.png", "aniGen logo", { "class": "logo" } ));
	
	this.add(build.p([ "Current version: ", build.strong(anigenActual.version) ]));
	
	this.add(build.p([ 
		"AniGen is a free software available as is. Its source code is available at ",
		build.a("GitHub", "https://github.com/aibosan/anigen"),
		" and can be used and spread under GPLv3."
	]));
	
	this.add(build.p("Third-party libraries:"));
	
	this.add(build.a("w2ui", "http://w2ui.com/"));
	this.add(build.br());
	this.add(build.a("SVGRender", "https://github.com/adasek/svg-render"));
	
	this.add(build.p("Created by Ondřej 'Aibo' Benda."));
	
	this.addButtonOk(null, true);

	this.show();
}

overlay.prototype.macroDocument = function() {
	this.reset();
	this.setHeader("Page");
	
	this.add(build.table([
		[ "Width", build.input('number', svg.svgBox[2], { 'id': 'anigenInputWidth' }) ],
		[ "Height", build.input('number', svg.svgBox[3], { 'id': 'anigenInputHeight' }) ]
	]));
	
	this.addButtonOk("svg.setPageSize(document.getElementById('anigenInputWidth').value, document.getElementById('anigenInputHeight').value);", true);
	this.addButtonCancel(null, true);
	
	this.show();
}

overlay.prototype.macroSettings = function() {
	this.reset();
	this.setHeader("Settings");
	
	this.add(build.table([
		[ "Show element highlights", build.input('checkbox', anigenActual.settings.get('highlight'), { 'title': 'Red curve highlighting currently selected element.' }) ],
		[ "Show progress curves", build.input('checkbox', anigenActual.settings.get('progressCurve'), { 'title': 'Green lines connecting positions of corresponding animation nodes.' }) ],
		[ "Show nodes", build.input('checkbox', anigenActual.settings.get('nodes'), { 'title': 'Green lines connecting positions of corresponding animation nodes.' }) ],
		[ "Show page border", build.input('checkbox', anigenActual.settings.get('canvasFrame')) ]
	]));
	
	this.addButtonOk('anigenActual.settings.evaluateOverlay();', true);
	this.addButtonCancel(null, true);
	
	this.show();
}

overlay.prototype.macroOpen = function() {
	this.reset();
	this.setHeader("Open file");
	
	this.add(build.input("file", null, {
		'id': 'files', 'name': 'files[]', 'accept': 'image/svg+xml', 'onchange': 'svg.load(this);'
	}));
	
	var label = this.add(build.label("Choose an SVG file", "files"));
	
	this.add(build.br());
	
	if(typeof(Storage) !== "undefined" && localStorage.getItem("quicksaveFilename")) {
		this.add(build.button(localStorage.getItem("quicksaveFilename"), { 'onclick': 'svg.loadLocal();overlay.hide();' }));
		this.add(build.button("Remove", { 'onclick': 'svg.removeLocal();overlay.macroOpen();' }));
	}
	
	if(svg.svgElement != null) {
		this.addButtonCancel(null, true);
	}

	this.show();
}

overlay.prototype.macroExportBar = function() {
	this.reset();
	this.setHeader("Exporting");
	
	var progress = new progressBar({ 'id': 'anigenProgressBar' });
	this.add(progress.container);
	
	this.addButtonCancel('svg.svgrender.pause();document.getElementById("svgArea").removeChildren();', true);
	
	this.show();
	return progress;
}

overlay.prototype.macroAnimationStatesManager = function() {
	this.reset();
	this.setHeader("Animation states manager");
	
	for(var i in svg.animationStates) {
		this.add(build.h(i, 2, {
			'onclick': 'this.nextElementSibling.style.display = this.nextElementSibling.style.display ? null : "none";',
			'title': 'Hide/show this group'
		}));
		
		tArray = [];
		
		for(var j = 0; j < svg.animationStates[i].length; j++) {
			tRow = [];
			
			var preview = new imageSVG(svg.animationStates[i][j].element, { width: 150, height: 100 });
			
			tRow.push(build.input('text', svg.animationStates[i][j].name));
			tRow.push(build.button("←", { "onclick": "this.parentNode.previousSibling.children[0].value = '"+svg.animationStates[i][j].name+"';" }));
			tRow.push(preview.container);
			tRow.push(build.input('checkbox'));
			tRow.push(build.button('Inbetween...', { "onclick": "overlay.macroStateInbetween("+j+", "+j+", null, '"+i+"');" }));
			
			tArray.push(tRow);
		}
		
		
		this.add(build.table(tArray, [ "Name", "Revert", "Preview", "Delete" ]));
	}
	
	this.addButtonOk("svg.evaluateStatesManager();");
	this.addButtonCancel();
	
	this.show();
}

overlay.prototype.macroStateInbetween = function(index1, index2, firstValueIndex, groupName) {
	this.reset();
	this.setHeader("Animation states inbetween creation");
	
	var states;
	if(groupName) {
		if(!svg.animationStates[groupName]) { return; }
		states = svg.animationStates[groupName];
	} else {
		if(!(windowAnimation.animation instanceof animationGroup) || !windowAnimation.animation.getAttribute('anigen:group') || !svg.animationStates[windowAnimation.animation.getAttribute('anigen:group')]) {
			return;
		}
		states = svg.animationStates[windowAnimation.animation.getAttribute('anigen:group')];
		groupName = windowAnimation.animation.getAttribute('anigen:group');
	}
	
	if(index1 == null) { index1 = 0; }
	if(index2 == null) { index2 = 0; }
	if(!states[index1] || !states[index2]) { return; }
	
	var tArray = [];
	
	var opt = [];
	for(var i = 0; i < states.length; i++) {
		opt.push({'value': String(i), 'text': String(states[i].name)});
	}
	var stateSelection1 = build.select(opt);
	stateSelection1.setAttribute('onchange', 'overlay.macroStateInbetweenRefresh("'+groupName+'", true);');
	
	var stateSelection2 = stateSelection1.cloneNode(true);
	
	stateSelection1.setSelected(parseInt(index1));
	stateSelection2.setSelected(parseInt(index2));
	
	tArray.push([
		stateSelection1,
		build.input('text', states[index1].name+'-'+states[index2].name),
		stateSelection2
	]);
	
	tArray.push([
		'',
		'',
		''
	]);
	tArray.push([
		'',
		[
		build.input('range', '0.5', {
			'min': 0,
			'max': 1,
			'step': 0.001,
			'onchange': 'overlay.macroStateInbetweenRefresh("'+groupName+'");this.nextElementSibling.value=this.value;',
			'onmousemove': 'if(!event.buttons){return;};overlay.macroStateInbetweenRefresh("'+groupName+'");this.nextElementSibling.value=this.value;'
		}),
		build.input('number', '0.5', {
			'step': 0.01,
			'onchange': 'overlay.macroStateInbetweenRefresh("'+groupName+'");this.previousElementSibling.value=this.value;'
		})
		],
		''
	]);
	
	this.add(build.table(tArray));
	
	this.addButtonOk("svg.evaluateGroupInbetween("+firstValueIndex+", '"+groupName+"');", true);
	this.addButtonCancel(null, true);
	
	this.macroStateInbetweenRefresh(groupName, true);
	this.show();
}

overlay.prototype.macroStateInbetweenRefresh = function(groupName, hard) {
	
					// table	//tr		//td		//el
//	this.content.children[0].children[0].children[0].children[0]
	
	var states = svg.animationStates[groupName];
	
	var state1Index = parseInt(this.content.children[0].children[0].children[0].children[0].value);
	var state2Index = parseInt(this.content.children[0].children[0].children[2].children[0].value);
	var ratio = parseFloat(this.content.children[0].children[2].children[1].children[1].value);
	
	if(state1Index == null || state2Index == null || ratio == null) {
		console.log('!');
		return;
	}
	
	if(hard) {
		var state1Preview = new imageSVG(states[state1Index].element, { width: 100, height: 50 });
		var state2Preview = new imageSVG(states[state2Index].element, { width: 100, height: 50 });
		this.content.children[0].children[1].children[0].removeChildren();
		this.content.children[0].children[1].children[0].appendChild(state1Preview.container);
		this.content.children[0].children[1].children[2].removeChildren();
		this.content.children[0].children[1].children[2].appendChild(state2Preview.container);
	}
	
	var inbetween = states[state1Index].inbetween(states[state2Index], ratio);
	var inbetweenPreview = new imageSVG(inbetween.element, { width: 100, height: 50 });
	this.content.children[0].children[1].children[1].removeChildren();
	this.content.children[0].children[1].children[1].appendChild(inbetweenPreview.container);
	
}

overlay.prototype.macroExport = function() {
	this.reset();
	this.setHeader("Export file");
	
	this.add(build.table([
		[ "Begin at", build.input('number', '0', { 'id': 'anigenInputBegin' }), build.button("←", { "onclick": "this.parentNode.previousSibling.children[0].value = 0;" }) ],
		[ "Duration (seconds)", build.input('number', String(infoEditor.clock.maxTime || 10), { 'id': 'anigenInputDur', 'min': '0'}),
			build.button("←", { "onclick": "this.parentNode.previousSibling.children[0].value = 10;" }) ],
		[ "Frames per second", build.input('number', '30', { 'id': 'anigenInputFramerate', 'min': '0'}),
			build.button("←", { "onclick": "this.parentNode.previousSibling.children[0].value = 30;" }) ],
		[ "Scale (%)", build.input('number', '100', { 'id': 'anigenInputScale', 'min': '0'}),
			build.button("←", { "onclick": "this.parentNode.previousSibling.children[0].value = 100;" }) ]
	]));
	
	this.addButtonOk("svg.export(document.getElementById('anigenInputBegin').value, document.getElementById('anigenInputDur').value, document.getElementById('anigenInputFramerate').value, parseFloat(document.getElementById('anigenInputScale').value)/100)", true);
	this.addButtonCancel(null, true);
	
	this.show();
}

overlay.prototype.macroEdit = function(target) {
	if(!target) { return; }
	
	this.reset();
	this.setHeader("Edit element");
	
	var tArray = [];
	
	for(var i = 0; i < target.attributes.length; i++) {
		if(target.attributes[i].name == "style") { continue; }
		
		var tRow = [];
		
		var attrOut = {};
		if(target.attributes[i].name == 'id') { attrOut.disabled = 'disabled'; }
		var descr = svg.getAttributeDesription(target.attributes[i].name);
		if(descr) { attrOut.title = descr; }
		
		tRow.push(build.input('text', target.attributes[i].name, attrOut));
		
		tRow.push(build.button("←", { 'onclick': "this.parentNode.previousSibling.children[0].value = '"+target.attributes[i].name+"';" }));
		
		tRow.push(build.input('text', target.attributes[i].value));
		
		tRow.push(build.button("←", { 'onclick': "this.parentNode.previousSibling.children[0].value = '"+target.attributes[i].value+"';" }));
		
		attrOut = {};
		if(target.attributes[i].name == 'id') { attrOut.disabled = 'disabled'; }
		
		tRow.push(build.input('checkbox', null, attrOut));
		
		tArray.push(tRow);
	}
	
	tArray.push([ build.input('text', null, { 'title': 'New attribute' } ), "", build.input('text', null, { 'title': 'New value' } ), "", "" ]);
	
	this.add(build.table(tArray, [ "Attribute", "Revert", "Value", "Revert", "Delete" ]));
	
	
	
	tArray = [];
	
	for(var i = 0; i < target.style.length; i++) {
		var tRow = [];
		
		var attrOut = {};
		var descr = svg.getAttributeDesription(target.style[i]);
		if(descr) { attrOut.title = descr; }
		
		tRow.push(build.input('text', target.style[i], attrOut));
		
		tRow.push(build.button("←", { 'onclick': "this.parentNode.previousSibling.children[0].value = '"+target.style[i]+"';" }));
		
		tRow.push(build.input('text', target.style[target.style[i]]));
		
		tRow.push(build.button("←", { 'onclick': "this.parentNode.previousSibling.children[0].value = '"+target.style[target.style[i]]+"';" }));
		
		tRow.push(build.input('checkbox'));
		
		tArray.push(tRow);
	}
	
	tArray.push([ build.input('text', null, { 'title': 'New CSS attribute' } ), "", build.input('text', null, { 'title': 'New value' } ), "", "" ]);
	
	this.add(build.table(tArray, [ "CSS Attribute", "Revert", "Value", "Revert", "Delete" ]));
	
	this.addButtonOk("svg.evaluateEditOverlay();");
	this.addButtonCancel();
	
	this.show();
}



