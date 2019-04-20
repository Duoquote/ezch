# Required files:
# 	-	cedict_ts.u8 (Found here "https://www.mdbg.net/chinese/dictionary?page=cc-cedict",
#	download the "cedict_1_0_ts_utf-8_mdbg.zip")

# 	-	Unihan_Readings.txt (Found inside "https://unicode.org/Public/UNIDATA/Unihan.zip")

# This script generates 5 files in according formats:
# 	-	Json Hanzis (hanzi.json), you can access hanzi definitions by loading
# 	and accessing data like `data["hanzi-decimal-value"]` example:
# 	`data["21018"]`.

# 	-	Json Hanzis (List Format) [hanzi1.json], by using this file you can access
# 	data by iterating the json objects like:
# 		`for i in data: 
# 			print(i) //{"chr": "char", "def": "definition"}`
# 	data would be like:
# 		[{"chr": "character's decimal value", "def", "definition"}, {}, {}, {}....]

# 	-	Chinese Words Json List, similar to hanzi.json.

# 	-	Chinese Words Json List, similar to hanzi1.json.

import json, os
if not os.path.exists("output/"):
	os.mkdir("output")
newlist = {}
with open("Unihan_Readings.txt", "r", encoding="UTF-8") as f:
	for line in f:
		if not line.startswith("#") and line != "\n":
			lineD = line.split("\t")
			char = ord(chr(int(lineD[0].split("+")[1], 16)))
			if char not in newlist:
				newlist[char] = {}
				if lineD[1] == "kDefinition":
					newlist[char][lineD[1]] = lineD[2].split(",")
				else:
					newlist[char][lineD[1]] = lineD[2]
			else:
				if lineD[1] == "kDefinition":
					newlist[char][lineD[1]] = lineD[2].split(",")
				else:
					newlist[char][lineD[1]] = lineD[2]
with open("output/hanzi.json", "w") as f:
	f.write(json.dumps(newlist))
newnew = []
with open("output/hanzi.json", "r") as f:
	data = json.loads(f.read())
	for key in data:
		status = 0
		for i in data[key]:
			if i == "kMandarin":
				status = 1
		if status == 1 and "kDefinition" in data[key]:
			temp = {}
			temp["chr"] = key
			temp["def"] = data[key]["kDefinition"][:-1]
			newnew.append(temp)
with open("output/hanzi1.json", "w") as f:
	f.write(json.dumps(newnew))
neww = []
with open("cedict_ts.u8", "r", encoding="utf-8") as f:
	for line in f:
		if not line.startswith("#"):
			temp = {}
			temp["word"] = line.split(" ")[1]
			temp["tra"] = line.split(" ")[0]
			temp["pinyin"] = line.split("[")[1].split("]")[0]
			temp["definitions"] = []
			x = line[:-1].split("/")
			for i in range(len(x)):
				if i != 0 and i != len(x)-1:
					temp["definitions"].append(x[i])
			neww.append(temp)
with open("output/words.json", "w") as f:
	f.write(json.dumps(neww))
newx = {}
for i in neww:
	newx[i["word"]] = {}
	newx[i["word"]]["tra"] = i["tra"]
	newx[i["word"]]["pinyin"] = i["pinyin"]
	newx[i["word"]]["definitions"] = i["definitions"]
with open("output/words1.json", "w") as f:
	f.write(json.dumps(newx))