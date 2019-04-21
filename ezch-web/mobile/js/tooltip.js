
//function refreshTooltip() {}


/*




eventlerde yok olma ekle

https://lbda.net/oWn.jpg







*/


function tooltipCreate(text, element) {
	var docW = document.body.getBoundingClientRect()["width"];
	var docH = document.body.getBoundingClientRect()["height"];
	var tool = document.createElement("div");
	var e = element.getBoundingClientRect();
	tool.className = "tooltip-main";
	var tooltip = document.createElement("span");
	tooltip.innerHTML = text;
	tool.appendChild(tooltip);
	tool.style.opacity = 0;
	tool.style.pointerEvents = "none";
	tool.style.zIndex = -5000;
	tooltip.style.maxHeight = (window.innerHeight/2).toString()+"px";
	tooltip.style.minWidth = (window.innerWidth*0.7/(window.innerWidth/window.innerHeight*2)).toString()+"px";
	tool.id = "tooltip";
	document.body.appendChild(tool);
	tool = document.getElementById("tooltip");
	var t = tool.firstChild.getBoundingClientRect();
	if (t["height"] < e["top"]) {
		let h = e["top"] - t["height"];
		tool.style.top = h.toString()+"px";
	} else {
		let h = e["top"] + e["height"];
		tool.style.top = h.toString()+"px";
	}
	if (t["width"]/2 + e["width"]/2 + e["left"] > docW) {
		tool.style.right = t["width"].toString()+"px";
	} else if (t["width"]/2 - e["width"]/2 > e["left"]) {
		tool.style.left = "0px";
	} else {
		tool.style.left = (e["left"] - t["width"]/2 + e["width"]/2).toString()+"px";
	}
	tool.style.opacity = null;
	tool.style.pointerEvents = null;
	tool.style.zIndex = null;
	return tool;
}

/*
document.getElementById("xxx").style.left = 0;
document.getElementById("xxx").style.top = 0;

document.getElementById("xxx").addEventListener("drag", (e)=>{
	e.target.style.left = e.x.toString()+"px";
	e.target.style.top = e.y.toString()+"px";
});
document.getElementById("xxx").addEventListener("dragend", (e)=>{
	e.target.style.left = e.x.toString()+"px";
	e.target.style.top = e.y.toString()+"px";
	if (window.tooltip) {
		document.body.removeChild(window.tooltip);
	}
	window.tooltip = tooltipCreate("asdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwae", document.getElementById("xxx"));
});

window.tooltip = tooltipCreate("asdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwaeasdfsrkijhfgseritgusehrotgiuserhotgsuierhftoseruithfoseiruthgserotguihserotfuihsegrtoiusehrouirwae", document.getElementById("xxx"));*/