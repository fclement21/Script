// For any informations, go to: https://github.com/WiBla/Script

if($("#WiBla-CSS").length === 0) {
	/* ####### [Global variables] ####### */
	var WiBla = API.getUser().id == 4613422,
	zurbo = API.getUser().id == 4506088,
	dano = API.getUser().id == 209178,
	isDev = WiBla || zurbo || dano,
	hasPermBouncer = API.hasPermission(null, API.ROLE.BOUNCER) || isDev,
	json = {
	"V": "Alpha 6.7",
	"showMenu": false,
	"autoW": false,
	"autoDJ": false,
	"showVideo": true,
	"CSS": false,
	"oldChat": true,
	"durationAlert": false,
	"afk": false
	};
	
	// Alpha & Beta tester privilege
	var pseudo = API.getUser().username;
	var ID = API.getUser().id;

	//Running the specified version
	init("alpha");
}

/* #################### [Functions] #################### */
function init(version) {
	// Creating core elements
	var oldChat, max_css, min_css, notif;
	if (version == "alpha") {
		oldChat ="https://rawgit.com/WiBla/Script/alpha/ressources/old-chat.css";
		max_css = "https://rawgit.com/WiBla/Script/alpha/ressources/max.css";
		min_css = "https://rawgit.com/WiBla/Script/alpha/ressources/min.css";
		notif = new Audio("https://raw.githubusercontent.com/WiBla/Script/alpha/ressources/notif.wav");
	} else {
		oldChat ="https://rawgit.com/WiBla/Script/master/ressources/old-chat.css";
		max_css = "https://rawgit.com/WiBla/Script/master/ressources/max.css";
		min_css = "https://rawgit.com/WiBla/Script/master/ressources/min.css";
		notif = new Audio("https://raw.githubusercontent.com/WiBla/Script/master/ressources/notif.wav");
	}
	var menu = "", moderateGUI = "";
		menu += '<div id="Settings">';
		menu += '	<ul>';
		menu += '		<li id="ws-woot">Auto-woot</li>';
		menu += '		<li id="ws-join">Auto-join</li>';
		menu += '		<li id="ws-video">Hide video</li>';
		menu += '		<li id="ws-delChat">Clear Chat</li>';
		menu += '		<li id="ws-css">Custom Style</li>';
		menu += '		<li id="ws-old-chat">Old chat</li>';
		menu += '		<li id="ws-bg">Custom Bg</li>';
		menu += '		<li id="ws-lengthA">Song limit</li>';
		menu += '		<li id="ws-off">Shutdown</li>';
		menu += '		<li id="ws-V">'+ json.V +'</li>';
		menu += '	</ul>';
		menu += '</div>';
		moderateGUI += '<div id="ws-rmvDJ">';
		moderateGUI += '	<img src="https://dl.dropboxusercontent.com/s/ou587hh6d0ov90w/romveDJ.png" alt="button remove from wait-list" />';
		moderateGUI += '</div>';
		moderateGUI += '<div id="ws-skip" onclick="API.moderateForceSkip();">';
		moderateGUI += '	<img src="https://dl.dropboxusercontent.com/s/0fn3plmg2yhy6rf/skip.png" alt="button skip" />';
		moderateGUI += '</div>';

	// Displaying them
	var a = $("<link id='WiBla-CSS' rel='stylesheet' type='text/css' href='"+min_css+"'>");
	$("head").append(a);// General css
	var b = $("<link id='WiBla-Old-Chat-CSS' rel='stylesheet' type='text/css' href='"+oldChat+"'>");
	$("head").append(b);// Old chat css
	var c = $("<div id='Box' onclick='slide()'><div id='icon'></div></div>");
	$("#app").append(c);// Menu icon
	var d = $(menu);
	$("#app").append(d);// Menu itself
	// If at least bouncer (or developer)
	if (hasPermBouncer) {
		var e = $(moderateGUI);
		$("#playback-container").after(e);// Moderation tools
	}
	// Element that only are available after the script has loaded
	window.item = {
		//script
		"box": $("#box")[0],
		"settings": $("#Settings")[0],
		"skip": $("#ws-Skip")[0],
		"rmvDJ": $("#ws-rmvDJ")[0],
		//script menu
		"woot": $("#ws-woot")[0],
		"join": $("ws-join")[0],
		"video": $("ws-video")[0],
		"delchat": $("ws-delChat")[0],
		"css": $("ws-css")[0],
		"oldChat": $("ws-old-chat")[0],
		"bg": $("ws-bg")[0],
		"lengthA": $("ws-lengthA")[0],
		"off": $("ws-off")[0],
		//plug in general
		"stream": $("#playback-container")[0],
		"head": $("head")[0],
	};

	firstRun();
}
function firstRun() {
	autowoot();
	autojoin();
	askBG(true);
	alertDuration(true);
	
	// API initalization
	API.on(API.CHAT_COMMAND, chatCommand);
	API.on(API.ADVANCE, alertDuration);
	API.on(API.ADVANCE, autowoot);
	API.on(API.ADVANCE, autojoin);

	// Keyboard shorcuts
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

	// Event listener for buttons
	item.woot.click(function(){
		json.autoW = !json.autoW;
		autowoot();
	});
	item.join.click(function(){
		json.autoDJ = !json.autoDJ;
		autojoin();
	});
	item.video.click(function(){
		json.showVideo = !json.showVideo;
		hideStream();
	});
	item.delchat.click(function(){
		/*If the same user speak before and after the clear, message won't display*/
		API.chatLog("I am a bug fix."); // <-- This fix it
		$("#chat-messages")[0].innerHTML = "";
	});
	item.lengthA.click(function(){
		// init and alert must be two separate functions
		if (default) {
			var time[0] = 435;
		} else {
			// improvments may be done looking for minutes only
			var time = prompt("Song limit in minutes\nexemple: 64,30 is 1h4min30s\n(minimum is 1min)");
			time = time.split(",");
			time[0] = time[0]*60;
			time[0] = parseInt(time[0]) + parseInt(time[1]);
		}
	});

	// Fully loaded "alert"
	API.chatLog("WiBla Script " + json.V + " loaded !");
	API.chatLog("Type /list for commands list.");
	API.chatLog("If you see some bugs, try the official version http://wibla.free.fr !");
}
function autowoot() {
	if (json.autoW === true) {
		$("#woot")[0].click();
		item.woot.className = "ws-on";
	} else {
		item.woot.className = "ws-off";
	}
}
function autojoin() {
	var dj = API.getDJ();
	if (json.autoDj) {
		item.join.className = "ws-on";
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
		item.join.className = "ws-off";
	}
}
function hideStream() {
	if (json.showVideo) {
		item.stream.style.visibility = "visible";
		item.stream.style.height = "281px";
		ws_rmvDJ[0].style.top = wsSkip[0].style.top = "283px";
		$("#playback-controls")[0].style.visibility = "visible";
		item.video.className = "ws-off";
	} else {
		item.stream.style.visibility = "hidden";
		item.stream.style.height = "0";
		ws_rmvDJ[0].style.top = wsSkip[0].style.top = "0";
		$("#playback-controls")[0].style.visibility = "hidden";
		item.video.className = "ws-on";
	}
}
function askBG(base) {
	var bg;
	if (base) {
		bg = "https://rawgit.com/WiBla/Script/alpha/images/background/default/FEDMC.jpg";
	} else {
		bg = prompt("Image URL:");
	}
	if (bg !== null && bg.length > 0) {
		var style = $(".room-background")[0].getAttribute("style").split(" ");
		style[9] = "url(" + bg +")";
		style = style.join(" ");
		$(".room-background")[0].setAttribute("style", style);
		item.bg.className = "ws-on";
	} else {

	}
}
function alertDuration(base) {
	if (durationAlert) {
		item.lengthA.className = "ws-on";
		if (API.getMedia().duration > time[0]) {
			notif.play();
			API.chatLog("Music is too long ! 7:15 max !");
		}
	} else {
		item.lengthA.className = "ws-off";
	}
}

// TO VERIFY
function WiBla_Script_Shutdown() {
	API.stopListening(API.CHAT_COMMAND, chatCommand);
	API.stopListening(API.ADVANCE, alertDuration);
	API.stopListening(API.ADVANCE, autowoot);
	API.stopListening(API.ADVANCE, autojoin);
	$(window).unbind();
	// Preventing making the video definitly desapear
	if (showVideo === false) {
		hideStream();
		setTimeout(WiBla_Script_Shutdown,250);
	}
	var parent = $("#app")[0];
	parent.removeChild(box);
	parent.removeChild(settings);
	item.head.removeChild(css);
	if (hasPermBouncer) {
		item.stream.removeChild(ws_rmvDJ);
		item.stream.removeChild(wsSkip);
	}
}
function slide() {
	var show = json.showMenu = !json.showMenu,
		menu = $("#Settings")[0];
	if (show === false) {
		menu.style.visibility = "hidden";
		menu.style.zIndex = "0";
		menu.style.right = "200px";
	} else if (show === true) {
		menu.style.visibility = "visible";
		menu.style.zIndex = "2";
		menu.style.right = "345px";
	}
}
function removeDJ() {
	API.chatLog("This button will kick of the DJ from the wait-list, but doesn't work atm");
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
			if (API.getUser().id == API.getDJ().id) {
				API.chatLog("You are the DJ !");
			} else if (API.getWaitListPosition() == -1) {
				API.chatLog("You are not in the Wait-List.");
			}	else {
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
			API.chatLog("/whoami affiche vos infos");
			API.chatLog("/list affiche cette liste");
			break;
		case "/whoami":
			API.chatLog("Username: " + API.getUser().username);
			API.chatLog("ID: " + API.getUser().id);
			API.chatLog("Description: " + API.getUser().blurb);
			API.chatLog("Avatar: " + API.getUser().avatarID);
			API.chatLog("Badge: " + API.getUser().badge);
			API.chatLog("XP: " + API.getUser().xp);
			API.chatLog("Lvl: " + API.getUser().level);
			API.chatLog("PP: " + API.getUser().pp);
			API.chatLog("Purchase: " + API.getUser().payments);
			API.chatLog("Can gift: " + API.getUser().canGift);
			break;
		default:
			API.chatLog("Essayez /list");
	}
}