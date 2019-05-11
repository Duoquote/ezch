import os, re, sys, shutil
from pprint import pprint

mobileDir = "./mobile"
mobileDir = mobileDir.replace("\\", "/")
if mobileDir[-1] == "/":
    mobileDir = mobileDir[:-1]
notation = re.compile(r"^\/\/\s*#\$")

class jsCompiler:
    def __init__(self):
        self.blacklist = {"files": ["android.py"], "folders": ["mobile"]}
        self.files = []
        for path, folder, fileName in os.walk("."):
            path = path.replace("\\", "/")
            if folder not in self.blacklist["folders"]:
                if not path.startswith(mobileDir):
                    newPath = path.replace(".", mobileDir+"/").replace("//", "/")
                    if newPath[-1] == "/":
                        newPath = newPath[:-1]
                    for file in fileName:
                        if file not in self.blacklist["files"]:
                            newFile = (newPath+"/"+file)
                            file = path+"/"+file
                            self.files.append([newPath, file, newFile])
        pprint(self.files)
    def run(self):
        for file in self.files:
            if not os.path.exists(file[0]):
                os.makedirs(file[0])
            shutil.copy(file[1], file[2])

jsCompiler().run()
