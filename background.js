chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("index.html",
    {  frame: "chrome", width: 900,
       height: 450,
       minWidth: 220,
       minHeight: 220
    },
    function(wdw){
    	wdw.maximize();
    }
  );
});

