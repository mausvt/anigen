/**
 *  @author		Ondrej Benda
 *  @date		2011-2016
 *  @copyright	GNU GPLv3
 *	@brief		"Abstract" class for editor tools - handles mouse events
 */
function toolEllipse() {
	this.target = null;
	this.downEvent = null;
}

toolEllipse.prototype.mouseDown = function(event) {
	if(!svg || !svg.svgElement) { return; }
	if(!event.target.isChildOf(svg.svgElement) && event.target != svg.svgElement) { return; }
	
	var targ = svg.selected;
	while(targ && !(targ instanceof SVGGElement || targ instanceof SVGSVGElement)) {
		targ = targ.parentNode;
		if(!(targ instanceof SVGElement)) { return; }
	}
	
	var CTM = targ.getCTMBase();
	
	var coords = svg.evaluateEventPosition(event);
	coords = CTM.toUserspace(coords.x, coords.y);
	
	this.target = document.createElementNS(svgNS, 'ellipse');
	this.target.generateId();
	this.downEvent = coords;
	
	targ.appendChild(this.target);
}

toolEllipse.prototype.mouseUp = function(event) {
	if(!this.target) { return; }
	if(this.target.getAttribute('cx') == null ||  this.target.getAttribute('cy') == null ||
		this.target.getAttribute('rx') == '0' || this.target.getAttribute('ry') == '0') {
			
		this.target.parentNode.removeChild(this.target);
		return;
	}
	
	if(svg && svg.history) {
		svg.history.add(new historyCreation(this.target.cloneNode(),
			this.target.parentNode.getAttribute('id'),
			this.target.nextElementSibling ? this.target.nextElementSibling.getAttribute('id') : null,
			false, true
		));
	}
	
	window.dispatchEvent(new Event('treeSeed'));
	svg.select(this.target);
	this.target = null;
	this.downEvent = null;
}

toolEllipse.prototype.mouseClick = function(event) {
	
}
	
toolEllipse.prototype.mouseDblClick = function(event) {}

toolEllipse.prototype.mouseMove = function(event) {
	if(!this.target) { return; }
	
	var coords = svg.evaluateEventPosition(event);
	
	var CTM = this.target.getCTMBase();
	coords = CTM.toUserspace(coords.x, coords.y);
	
	var oX = (coords.x < this.downEvent.x) ? coords.x : this.downEvent.x;
	var oFX = (coords.x < this.downEvent.x) ? this.downEvent.x : coords.x;
	var oY = (coords.y < this.downEvent.y) ? coords.y : this.downEvent.y;
	var oFY = (coords.y < this.downEvent.y) ? this.downEvent.y : coords.y;
	
	this.target.setAttribute('cx', oX+(oFX-oX)/2);
	this.target.setAttribute('cy', oY+(oFY-oY)/2);
	this.target.setAttribute('rx', (oFX-oX)/2);
	this.target.setAttribute('ry', (oFY-oY)/2);
}

toolEllipse.prototype.mouseContextMenu = function(event) {
	if(!svg || !(svg instanceof root)) { return; }
	
	if(!event.target.isChildOf(anigenManager.named.left.container) && 
		!event.target.isChildOf(anigenManager.named.right.container)) {
		popup.macroContextMenu({ 'target': event.target, 'x': event.clientX, 'y': event.clientY });
	}
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
	return false;
}

toolEllipse.prototype.keyDown = function(event) {
	return true;
}

toolEllipse.prototype.keyUp = function(event) {
	return true;
}