import os, re


class jsCreate:
    def __init__(self):
        self.template = """
        var app = {
            initialize: function() {
        {}
            }
        };
        app.initialize();
        """
        self.files = ["main.js"]
        self.checkf = os.listdir("js")

        self.initPart = ""
        self.mainPart = ""

        self.lastProcess = ""
        self.lastStatus = "END"

    def jsHandler(self, process):
        command = re.sub(r"( |\n|\r|//)", "", process)
        if process.startswith("//") and command[0] == "$":
            self.lastProcess = "INIT"
            self.lastStatus = command.split("-")[1]
        else:
            if self.lastProcess == "INIT" and self.lastStatus == "START":
                if process != "\n":
                    self.initPart += process
            else:
                self.mainPart += process

    def run(self):
        for filename in self.files:
            if filename in self.checkf:
                f = open(filename)
                fdata = f.readlines()
                f.close()
                for line in fdata:
                    self.jsHandler(line)
            else:
                print("Invalid file name(s)")
        with open("index.js")


class copySource:
    def __init__(self):
        self.prefix = "mobile"
        self.blacklist = ["main.js", "web.js", "android.py"]
        self.folders = ["."]

    def run(self):
        for f in os.listdir():
            if "." not in f:
                self.folders.append(f)
        del self.folders[self.folders.index(self.prefix)]

        for folder in self.folders:
            if not os.path.exists(self.prefix+"/"+folder):
                os.mkdir(self.prefix+"/"+folder)
            fi = os.listdir(folder)
            files = []
            for x in fi:
                if "." in x:
                    files.append(x)
            for file in files:
                if file not in self.blacklist and ".scss" not in file:
                    if folder == ".":
                        path = "cp {file} {prefix}/{file}".format(file=file, prefix=self.prefix)
                    else:
                        path = "cp {folder}/{file} {prefix}/{folder}/{file}".format(folder=folder, prefix=self.prefix, file=file)
                    os.system(path)

jsCreate().run()
copySource().run()


#with open("mobile/")
