HTMLElement.prototype.addClass = function(){
	if (arguments.length == 1) {
		if (this.className) {
			this.className += " "+arguments[0].toString();
		} else {
			this.className = arguments[0].toString();
		}
	}
};

HTMLElement.prototype.removeClass = function(){
	if (arguments.length == 1) {
		if (this.className) {
			if (this.className.indexOf(" ") != -1) {
				var classes = this.className.split(" ");
				if (classes.indexOf(arguments[0].toString()) != -1) {
					classes.pop(classes.indexOf(arguments[0]));
				}
			} else {
				this.className = "";
			}
		}
	}
};