// For any informations, go to:
// https://github.com/WiBla/Script

var max_css = "https://rawgit.com/WiBla/Script/alpha/ressources/max.css",
		min_css = "https://rawgit.com/WiBla/Script/alpha/ressources/min.css";

if (!document.getElementById("Css-WiBla")) {
	//creating the necessary element
	var Css = $("<link id='WiBla-CSS' rel='stylesheet' type='text/css' href='"+max_css+"'>");
	$("head").after(Css);
	var Box = $("<div id='Box' onclick='slide()'><div id='icon'></div></div>");
	$("#app-menu").after(Box);
	var Settings = $("<div id='Settings'><ul><li id='ws-woot'>Auto-woot</li><li id='ws-join'>Auto-join</li><li id='ws-video'>Hide video</li><li id='ws-delChat'>Clear Chat</li><li id='ws-css'>Custom Style</li><li id='ws-off'>Shutdown</li><li id='ws-bg'>Custom Bg</li><li id='ws-lengthA'>Duration alert</li><li id='ws-V'>Alpha 6.7</li><ul></div>");
	$("#app-menu").after(Settings);
	//buttons below the video must appear ONLY if the user is at least bouncer or Dev
	var WiBla = API.getUser().id == 4613422,
		zurbo = API.getUser().id==4506088,
		dano = API.getUser().id == 209178,
		isDev = WiBla || zurbo || dano,
		hasPermBouncer = API.hasPermission(null, API.ROLE.BOUNCER) || isDev;
	//the result
	if (hasPermBouncer) {
		var Controls = $("<div id='ws-rmvDJ'><img src='https://dl.dropboxusercontent.com/s/ou587hh6d0ov90w/romveDJ.png' alt='button remove from wait-list' /></div><div id='wsSkip' onclick='API.moderateForceSkip();'><img src='https://dl.dropboxusercontent.com/s/0fn3plmg2yhy6rf/skip.png' alt='button skip'/></div>");
		$("#playback-container").after(Controls);
	}
	
	//menu buttons
	var wsWoot = $("#ws-woot");
	wsWoot.click(function(){
		autoW = !autoW;
		autowoot();
	});
	var wsJoin = $("#ws-join");
	wsJoin.click(function(){
		autoDj = !autoDj;
		autojoin();
	});
	var wsVideo = $("#ws-video");
	wsVideo.click(function(){
		showVideo = !showVideo;
		//the two states
		if (showVideo === false) {
			playbackContainer[0].style.visibility = "hidden";
			playbackContainer[0].style.height = "0";
			ws_rmvDJ[0].style.top = wsSkip[0].style.top = "0";
			$("#playback-controls")[0].style.visibility = "hidden";
			wsVideo[0].className = "ws-on";
		} else if (showVideo === true) {
			playbackContainer[0].style.visibility = "visible";
			playbackContainer[0].style.height = "281px";
			ws_rmvDJ[0].style.top = wsSkip[0].style.top = "283px";
			$("#playback-controls")[0].style.visibility = "visible";
			wsVideo[0].className = "ws-off";
		}
	});
	$("#ws-delChat").click(function(){
		API.chatLog("I am a bug fix."); /*Then*/ $("#chat-messages")[0].innerHTML = "";
	});
	var wsCss = $("#ws-css");
	wsCss.click(function(){
		isOn = !isOn;
		if (isOn) {
			link.href = min_css;
			wsCss[0].className = "ws-off";
		} else {
			link.href = max_css;
			wsCss[0].className = "ws-on";
		}
	});
	$("#ws-off").click(function(){
		WiBla_Script_Shutdown();
	});
	$("#ws-bg").click(function(){
		askBG();
	});
	var wsLengthA = $("#ws-lengthA");
	wsLengthA.click(function(){
		durationAlert = !durationAlert;
		alertDuration();
	});

	//Script content
	var box = $("#Box"),
	settings = $("#Settings"),
	css = $("#WiBla-CSS"),
	//video buttons
	ws_rmvDJ = $("#ws-rmvDJ"),
	wsSkip = $("#wsSkip"),
	//plug
	body = $("body"),
	playbackContainer = $("#playback-container"),
	playback = $("#playback"),
	fond = $(".room-background"),
	json = {
	"V": "Alpha github 1",
	"show": false,
	"autoW": false,
	"autoDJ": false,
	"showVideo": true,
	"isOn": false,
	"durationAlert": false,
	"afk": false,
	};
	var show, autoW, autoDj, showVideo, isOn, durationAlert, notif, afk;
	show = autoW = autoDj = isOn = durationAlert = afk = false;
	showVideo = true;
	notif = new Audio("https://raw.githubusercontent.com/WiBla/Script/alpha/ressources/notif.wav");
	//getting user info to make alpha and beta tester privilege
	var pseudo = API.getUser().rawun;
	var ID = API.getUser().id;

	API.on(API.CHAT_COMMAND, chatCommand);
	API.on(API.ADVANCE, alertDuration);
	API.on(API.ADVANCE, autowoot);
	API.on(API.ADVANCE, autojoin);

	$(window).bind("keydown", function(k) {
		if (k.keyCode == 107 && !$($("#chat-input")).attr("class")) {
			var volume = API.getVolume();
			volume += 3;
			API.setVolume(volume);
		}
	});
	$(window).bind("keydown", function(k) {
		if (k.keyCode == 109 && !$($("#chat-input")).attr("class")) {
			var volume = API.getVolume();
			volume -= 3;
			API.setVolume(volume);
		}
	});

	API.chatLog("WiBla Script " + json.V + " !");
	API.chatLog("Type /list for commands list.");
	if (!isDev) {
		API.chatLog("If you see some bugs, try the official version http://wibla.free.fr !");
	}
}

//Functions
function autowoot() {
	if (autoW === true) {
		$("#woot").click();
		wsWoot.className = "ws-on";
	} else {
		wsWoot.className = "ws-off";
	}
}
function autojoin() {
	var dj = API.getDJ();
	if (autoDj) {
		wsJoin[0].className = "ws-on";
		if (dj === null || dj.id !== API.getUser().id || API.getWaitListPosition() > -1) {
			switch (API.djJoin()) {
				case 1:
					API.chatLog("Cannot auto-join: Wait list is locked");
					break;
				
				case 2:
					API.chatLog("Cannot auto-join: Invalid active playlist");
					break;
				
				case 3:
					API.chatLog("Cannot auto-join: Wait List is full");
					break;
				
			}
		}
	} else {
		wsJoin[0].className = "ws-off";
	}
}
function chatCommand(commande) {
	var args = commande.split(" ");
	switch (args[0]) {
		case "/like":
			API.sendChat(":heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes:");
			break;
		case "/love":
			if (args[1] === undefined) {
				API.sendChat(":heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse:");
			} else {
				API.sendChat(args[1] + " :heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse:");
			}
			break;
		case "/eta":
			if (API.getWaitListPosition() == -1) {
				API.chatLog("Vous n'êtes pas dans la liste d'attente.");
			} else {
				var eta = API.getWaitListPosition() + 1; //index 0
				eta = eta * 4; //we assume that everyone plays 4mins music
				eta = eta * 60; //transform in second
				eta = eta + API.getTimeRemaining(); //to add the time remaining
				eta = eta / 60; //then split in minutes
				eta = Math.round(eta, 1); //gives a rounded result
				if (eta >= 60) {
					var etaH = eta / 60;
					etaH = Math.round(etaH, 1); //gives hours
					var etaM = eta % 60; //gives minutes
					API.chatLog("Il reste " + etaH + "H" + etaM + "min(s) avant votre passage.");
				} else {
					API.chatLog("Il reste " + eta + " minute(s) avant votre passage.");
				}
			}
			break;
		case "/vol":
			if (args[1] >= 0 && args[1] <= 100) {
				API.setVolume(args[1]);
			} else {
				API.chatLog("Spécifier un chiffre entre 0 et 100");
			}
			break;
		case "/afk":
			afk = !afk;
			if (afk) {
				API.sendChat("/me est AFK.");
			} else {
				API.sendChat("/me n'est plus AFK.");
			}
			break;
		case "/list":
			API.chatLog("/like <3 x 5");
			API.chatLog("/love [@user] <3 x 10 + user(optionel)");
			API.chatLog("/eta renvois le temps restant avant que vous soyez DJ");
			API.chatLog("/vol [0-100] change le volume");
			API.chatLog("/afk envoie un message d'afk (à faire deux fois)");
			API.chatLog("/list affiche cette liste");
			break;
		default:
			API.chatLog("Essayez /list");
	}
}
function alertDuration() {
	if (durationAlert) {
		wsLengthA[0].className = "ws-on";
		if (API.getMediaLength().totalseconds > 435) {
			notif.play();
			API.chatLog("Music is too long ! 7:15 max !");
		}
	} else {
		wsLengthA[0].className = "ws-off";
	}
}
function slide() {
	show = !show;
	//the two states
	if (show === false) {
		settings[0].style.visibility = "hidden";
		settings[0].style.zIndex = "0";
		settings[0].style.right = "200px";
	} else if (show === true) {
		settings[0].style.visibility = "visible";
		settings[0].style.zIndex = "2";
		settings[0].style.right = "345px";
	}
}
function askBG() {
	var bg = prompt("Image URL:"),
		firstRun = true;
	if (bg !== null) {
		var style = fond[0].getAttribute("style").split(" ");
		style[9] = "url(" + bg +")";
		style = style.join(" ");
		fond[0].setAttribute("style", style);
	} else {
		bg = "https://rawgit.com/WiBla/Script/alpha/images/background/default/FEDMC.jpg";
		var style = fond[0].getAttribute("style").split(" ");
		style[9] = "url(" + bg +")";
		style = style.join(" ");
		fond[0].setAttribute("style", style);
	}
}
function removeDJ() {
	API.chatLog("This button will kick of the DJ from the wait-list, but doesn't work atm");
}
function WiBla_Script_Shutdown() {
	$(window).unbind();
	API.stopListening(API.CHAT_COMMAND, chatCommand);
	if (showVideo === false) {
		hideStream();
		setTimeout(WiBla_Script_Shutdown,500);
	}
	var parent = $("#app");
	parent.removeChild(box);
	parent.removeChild(settings);
	head.removeChild(css);
	if  (API.hasPermission(null, API.ROLE.BOUNCER) || (isDev)) {
		playback.removeChild(ws_rmvDJ);
		playback.removeChild(wsSkip);
	}
}