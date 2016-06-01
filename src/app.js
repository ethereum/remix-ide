var $ = require('jquery');
var UniversalDApp = require('./universal-dapp.js');
var web3 = require('./web3-adapter.js');
var ace = require('brace');
require('./mode-solidity.js');

// The event listener needs to be registered as early as possible, because the
// parent will send the message upon the "load" event.
var filesToLoad = null;
var loadFilesCallback = function(files) { filesToLoad = files; }; // will be replaced later
window.addEventListener("message", function(ev) {
	if (typeof ev.data == typeof [] && ev.data[0] === "loadFiles") {
		loadFilesCallback(ev.data[1]);
	}
}, false);

var Base64 = require('js-base64').Base64;

var run = function() {

	// ------------------ query params (hash) ----------------

	function getQueryParams() {

		var qs = window.location.hash.substr(1);

		if (window.location.search.length > 0) {
			// use legacy query params instead of hash
			window.location.hash = window.location.search.substr(1);
			window.location.search = "";
		}

		var params = {};
		var parts = qs.split("&");
		for (var x in parts) {
			var keyValue = parts[x].split("=");
			if (keyValue[0] !== "") params[keyValue[0]] = keyValue[1];
		}
		return params;
	}

	function updateQueryParams(params) {
		var currentParams = getQueryParams();
		var keys = Object.keys(params);
		for (var x in keys) {
			currentParams[keys[x]] = params[keys[x]];
		}
		var queryString = "#";
		var updatedKeys = Object.keys(currentParams);
		for( var y in updatedKeys) {
			queryString += updatedKeys[y] + "=" + currentParams[updatedKeys[y]] + "&";
		}
		window.location.hash = queryString.slice(0, -1);
	}


	function syncQueryParams() {
		$('#optimize').attr( 'checked', (getQueryParams().optimize == "true") );
	}


	window.onhashchange = syncQueryParams;
	syncQueryParams();

	// ------------------ gist load ----------------

	function getGistId(str) {
		var idr = /[0-9A-Fa-f]{8,}/;
		var match = idr.exec(str);
		return match ? match[0] : null;
	}
	function loadFiles(files) {
		for (var f in files) {
			var key = fileKey(f);
			var content = files[f].content;
			if (key in window.localStorage && window.localStorage[key] != content) {
				var count = '';
				var otherKey = key + count;
				while ((key + count) in window.localStorage) count = count - 1;
				window.localStorage[key + count] = window.localStorage[key];
			}
			window.localStorage[key] = content;
		}
		SOL_CACHE_FILE = fileKey(Object.keys(files)[0]);
		updateFiles();
	}

	var queryParams = getQueryParams();
	var loadingFromGist = false;
	if (typeof queryParams['gist'] != undefined) {
		var gistId;
		if (queryParams['gist'] === '') {
			var str = prompt("Enter the URL or ID of the Gist you would like to load.");
			if (str !== '') {
				gistId = getGistId( str );
				loadingFromGist = !!gistId;
			}
		} else {
			gistId = queryParams['gist'];
			loadingFromGist = !!gistId;
		}
		if (loadingFromGist) $.ajax({
			url: 'https://api.github.com/gists/'+gistId,
			jsonp: 'callback',
			dataType: 'jsonp',
			success: function(response){
				if (response.data) {
					if (!response.data.files) {
						alert( "Gist load error: " + response.data.message );
						return;
					}
					loadFiles(response.data.files);
				}
			}
		});
	}

	loadFilesCallback = function(files) {
		loadFiles(files);
	};
	if (filesToLoad !== null)
		loadFiles(filesToLoad);

	// ----------------- storage --------------------

	function syncStorage() {

		if (typeof chrome === 'undefined' || !chrome || !chrome.storage || !chrome.storage.sync) return;

		var obj = {};
		var done = false;
		var count = 0;
		var dont = 0;

		function check(key){
			chrome.storage.sync.get( key, function(resp){
				console.log("comparing to cloud", key, resp);
				if (typeof resp[key] != 'undefined' && obj[key] !== resp[key] && confirm("Overwrite '" + fileNameFromKey(key) + "'? Click Ok to overwrite local file with file from cloud. Cancel will push your local file to the cloud.")) {
					console.log("Overwriting", key );
					localStorage.setItem( key, resp[key] );
					updateFiles();
				} else {
					console.log( "add to obj", obj, key);
					obj[key] = localStorage[key];
				}
				done++;
				if (done >= count) chrome.storage.sync.set( obj, function(){
					console.log( "updated cloud files with: ", obj, this, arguments);
				});
			});
		}

		for (var y in window.localStorage) {
			console.log("checking", y);
			obj[y] = window.localStorage.getItem(y);
			if (y.indexOf(SOL_CACHE_FILE_PREFIX) !== 0) continue;
			count++;
			check(y);
		}


	}

	window.syncStorage = syncStorage;
	syncStorage();



	// ----------------- editor ----------------------

	var SOL_CACHE_FILE_PREFIX = 'sol-cache-file-';
	var SOL_CACHE_UNTITLED = SOL_CACHE_FILE_PREFIX + 'Untitled';
	var SOL_CACHE_FILE = null;

	var editor = ace.edit("input");
	var sessions = {};

	var Range = ace.acequire('ace/range').Range;
	var errMarkerId = null;

	var untitledCount = '';
	if (!getFiles().length || window.localStorage['sol-cache']) {
		if(loadingFromGist) return;
		// Backwards-compatibility
		while (window.localStorage[SOL_CACHE_UNTITLED + untitledCount])
			untitledCount = (untitledCount - 0) + 1;
		SOL_CACHE_FILE = SOL_CACHE_UNTITLED + untitledCount;
		window.localStorage[SOL_CACHE_FILE] = window.localStorage['sol-cache'] || BALLOT_EXAMPLE;
		window.localStorage.removeItem('sol-cache');
	}

	SOL_CACHE_FILE = getFiles()[0];


	var files = getFiles();
	for (var x in files) {
		sessions[files[x]] = newEditorSession(files[x]);
	}

	editor.setSession( sessions[SOL_CACHE_FILE] );
	editor.resize(true);

	function newEditorSession(filekey) {
		var s = new ace.EditSession(window.localStorage[filekey], "ace/mode/javascript");
		s.setUndoManager(new ace.UndoManager());
		s.setTabSize(4);
		s.setUseSoftTabs(true);
		sessions[filekey] = s;
		return s;
	}



	// ----------------- tabbed menu -------------------

	$('#options li').click(function(ev){
		var $el = $(this);
		var match = /[a-z]+View/.exec( $el.get(0).className );
		if (!match) return;
		var cls = match[0];
		if (!$el.hasClass('active')) {
			$el.parent().find('li').removeClass('active');
			$('#optionViews').attr('class', '').addClass(cls);
			$el.addClass('active');
		} else {
			$el.removeClass('active');
			$('#optionViews').removeClass(cls);
		}
	});

	// ----------------- execution context -------------

	var $vmToggle = $('#vm');
	var $web3Toggle = $('#web3');
	var $web3endpoint = $('#web3Endpoint');

	if (web3.providers && web3.currentProvider instanceof web3.providers.IpcProvider)
		$web3endpoint.val('ipc');

	var executionContext = 'vm';
	$vmToggle.get(0).checked = true;

	$vmToggle.on('change', executionContextChange );
	$web3Toggle.on('change', executionContextChange );
	$web3endpoint.on('change', function() {
		setProviderFromEndpoint();
		if (executionContext == 'web3') compile();
	});

	function executionContextChange (ev) {
		if (ev.target.value == 'web3' && !confirm("Are you sure you want to connect to a local ethereum node?") ) {
			$vmToggle.get(0).checked = true;
			executionContext = 'vm';
		} else {
			executionContext = ev.target.value;
			setProviderFromEndpoint();
		}
		compile();
	}

	function setProviderFromEndpoint() {
		var endpoint = $web3endpoint.val();
		if (endpoint == 'ipc')
			web3.setProvider(new web3.providers.IpcProvider());
		else
			web3.setProvider(new web3.providers.HttpProvider(endpoint));
	}


	// ------------------ gist publish --------------

	var packageFiles = function() {
		var files = {};
		var filesArr = getFiles();

		for (var f in filesArr) {
			files[fileNameFromKey(filesArr[f])] = {
				content: localStorage[filesArr[f]]
			};
		}
		return files;
	};

	$('#gist').click(function(){
		if (confirm("Are you sure you want to publish all your files anonymously as a public gist on github.com?")) {

			var files = packageFiles();
			var description = "Created using browser-solidity: Realtime Ethereum Contract Compiler and Runtime. \n Load this file by pasting this gists URL or ID at https://ethereum.github.io/browser-solidity/#version=" + getQueryParams().version + "&optimize="+ getQueryParams().optimize +"&gist=";

			$.ajax({
				url: 'https://api.github.com/gists',
				type: 'POST',
				data: JSON.stringify({
					description: description,
					public: true,
					files: files
				})
			}).done(function(response) {
				if (response.html_url && confirm("Created a gist at " + response.html_url + " Would you like to open it in a new window?")) {
					window.open( response.html_url, '_blank' );
				}
			});
		}
	});

	$('#copyOver').click(function(){
		var target = prompt(
			"To which other browser-solidity instance do you want to copy over all files?",
			"https://ethereum.github.io/browser-solidity/"
		);
		if (target === null)
			return;
		var files = packageFiles();
		var iframe = $('<iframe/>', {src: target, style: "display:none;", load: function() {
			this.contentWindow.postMessage(["loadFiles", files], "*");
		}}).appendTo('body');
	});

	// ----------------- file selector-------------

	var $filesEl = $('#files');
	var FILE_SCROLL_DELTA = 300;

	$('.newFile').on('click', function() {
		untitledCount = '';
		while (window.localStorage[SOL_CACHE_UNTITLED + untitledCount])
			untitledCount = (untitledCount - 0) + 1;
		SOL_CACHE_FILE = SOL_CACHE_UNTITLED + untitledCount;
		sessions[SOL_CACHE_FILE] = null;
		window.localStorage[SOL_CACHE_FILE] = '';
		updateFiles();

		$filesEl.animate({left: Math.max( (0 - activeFilePos() + (FILE_SCROLL_DELTA/2)), 0)+ "px"}, "slow", function(){
			reAdjust();
		});
	});

	$filesEl.on('click', '.file:not(.active)', showFileHandler);

	$filesEl.on('click', '.file.active', function(ev) {
		var $fileTabEl = $(this);
		var originalName = $fileTabEl.find('.name').text();
		ev.preventDefault();
		if ($(this).find('input').length > 0) return false;
		var $fileNameInputEl = $('<input value="'+originalName+'"/>');
		$fileTabEl.html($fileNameInputEl);
		$fileNameInputEl.focus();
		$fileNameInputEl.select();
		$fileNameInputEl.on('blur', handleRename);
		$fileNameInputEl.keyup(handleRename);

		function handleRename(ev) {
			ev.preventDefault();
			if (ev.which && ev.which !== 13) return false;
			var newName = ev.target.value;
			$fileNameInputEl.off('blur');
			$fileNameInputEl.off('keyup');

			if (newName !== originalName && confirm("Are you sure you want to rename: " + originalName + " to " + newName + '?')) {
				var content = window.localStorage.getItem( fileKey(originalName) );
				window.localStorage[fileKey( newName )] = content;
				window.localStorage.removeItem( fileKey( originalName) );
				SOL_CACHE_FILE = fileKey( newName );
			}

			updateFiles();
			return false;
		}

		return false;
	});

	$filesEl.on('click', '.file .remove', function(ev) {
		ev.preventDefault();
		var name = $(this).parent().find('.name').text();
		var index = getFiles().indexOf( fileKey(name) );

		if (confirm("Are you sure you want to remove: " + name + " from local storage?")) {
			window.localStorage.removeItem( fileKey( name ) );
			SOL_CACHE_FILE = getFiles()[ Math.max(0, index - 1)];
			updateFiles();
		}
		return false;
	});

	function showFileHandler(ev) {
		ev.preventDefault();
		SOL_CACHE_FILE = fileKey( $(this).find('.name').text() );
		updateFiles();
		return false;
	}

	function fileTabFromKey(key) {
		var name = fileNameFromKey(key);
		return $('#files .file').filter(function(){ return $(this).find('.name').text() == name; });
	}


	function updateFiles() {
		var $filesEl = $('#files');
		var files = getFiles();

		$filesEl.find('.file').remove();

		for (var f in files) {
			$filesEl.append(fileTabTemplate(files[f]));
		}

		if (SOL_CACHE_FILE) {
			var active = fileTabFromKey(SOL_CACHE_FILE);
			active.addClass('active');
			editor.setSession( sessions[SOL_CACHE_FILE] );
			editor.focus();
		}
		$('#input').toggle( !!SOL_CACHE_FILE );
		$('#output').toggle( !!SOL_CACHE_FILE );
		reAdjust();
	}

	function fileTabTemplate(key) {
		var name = fileNameFromKey(key);
		return $('<li class="file"><span class="name">'+name+'</span><span class="remove"><i class="fa fa-close"></i></span></li>');
	}

	function fileKey( name ) {
		return SOL_CACHE_FILE_PREFIX + name;
	}

	function fileNameFromKey(key) {
		return key.replace( SOL_CACHE_FILE_PREFIX, '' );
	}

	function getFiles() {
		var files = [];
		for (var f in localStorage ) {
			if (f.indexOf( SOL_CACHE_FILE_PREFIX, 0 ) === 0) {
				files.push(f);
				if (!sessions[f]) sessions[f] = newEditorSession(f);
			}
		}
		return files;
	}


	$filesWrapper = $('.files-wrapper');
	$scrollerRight = $('.scroller-right');
	$scrollerLeft = $('.scroller-left');

	function widthOfList (){
		var itemsWidth = 0;
		$('.file').each(function(){
			var itemWidth = $(this).outerWidth();
			itemsWidth += itemWidth;
		});
		return itemsWidth;
	}

	function widthOfHidden(){
		return (($filesWrapper.outerWidth()) - widthOfList() - getLeftPosi());
	}

	function widthOfVisible(){
		return $filesWrapper.outerWidth();
	}

	function getLeftPosi(){
		return $filesEl.position().left;
	}

	function activeFilePos() {
		var el = $filesEl.find('.active');
		var l = el.position().left;
		return l;
	}

	function reAdjust (){
		if (widthOfList() + getLeftPosi() > + widthOfVisible()) {
			$scrollerRight.fadeIn('fast');
		} else {
			$scrollerRight.fadeOut('fast');
		}

		if (getLeftPosi()<0) {
			$scrollerLeft.fadeIn('fast');
		} else {
			$scrollerLeft.fadeOut('fast');
			$filesEl.animate({left: getLeftPosi() + "px"},'slow');
		}
	}

	$scrollerRight.click(function() {
		var delta = (getLeftPosi() - FILE_SCROLL_DELTA);
		$filesEl.animate({left: delta + "px"},'slow',function(){
			reAdjust();
		});
	});

	$scrollerLeft.click(function() {
		var delta = Math.min( (getLeftPosi() + FILE_SCROLL_DELTA), 0 );
		$filesEl.animate({left: delta + "px"},'slow',function(){
			reAdjust();
		});
	});

	updateFiles();

	// ----------------- version selector-------------

	// var soljsonSources is provided by bin/list.js

	$('option', '#versionSelector').remove();
	$.each(soljsonSources, function(i, file) {
		if (file) {
			var version = file.replace(/soljson-(.*).js/, "$1");
			$('#versionSelector').append(new Option(version, file));
		}
	});
	$('#versionSelector').change(function() {
		updateQueryParams({version: $('#versionSelector').val() });
		loadVersion($('#versionSelector').val());
	});

	// ----------------- resizeable ui ---------------

	var EDITOR_SIZE_CACHE_KEY = "editor-size-cache";
	var dragging = false;
	$('#dragbar').mousedown(function(e){
		e.preventDefault();
		dragging = true;
		var main = $('#righthand-panel');
		var ghostbar = $('<div id="ghostbar">', {
			css: {
				top: main.offset().top,
				left: main.offset().left
			}
		}).prependTo('body');

		$(document).mousemove(function(e){
			ghostbar.css("left",e.pageX+2);
		});
	});

	var $body = $('body');

	function setEditorSize (delta) {
		$('#righthand-panel').css("width", delta);
		$('#editor').css("right", delta);
		onResize();
	}

	function getEditorSize(){
		window.localStorage[EDITOR_SIZE_CACHE_KEY] = $('#righthand-panel').width();
	}

	$(document).mouseup(function(e){
		if (dragging) {
			var delta = $body.width() - e.pageX+2;
			$('#ghostbar').remove();
			$(document).unbind('mousemove');
			dragging = false;
			setEditorSize(delta);
			window.localStorage.setItem(EDITOR_SIZE_CACHE_KEY, delta);
			reAdjust();
		}
	});

	// set cached defaults
	var cachedSize = window.localStorage.getItem(EDITOR_SIZE_CACHE_KEY);
	if (cachedSize) setEditorSize(cachedSize);
	else getEditorSize();


	// ----------------- toggle right hand panel -----------------

	var hidingRHP = false;
	$('.toggleRHP').click(function(){
		hidingRHP = !hidingRHP;
		setEditorSize( hidingRHP ? 0 : window.localStorage[EDITOR_SIZE_CACHE_KEY] );
		$('.toggleRHP i').toggleClass('fa-angle-double-right', !hidingRHP);
		$('.toggleRHP i').toggleClass('fa-angle-double-left', hidingRHP);
		if (!hidingRHP) compile();
	});


	// ----------------- editor resize ---------------

	function onResize() {
		editor.resize();
		var session = editor.getSession();
		session.setUseWrapMode(document.querySelector('#editorWrap').checked);
		if(session.getUseWrapMode()) {
			var characterWidth = editor.renderer.characterWidth;
			var contentWidth = editor.container.ownerDocument.getElementsByClassName("ace_scroller")[0].clientWidth;

			if(contentWidth > 0) {
				session.setWrapLimit(parseInt(contentWidth / characterWidth, 10));
			}
		}
		reAdjust();
	}
	window.onresize = onResize;
	onResize();

	document.querySelector('#editor').addEventListener('change', onResize);
	document.querySelector('#editorWrap').addEventListener('change', onResize);


	// ----------------- compiler ----------------------
	var compileJSON;
	var compilerAcceptsMultipleFiles;

	var previousInput = '';
	var sourceAnnotations = [];
	var compile = function(missingInputs) {
		editor.getSession().clearAnnotations();
		sourceAnnotations = [];
		editor.getSession().removeMarker(errMarkerId);
		$('#output').empty();
		var input = editor.getValue();
		window.localStorage.setItem(SOL_CACHE_FILE, input);

		var files = {};
		files[fileNameFromKey(SOL_CACHE_FILE)] = input;
		gatherImports(files, missingInputs, function(input, error) {
			$('#output').empty();
			if (input === null) {
				renderError(error);
			} else {
				var optimize = getQueryParams().optimize;
				compileJSON(input, optimize ? 1 : 0);
			}
		});
	};
	var compilationFinished = function(result, missingInputs) {
		var data;
		var noFatalErrors = true; // ie warnings are ok

		try {
			data = $.parseJSON(result);
		} catch (exception) {
			renderError('Invalid JSON output from the compiler: ' + exception);
			return;
		}

		if (data['error'] !== undefined) {
			renderError(data['error']);
			if (errortype(data['error']) !== 'warning') noFatalErrors = false;
		}
		if (data['errors'] != undefined) {
			$.each(data['errors'], function(i, err) {
				renderError(err);
				if (errortype(err) !== 'warning') noFatalErrors = false;
			});
		}

		if (missingInputs !== undefined && missingInputs.length > 0)
			compile(missingInputs);
		else if (noFatalErrors && !hidingRHP)
			renderContracts(data, editor.getValue());
	};

	var compileTimeout = null;
	var onChange = function() {
		var input = editor.getValue();
		if (input === "") {
			window.localStorage.setItem(SOL_CACHE_FILE, '');
			return;
		}
		if (input === previousInput)
			return;
		previousInput = input;
		if (compileTimeout) window.clearTimeout(compileTimeout);
		compileTimeout = window.setTimeout(compile, 300);
	};

	var onCompilerLoaded = function() {
		if (worker === null) {
			var compile;
			var missingInputs = [];
			if ('_compileJSONCallback' in Module) {
				compilerAcceptsMultipleFiles = true;
				var missingInputsCallback = Module.Runtime.addFunction(function(path, contents, error) {
					missingInputs.push(Module.Pointer_stringify(path));
				});
				var compileInternal = Module.cwrap("compileJSONCallback", "string", ["string", "number", "number"]);
				compile = function(input, optimize) {
					missingInputs.length = 0;
					return compileInternal(input, optimize, missingInputsCallback);
				};
			} else if ('_compileJSONMulti' in Module) {
				compilerAcceptsMultipleFiles = true;
				compile = Module.cwrap("compileJSONMulti", "string", ["string", "number"]);
			} else {
				compilerAcceptsMultipleFiles = false;
				compile = Module.cwrap("compileJSON", "string", ["string", "number"]);
			}
			compileJSON = function(source, optimize, cb) {
				try {
					var result = compile(source, optimize);
				} catch (exception) {
					result = JSON.stringify({error: 'Uncaught JavaScript exception:\n' + exception});
				}
				compilationFinished(result, missingInputs);
			};
			$('#version').text(Module.cwrap("version", "string", [])());
		}
		previousInput = '';
		onChange();
	};

	var cachedRemoteFiles = {};
	function gatherImports(files, importHints, cb) {
		importHints = importHints || [];
		if (!compilerAcceptsMultipleFiles)
		{
			cb(files[fileNameFromKey(SOL_CACHE_FILE)]);
			return;
		}
		var importRegex = /^\s*import\s*[\'\"]([^\'\"]+)[\'\"];/g;
		var reloop = false;
		do {
			reloop = false;
			for (var fileName in files) {
				var match;
				while (match = importRegex.exec(files[fileName]))
					importHints.push(match[1]);
			}
			while (importHints.length > 0) {
				var m = importHints.pop();
				if (m in files) continue;
				if (getFiles().indexOf(fileKey(m)) !== -1) {
					files[m] = window.localStorage[fileKey(m)];
					reloop = true;
				} else if (m.startsWith('./') && getFiles().indexOf(fileKey(m.slice(2))) !== -1) {
					files[m] = window.localStorage[fileKey(m.slice(2))];
					reloop = true;
				} else if (m in cachedRemoteFiles) {
					files[m] = cachedRemoteFiles[m];
					reloop = true;
				} else if (githubMatch = /^(https?:\/\/)?(www.)?github.com\/([^\/]*\/[^\/]*)\/(.*)/.exec(m)) {
					$('#output').append($('<div/>').append($('<pre/>').text("Loading github.com/" + githubMatch[3] + " ...")));
					$.getJSON('https://api.github.com/repos/' + githubMatch[3] + '/contents/' + githubMatch[4], function(result) {
						if ('content' in result)
						{
							var content = Base64.decode(result.content);
							cachedRemoteFiles[m] = content;
							files[m] = content;
							gatherImports(files, importHints, cb);
						}
						else
							cb(null, "Unable to import \"" + m + "\"");
					}).fail(function(){
						cb(null, "Unable to import \"" + m + "\"");
					});
					return;
				} else {
					cb(null, "Unable to import \"" + m + "\"");
					return;
				}
			}
		} while (reloop);
		cb(JSON.stringify({'sources':files}));
	}

	var initializeWorker = function() {
		if (worker !== null)
			worker.terminate();
		worker = new Worker('worker.js');
		worker.addEventListener('message', function(msg) {
			var data = msg.data;
			switch (data.cmd) {
			case 'versionLoaded':
				$('#version').text(data.data);
				compilerAcceptsMultipleFiles = !!data.acceptsMultipleFiles;
				onCompilerLoaded();
				break;
			case 'compiled':
				compilationFinished(data.data, data.missingInputs);
				break;
			}
		});
		worker.onerror = function(msg) { console.log(msg.data); };
		worker.addEventListener('error', function(msg) { console.log(msg.data); });
		compileJSON = function(source, optimize) {
			worker.postMessage({cmd: 'compile', source: source, optimize: optimize});
		};
	};
	var worker = null;
	var loadVersion = function(version) {
		$('#version').text("(loading)");
		updateQueryParams({version: version});
		var isFirefox = typeof InstallTrigger !== 'undefined';
		if (document.location.protocol != 'file:' && Worker !== undefined && isFirefox) {
			// Workers cannot load js on "file:"-URLs and we get a
			// "Uncaught RangeError: Maximum call stack size exceeded" error on Chromium,
			// resort to non-worker version in that case.
			initializeWorker();
			worker.postMessage({cmd: 'loadVersion', data: 'https://ethereum.github.io/solc-bin/bin/' + version});
		} else {
			Module = null;
			compileJSON = function(source, optimize) { compilationFinished('{}'); };
			var newScript = document.createElement('script');
			newScript.type = 'text/javascript';
			newScript.src = 'https://ethereum.github.io/solc-bin/bin/' + version;
			document.getElementsByTagName("head")[0].appendChild(newScript);
			var check = window.setInterval(function() {
				if (!Module) return;
				window.clearInterval(check);
				onCompilerLoaded();
			}, 200);
		}
	};

	loadVersion( getQueryParams().version || 'soljson-latest.js');

	editor.getSession().on('change', onChange);
	editor.on('changeSession', function(){
		editor.getSession().on('change', onChange);
		onChange();
	});

	document.querySelector('#optimize').addEventListener('change', function(){
		updateQueryParams({optimize: document.querySelector('#optimize').checked });
		compile();
	});

	// ----------------- compiler output renderer ----------------------
	var detailsOpen = {};

	function errortype(message) {
		return message.match(/^.*:[0-9]*:[0-9]* Warning: /) ? 'warning' : 'error';
	}

	var renderError = function(message) {
		var type = errortype(message);
		var $pre = $("<pre />").text(message);
		var $error = $('<div class="sol ' + type + '"><div class="close"><i class="fa fa-close"></i></div></div>').prepend($pre);
		$('#output').append( $error );
		var err = message.match(/^([^:]*):([0-9]*):(([0-9]*):)? /);
		if (err) {
			var errFile = err[1];
			var errLine = parseInt(err[2], 10) - 1;
			var errCol = err[4] ? parseInt(err[4], 10) : 0;
			if (errFile == '' || errFile == fileNameFromKey(SOL_CACHE_FILE)) {
				sourceAnnotations[sourceAnnotations.length] = {
					row: errLine,
					column: errCol,
					text: message,
					type: type
				};
				editor.getSession().setAnnotations(sourceAnnotations);
			}
			$error.click(function(ev){
				if (errFile != '' && errFile != fileNameFromKey(SOL_CACHE_FILE) && getFiles().indexOf(fileKey(errFile)) !== -1) {
					// Switch to file
					SOL_CACHE_FILE = fileKey(errFile);
					updateFiles();
					//@TODO could show some error icon in files with errors
				}
				editor.focus();
				editor.gotoLine(errLine + 1, errCol - 1, true);
			});
			$error.find('.close').click(function(ev){
				ev.preventDefault();
				$error.remove();
				return false;
			});
		}
	};

	var gethDeploy = function(contractName, jsonInterface, bytecode){
		var code = "";
		var funABI = getConstructorInterface($.parseJSON(jsonInterface));

		$.each(funABI.inputs, function(i, inp) {
			code += "var " + inp.name + " = /* var of type " + inp.type + " here */ ;\n";
		});

		code += "var " + contractName + "Contract = web3.eth.contract(" + jsonInterface.replace("\n","") + ");"
			+"\nvar " + contractName + " = " + contractName + "Contract.new(";

		$.each(funABI.inputs, function(i, inp) {
			code += "\n   " + inp.name + ",";
		});

		code += "\n   {"+
		"\n     from: web3.eth.accounts[0], "+
		"\n     data: '"+bytecode+"', "+
		"\n     gas: 4700000"+
		"\n   }, function(e, contract){"+
		"\n    console.log(e, contract);"+
		"\n    if (typeof contract.address != 'undefined') {"+
		"\n         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);" +
		"\n    }" +
		"\n })";


		return code;
	};

	var combined = function(contractName, jsonInterface, bytecode){
		return JSON.stringify([{name: contractName, interface: jsonInterface, bytecode: bytecode}]);
	};

	var renderContracts = function(data, source) {
		var udappContracts = [];
		for (var contractName in data.contracts) {
			var contract = data.contracts[contractName];
			udappContracts.push({
				name: contractName,
				interface: contract['interface'],
				bytecode: contract.bytecode
			});
		}
		var dapp = new UniversalDApp(udappContracts, {
			vm: executionContext === 'vm',
			removable: false,
			getAddress: function(){ return $('#txorigin').val(); },
			getValue: function(){
				var comp = $('#value').val().split(' ');
				return web3.toWei(comp[0], comp.slice(1).join(' '));
			},
			removable_instances: true,
			renderOutputModifier: function(contractName, $contractOutput) {
				var contract = data.contracts[contractName];
				return $contractOutput
					.append(textRow('Bytecode', contract.bytecode))
					.append(textRow('Interface', contract['interface']))
					.append(textRow('Web3 deploy', gethDeploy(contractName.toLowerCase(),contract['interface'],contract.bytecode), 'deploy'))
					.append(textRow('uDApp', combined(contractName,contract['interface'],contract.bytecode), 'deploy'))
					.append(getDetails(contract, source, contractName));
			}});
		var $contractOutput = dapp.render();

		$txOrigin = $('#txorigin');
		function renderAccounts(err, accounts) {
			if (err)
				renderError(err.message);
			if (accounts && accounts[0]){
				$txOrigin.empty();
				for( var a in accounts) { $txOrigin.append($('<option />').val(accounts[a]).text(accounts[a])); }
				$txOrigin.val(accounts[0]);
			} else $txOrigin.val('unknown');
		}

		dapp.getAccounts(renderAccounts);

		$contractOutput.find('.title').click(function(ev){ $(this).closest('.contract').toggleClass('hide'); });
		$('#output').append( $contractOutput );
		$('.col2 input,textarea').click(function() { this.select(); });
	};
	var tableRowItems = function(first, second, cls) {
		return $('<div class="crow"/>')
			.addClass(cls)
			.append($('<div class="col1">').append(first))
			.append($('<div class="col2">').append(second));
	};
	var tableRow = function(description, data) {
		return tableRowItems(
			$('<span/>').text(description),
			$('<input readonly="readonly"/>').val(data));
	};
	var textRow = function(description, data, cls) {
		return tableRowItems(
			$('<strong/>').text(description),
			$('<textarea readonly="readonly" class="gethDeployText"/>').val(data),
			cls);
	};
	var getDetails = function(contract, source, contractName) {
		var button = $('<button>Toggle Details</button>');
		var details = $('<div style="display: none;"/>')
			.append(tableRow('Solidity Interface', contract.solidity_interface))
			.append(tableRow('Opcodes', contract.opcodes));
		var funHashes = '';
		for (var fun in contract.functionHashes)
			funHashes += contract.functionHashes[fun] + ' ' + fun + '\n';
		details.append($('<span class="col1">Functions</span>'));
		details.append($('<pre/>').text(funHashes));
		details.append($('<span class="col1">Gas Estimates</span>'));
		details.append($('<pre/>').text(formatGasEstimates(contract.gasEstimates)));
		if (contract.runtimeBytecode && contract.runtimeBytecode.length > 0)
			details.append(tableRow('Runtime Bytecode', contract.runtimeBytecode));
		if (contract.assembly !== null)
		{
			details.append($('<span class="col1">Assembly</span>'));
			var assembly = $('<pre/>').text(formatAssemblyText(contract.assembly, '', source));
			details.append(assembly);
		}
		button.click(function() { detailsOpen[contractName] = !detailsOpen[contractName]; details.toggle(); });
		if (detailsOpen[contractName])
			details.show();
		return $('<div class="contractDetails"/>').append(button).append(details);
	};
	var formatGasEstimates = function(data) {
		var gasToText = function(g) { return g === null ? 'unknown' : g; };
		var text = '';
		if ('creation' in data)
			text += 'Creation: ' + gasToText(data.creation[0]) + ' + ' + gasToText(data.creation[1]) + '\n';
		text += 'External:\n';
		for (var fun in data.external)
			text += '  ' + fun + ': ' + gasToText(data.external[fun]) + '\n';
		text += 'Internal:\n';
		for (var fun in data.internal)
			text += '  ' + fun + ': ' + gasToText(data.internal[fun]) + '\n';
		return text;
	};
	var formatAssemblyText = function(asm, prefix, source) {
		if (typeof(asm) == typeof('') || asm === null || asm === undefined)
			return prefix + asm + '\n';
		var text = prefix + '.code\n';
		$.each(asm['.code'], function(i, item) {
			var v = item.value === undefined ? '' : item.value;
			var src = '';
			if (item.begin !== undefined && item.end != undefined)
				src = source.slice(item.begin, item.end).replace('\n', '\\n', 'g');
			if (src.length > 30)
				src = src.slice(0, 30) + '...';
			if (item.name != 'tag')
				text += '  ';
			text += prefix + item.name + ' ' + v + '\t\t\t' + src +  '\n';
		});
		text += prefix + '.data\n';
		if (asm['.data'])
			$.each(asm['.data'], function(i, item) {
				text += '  ' + prefix + '' + i + ':\n';
				text += formatAssemblyText(item, prefix + '    ', source);
			});

		return text;
	};

	$('.asmOutput button').click(function() {$(this).parent().find('pre').toggle(); });

	var getConstructorInterface = function(abi) {
		var funABI = {'name':'','inputs':[],'type':'constructor','outputs':[]};
		for (var i = 0; i < abi.length; i++)
			if (abi[i].type == 'constructor') {
				funABI.inputs = abi[i].inputs || [];
				break;
			}
		return funABI;
	};

	syncStorage();

};

module.exports = {
	'run': run
};
