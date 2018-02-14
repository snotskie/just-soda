if (location.protocol != "http:"){
  location.protocol = "http:";
}

var data = {};
var key = location.pathname.substring(1);
var cspawner = document.getElementById("cspawner");

var comments = {"cs": "//", "vb": "'", "java": "//", "py": "#", "cpp": "//", "php": "//", "js": "//"};
var languageChoices = {"cs": 1, "vb": 2, "java": 4, "py": 24, "cpp": 7, "php": 8, "js": 23};
var compilerArgs = {"cs": "", "vb": "", "java": "", "py": "", "cpp": "-Wall -std=c++14 -O2 -o a.out source_file.cpp", "php": "", "js": ""};

function push(){
  var post = new XMLHttpRequest();
  post.open("POST", "/data", true);
  post.setRequestHeader('Content-Type', 'application/json');
  post.send(JSON.stringify({"key": key, "data": data}));
}

function init(id){
  var container = document.createElement("div");
  var codearea = document.createElement("textarea");
  var runner = document.createElement("button");
  container.setAttribute("class", "container");
  codearea.setAttribute("class", "codearea " + data[id].lang);
  runner.setAttribute("class", "runner");
  container.setAttribute("id", "c" + id);
  codearea.setAttribute("id", "a" + id);
  runner.setAttribute("id", "b" + id);
  codearea.setAttribute("spellcheck", "false");
  codearea.style.borderColor = "#" + id;
  container.appendChild(codearea);
  container.appendChild(runner);
  runner.innerHTML = "run";
  cspawner.parentNode.insertBefore(container, cspawner);
  
  // On Key Up
  var T = 0;
  codearea.onkeyup = function(){
    data[id].time = (new Date).getTime();
    data[id].text = codearea.value;
    if (T != 0){
      clearTimeout(T);
    }

    T = setTimeout(function(){
      push();
      T = 0;
    }, 200);
  };
  // End On Key Up
  
  // On Run
  var toggle = true;
  runner.onclick = function(){
    if (toggle){
      toggle = false;
      runner.innerHTML = "...";
      var post = new XMLHttpRequest();
      post.open("POST", "//rextester.com/rundotnet/api", true);
      post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      post.onreadystatechange = function(){
        if (post.readyState == 4 && post.status == 200){
          var resp = JSON.parse(post.response);
          if (resp.Warnings){
            var text = resp.Warnings.trim().split("\n").join("\n"+comments[data[id].lang]+" ");
            codearea.value += ("\n\n"+comments[data[id].lang]+" ") +
                              "Warnings:" +
                              ("\n"+comments[data[id].lang]+" ") +
                              text;
          }

          if (resp.Errors){
            var text = resp.Errors.trim().split("\n").join("\n"+comments[data[id].lang]+" ");
            codearea.value += ("\n\n"+comments[data[id].lang]+" ") +
                              "Errors:" +
                              ("\n"+comments[data[id].lang]+" ") +
                              text;
          }

          if (resp.Result){
            var text = resp.Result.trim().split("\n").join("\n"+comments[data[id].lang]+" ");
            codearea.value += ("\n\n"+comments[data[id].lang]+" ") +
                              "Result:" +
                              ("\n"+comments[data[id].lang]+" ") +
                              text;
          }

          codearea.onkeyup();
          runner.innerHTML = "run";
          toggle = true;
        }
      }
    };

    post.send("LanguageChoice="+encodeURIComponent(languageChoices[data[id].lang])+"&"+
              "Input="+encodeURIComponent("")+"&"+
              "CompilerArgs="+encodeURIComponent(compilerArgs[data[id].lang])+"&"+
              "Program="+encodeURIComponent(codearea.value));
  };
  // End On Run
}

function pull(){
  var get = new XMLHttpRequest();
  get.open("GET", "/data?key="+key, true);
  get.onreadystatechange = function(){
    if (get.readyState == 4 && get.status == 200){
      var datap = JSON.parse(get.response);
      for (var id in datap){
        if (typeof data[id] === "undefined"){
          data[id] = {};
          data[id].lang = datap[id].lang;
          data[id].time = 0;
          data[id].text = "";
        }
        
        if (document.getElementById("a" + id) === null){
          init(id);
        }
        
        if (datap[id].time > data[id].time){
          data[id].time = datap[id].time;
          data[id].text = datap[id].text;
          document.getElementById("a" + id).value = data[id].text;
        }
      }
    }
  }
  
  get.send();
}

function spawn(lang){
  var id = (Math.floor(Math.random()*16777216)).toString(16);
  while (id in data){
    id = (Math.floor(Math.random()*16777216)).toString(16);
  }
  
  data[id] = {
    "lang": lang,
    "time": 0,
    "text": ""
  };
  
  push();
}

pull();
setInterval(pull, 800);