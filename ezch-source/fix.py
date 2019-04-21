# Required files:
# 	-	cedict_ts.u8 (Found here "https://www.mdbg.net/chinese/dictionary?page=cc-cedict",
#	download the "cedict_1_0_ts_utf-8_mdbg.zip")

# 	-	Unihan_Readings.txt (Found inside "https://unicode.org/Public/UNIDATA/Unihan.zip")

# This script generates 6 files in according formats:
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
#	-	Json scrambled english - turkish(or any language of your choice)
#	translation. Will add proper version later.

import json, os, requests, json, queue, time
from threading import Thread

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


class translated:
	def __init__(self):
		# In this section the google api key gets defined so you can just type:
		# self.key="YOUR_KEY" instead of these lines. You can get your api key
		# from google developer console by creating an app, adding translate
		# api and adding a auth method as rest api so you can use that key here.
		with open(os.environ["HOME"]+"/sss.txt") as f:
			self.key = f.read().replace("\n", "")
		#---------------------------------------------
		self.api = "https://www.googleapis.com/language/translate/v2?key={}".format(self.key)
		self.requestTemplate = {"q": [], "source": "en", "target": "tr", "format": "text"}
		self.texts = []
		self.parts = queue.Queue()
		self.results = []
		self.count = 0
		self.repl = []
	def comp(self):
		with open("output/hanzi.json") as f:
			hanziList = json.loads(f.read())
		with open("output/words1.json") as f:
			wordList = json.loads(f.read())
		dummy = {}
		for key in hanziList:
			if "kDefinition" in hanziList[key]:
				for defs in hanziList[key]["kDefinition"]:
					if defs not in dummy:
						dummy[defs] = 1
					else:
						dummy[defs] += 1
		for word in wordList:
			for defs in wordList[word]["definitions"]:
				if defs not in dummy:
					dummy[defs] = 1
				else:
					dummy[defs] += 1
		state = len(dummy)
		while True:
			temp = []
			if state != 0:
				for key in dummy:
					if dummy[key] != 0:
						temp.append(key)
						if len(temp) == 128 or state == 1:
							self.parts.put(temp)
							state += -1
							break
						else:
							dummy[key] = 0
							state += -1
			else:
				break
		self.ts = {}
		for tcount in range(5):
			self.ts["th-"+str(tcount)] = Thread(target=self.run, daemon=True)
			self.ts["th-"+str(tcount)].start()

		test = Thread(target=self.debug, daemon=False)
		test.start()
		#self.partnumber =
		#print(len(json.dumps(self.texts).encode("utf-8"))/204800)

	def debug(self):
		while True:
			print(self.parts.qsize())
			check = 0
			for t in self.ts:
				if not self.ts[t].is_alive():
					check += 1
			print("Check: {}".format(check))
			if check == 5:
				with open("output/not_sorted_translation.json", "w") as f:
					f.write(json.dumps(self.results))
					break
			time.sleep(5)
	def run(self):
		while True:
			if not self.parts.empty():
				query = self.requestTemplate
				qq = self.parts.get(block=False)
				query["q"] = qq
				while True:
					try:
						resp = requests.post(self.api, data=query).json()
						if "error" not in resp:
							break
						else:
							print(resp)
							print("Waiting...")
							time.sleep(10)
					except:
						print("Waiting...")
						time.sleep(10)
						continue
				# self.results = resp["data"]["translations"]
				self.results.append([resp, qq])
				time.sleep(2)
			else:
				break
		# for text in self.texts:
		# 	query = self.requestTemplate
		# 	query["q"] = text
		# 	resp = requests.post(self.api, data=query).json()
		# 	print(resp)
		# 	break

req = translated()
req.comp()
#req.run()
