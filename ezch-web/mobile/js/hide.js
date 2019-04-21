HTMLElement.prototype.hide = function(){
	if (arguments.length > 0) {
		if (arguments[0] == true) {
			if (this.className.length != 0) {
				this.className += " hide";
			} else {
				this.className += "hide";
			}
		} else if (arguments[0] == false) {
			var classes = this.className.split(" ");
			var newClass = "";
			for (var i = 0; i < classes.length; i++) {
				if (classes[i] != "hide") {
					newClass += classes[i]+" ";
				}
			}
			this.className = newClass.slice(0, newClass.length-1);				
		}
	}
};