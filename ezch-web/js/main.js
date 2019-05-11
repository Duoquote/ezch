// EZCH Project

// A Dictionary project for chinese-english translation specifically designed
// for bulk text or book translation.
// EZCH name itself derives from 'easy' used as 'ez' (Check the urban dictionary
// ) and 'CH' as 'Chinese' combined together.

// EZCH-Script Written in javascript
// This file contains nearly all the functions that handles the client-side
// tasks.

// For Turkish people:
// Türkçe açıklama
// Bu javascript dosyası neredeyse tüm istemci tarafının işlemlerini
// gerçekleştiren fonksiyonlar içerir.


// INITIALIZE
window.hashes = [
	"#input", "#result"
];
window.location.hash = "#input";
window.initial = 0;
window.scroll = false;
window.status = false;
window.writing = false;
window.tip = null;
window.lastc = new Date().getTime();
window.toggle = 0;
window.tooltips = {};
window.lastVal = null;
window.lastPos = false;
window.checkPos = false;
window.moveYToggle = false;
window.platform = "desktop";

document.body.addEventListener("click", function(e){checkTtip(e)});
document.getElementById("result-container").addEventListener("scroll", function(e){checkTtip(e)});
document.getElementById("input-container").firstElementChild.addEventListener("scroll", function(e){checkTtip(e)});
window.addEventListener("load", function(e){
	platformGet();
});
window.addEventListener("resize", function(e){
	platformGet();
	if (window.platform == "desktop") {
		window.location.hash = window.hashes[0];
	}
});

if (localStorage["settings"] == null) {
	localStorage["settings"] = JSON.stringify({"pinyin-display": true});
}

//////////////////////////////////

// $mobile

function setSet(setting, value) {
	var settings = JSON.parse(localStorage["settings"]);
	settings[setting] = value;
	localStorage["settings"] = JSON.stringify(settings);
}

function getSet(setting) {
	var settings = JSON.parse(localStorage["settings"]);
	return settings[setting];
}


function platformGet() {
	if (window.innerWidth <= 768) {
		if (window.platform == "desktop") {
			dragEvent(true);
		}
		window.platform = "mobile";
	} else {
		if (window.platform == "mobile") {
			dragEvent(false);
		}
		window.platform = "desktop";
	}
};

function dragEvent(val) {
	if (val) {
		document.getElementById("main").addEventListener("touchstart", dragStart);
		document.getElementById("main").addEventListener("mousedown", dragStart);

		document.getElementById("main").addEventListener("mousemove", dragMove);
		document.getElementById("main").addEventListener("touchmove", dragMove);

		document.getElementById("main").addEventListener("touchend", dragEnd);
		document.getElementById("main").addEventListener("mouseup", dragEnd);
	} else {
		document.getElementById("main").removeEventListener("touchstart", dragStart);
		document.getElementById("main").removeEventListener("mousedown", dragStart);

		document.getElementById("main").removeEventListener("mousemove", dragMove);
		document.getElementById("main").removeEventListener("touchmove", dragMove);

		document.getElementById("main").removeEventListener("touchend", dragEnd);
		document.getElementById("main").removeEventListener("mouseup", dragEnd);
	}
}

document.getElementById("send").addEventListener("click", function(e){
	if (window.platform == "desktop") {
		e.preventDefault();
		process();
	}
});

document.getElementById("input-container").firstElementChild.addEventListener("input", function(e){
	if (window.writing == false) {
		window.writing = setTimeout(function(e){
			process();
			window.writing = false;
		}, 1500);
	} else {
		clearTimeout(window.writing);
		window.writing = setTimeout(function(e){
			process();
			window.writing = false;
		}, 1500);
	}
});

document.getElementById("settings-button").addEventListener("click", function(e){
	e.preventDefault();
	if (e.target.tagName == "IMG") {
		var elem = e.target.parentNode;
	} else {
		var elem = e.target;
	}
	if (window.toggle) {
		window.toggle = 0;
		document.getElementById("settings-panel").hide(true);
		document.getElementById("send").hide(false);
		elem.className = elem.className.split(" ")[0];
	} else {
		window.toggle = 1;
		document.getElementById("send").hide(true);
		document.getElementById("settings-panel").hide(false);
		document.getElementById("settings-panel").style.animation = "slide-appear 0.3s ease";
		elem.className += " button-toggle";
	}
});
window.addEventListener("hashchange", function(e){
	if (e.target.location.hash != "") {
		if (window.platform == "mobile") {
			document.getElementById("main").style.left = (window.hashes.indexOf(e.target.location.hash) * -1 * 100).toString() + "%";
			window.location.hash = e.target.location.hash;
			checkTtip(e);
			if (window.location.hash == "#result") {
				process();
			}
		} else {
			document.getElementById("main").style.left = "0";
		}
	}
});

window.swipeVal = {
	"lastPos": false,
	"checkerId": false,
	"scrolling": false,
	"initial": 0,
	"moving": false,
	"leftInitial": 0,
	"toggle": false
}

function dragStart(e) {
	document.getElementById("main").className += " trans";
	if (e.type == "touchstart") {
		var posX = e.changedTouches[0].clientX;
		var posY = e.changedTouches[0].clientY;
	} else {
		var posX = e.clientX;
		var posY = e.clientY;
	}
	window.swipeVal["leftInitial"] = window.innerWidth * window.hashes.indexOf(window.location.hash);
	window.swipeVal["initial"] = [posX, posY];
	window.swipeVal["moving"] = false;
	window.swipeVal["toggle"] = false;
	if (window.swipeVal["checkerId"]) {
		clearInterval(window.swipeVal["checkerId"]);
	};
	window.swipeVal["checkerId"] = setInterval(checkDrag, 25);
}

function dragMove(e) {
	window.swipeVal["lastPos"] = e;
}

function checkDrag() {
	var e = window.swipeVal["lastPos"];
	if (e.type == "touchmove") {
		var posX = e.changedTouches[0].clientX;
		var posY = e.changedTouches[0].clientY;
	} else {
		var posX = e.clientX;
		var posY = e.clientY;
	}
	if (window.swipeVal["toggle"] == false) {
		var poss = [Math.abs(window.swipeVal["initial"][0] - posX), Math.abs(window.swipeVal["initial"][1] - posY)];
		if (poss[0] > 30 || poss[1] > 30) {
			console.log(poss[1]/poss[0]);
			if (poss[1]/poss[0] > 1.5) {
				window.swipeVal["moving"] = false;
				dragEnd(e);
			} else {
				window.swipeVal["moving"] = true;
			}
			window.swipeVal["toggle"] = true;
		}
	}
	if (window.swipeVal["moving"]) {
		var pos = Math.round(window.swipeVal["leftInitial"] + window.swipeVal["initial"][0] - posX);
		if (pos >= 0 && pos <= (window.hashes.length-1) * window.innerWidth) {
			document.getElementById("main").style.left = (pos * -1).toString() + "px";
		}
	}
}

function dragEnd(e) {
	clearInterval(window.swipeVal["checkerId"]);
	document.getElementById("main").className = document.getElementById("main").className.split(" ")[0];
	if (e.type == "touchend") {
		var	posX = e.changedTouches[0].clientX;
	} else {
		var posX = e.clientX;
	}
	var pos = Math.round(window.swipeVal["leftInitial"] - window.swipeVal["initial"][0] + posX);
	var cursor = window.hashes.indexOf(window.location.hash);
	var elemLeft = document.getElementById("main");
	if (posX - window.swipeVal["initial"][0] > 0 && window.swipeVal["moving"]) {
		if (cursor - 1 < 0) {
			elemLeft.style.left = "0%";
		} else {
			var sum = Math.abs(posX - window.swipeVal["initial"][0])*100/window.innerWidth;
			if (sum > 55) {
				window.location.hash = window.hashes[cursor - 1];
			} else {
				elemLeft.style.left = (cursor * -1 * 100).toString() + "%";
			}
		}
	} else if (posX - window.swipeVal["initial"][0] < 0 && window.swipeVal["moving"]) {
		if (cursor + 1 > window.hashes.length-1) {
			window.location.hash = window.hashes[window.hashes.length-1];
		} else {
			var sum = Math.abs(posX - window.swipeVal["initial"][0])*100/window.innerWidth;
			if (sum > 55) {
				window.location.hash = window.hashes[cursor + 1];
			} else {
				elemLeft.style.left = (cursor * -1 * 100).toString() + "%";
			}
		}
	} else {
		elemLeft.style.left = (cursor * -1 * 100).toString() + "%";
	}
}

function uidGen(input) {
	var val = 0;
	var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (var i = 0; i < 10; i++) {
		input += alpha[Math.round(alpha.length*Math.random())];
	}
	for (var i = 0; i < input.length; i++) {
		val += 1/input[i].charCodeAt()*i;
	}
	return (val * Math.random()).toString().replace(".", "");
}

function display(e) {
	var mainElem = document.getElementById("result-container");
	mainElem.innerHTML = "";
	/*if (mainElem.innerHTML != "") {
		for (var i = 0; i < mainElem.childElementCount; i++) {
			if (mainElem.children[i].id.indexOf("pinned") == -1) {
				window.tooltips[mainElem.children[i].id] = null;
				mainElem.removeChild(mainElem.children[i]);
			}
		}
	}*/

	for (var i = 0; i < e["words"].length; i++) {
		var word = create(e["words"][i]);
		mainElem.appendChild(word);
	}
}

function create(data) {
	var main = document.createElement("div");
	var id = uidGen(data["word"]);
	let defs = definition(data["defs"], data["pinyin"]);
	main.id = id;
	window.tooltips[id] = {"def": defs[1], "hanzi": {}};
	main.className = "word";
	for (var i = 0; i < data['hanzis'].length; i++) {
		var hanzi = document.createElement("div");
		let defs = definition(data["hanzis"][i]["def"], data["hanzis"][i]["pinyin"]);
		window.tooltips[id]["hanzi"][i.toString()] = defs[1];
		hanzi.id = i.toString();
		hanzi.title = defs[0];
		hanzi.className = "hanzi";

		//pinyin ekle
		hanzi.innerHTML = data["hanzis"][i]["hanzi"];
		var pinyin = document.createElement("div");
		pinyin.className = "pinyin";
		if (data["hanzis"][i]["pinyin"] != false) {
			pinyin.innerHTML = data["hanzis"][i]["pinyin"];
		} else {
			pinyin.innerHTML = "&nbsp;";
		}
		if (getSet("pinyin-display") == false) {
			pinyin.hide(true);
		}
		hanzi.appendChild(pinyin);
		if (data["hanzis"][i]["def"]) {
			hanzi.addEventListener("click", function(e){
				ttipHandler(e.target);
			});
		}
		main.appendChild(hanzi);
	}
	return main;
}

function ttipHandler(elem) {
	if (elem.className == "pinyin") {
		elem = elem.parentNode;
	}
	if (new Date().getTime() - window.lastc < 500 && elem.parentNode.id == window.tip[1]) {
		var ttip = window.tooltips[elem.parentNode.id]["def"];
		if (window.tip) {
			document.body.removeChild(window.tip[0]);
		}
		window.tip = [tooltipCreate(ttip, elem.parentNode), elem.parentNode.id];
	} else {
		var ttip = window.tooltips[elem.parentNode.id]["hanzi"][elem.id];
		if (window.tip) {
			document.body.removeChild(window.tip[0]);
		}
		window.tip = [tooltipCreate(ttip, elem), elem.parentNode.id];
	}
	window.lastc = new Date().getTime();
};


function definition(defs, pinyin) {
	var text = "";
	var title = "Definition: "+defs[0]+" Pinyin: "+pinyin;
	text += "Pinyin: "+pinyin+"<br>Defs: <br>";
	for (var i = 0; i < defs.length; i++) {
		text += "- "+defs[i]+"<br>";
	}
	text = text.slice(0, text.length-4);
	return [title, text];
}

function process(e) {
	var val = document.getElementById("input-container").firstElementChild.value;
	if (val) {
		if (val != window.lastVal) {
			if (window.writing) {
				clearTimeout(window.writing);
				window.writing = false;
			}
			getData(val);
		}
	}
}

function checkTtip(e) {
	if (window.tip) {
		if (e.type == "click") {
			if (e.target.id != "tooltip" && e.target.className.indexOf("hanzi") == -1 && e.target.className.indexOf("pinyin") == -1) {
				document.body.removeChild(window.tip[0]);
				window.tip = null;
			}
		} else {
			document.body.removeChild(window.tip[0]);
			window.tip = null;
		}
	}
}

function getData(data) {
	var req = new XMLHttpRequest();
	req.open("POST", "http://"+window.host+"/text", true);
	req.addEventListener("readystatechange", function(e){
		if (e.target.readyState == 4 && e.target.status == 200){
			var data = JSON.parse(e.target.response);
			if (data["status"] == "OK") {
				display(data["result"]);
			}
		}
	});
	req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	req.send(JSON.stringify({"text": data}));
}
