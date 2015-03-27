/*			 _________________________
			|      WiBla-Script™      |
			| Made obviously by WiBla |
			 ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
This script is Open-source.
You have the right to modify, copy and redistribute.
But: in any case you have to quote the original autors.
If you re-use it in any sort, I do not allow that:
you sell it nor you make money out of it.

This script is made for the room:
   -------------------------------
  |    ♫ French EDM Community ♫	  |
  | https://plug.dj/edm-community |
  |      Created by Hideki.       |
   ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
If you use it in an other room, some functions could not work.

For any information, contact me at: contact.wibla@gmail.com
I do not allow spam.
*/

var Alpha_css = "https://dl.dropboxusercontent.com/s/wtc3ie8liejjlre/Alpha-WiBla.css",
		no_css = "https://dl.dropboxusercontent.com/s/zimp74j9bl7aclj/Alpha-no.css";

if (!document.getElementById("Css-WiBla")) {
	var head  = document.getElementsByTagName("head")[0];
	var link  = document.createElement("link");
	link.id   = "WiBla-CSS";
	link.rel  = "stylesheet";
	link.type = "text/css";
	link.href = Alpha_css;
	head.appendChild(link);
	var Box = $("<div id='Box' onclick='slide()'></div>");
	$("#app-menu").after(Box);
	var Settings = $("<div id='Settings'><ul><li id='ws-woot'>Auto-woot</li><li id='ws-join'>Auto-join</li><li id='ws-video'>Hide video</li><li id='ws-delChat'>Clear Chat</li><li id='ws-css'>Custom Style</li><li id='ws-off'>Shutdown</li><li id='ws-bg'>Custom Bg</li><li id='ws-lengthA'>Duration alert</li><li id='ws-V'>Alpha 6.2</li><ul></div>");
	$("#app-menu").after(Settings);
	var isDev = (API.getUser().id==4506088) || (API.getUser().id == 4613422);
	if (API.hasPermission(null, API.ROLE.BOUNCER) || isDev) {
		var Controls = $("<div id='ws-rmvDJ'><img src='https://dl.dropboxusercontent.com/s/ou587hh6d0ov90w/romveDJ.png' alt='button remove from wait-list' /></div><div id='wsSkip' onclick='API.moderateForceSkip();'><img src='https://dl.dropboxusercontent.com/s/0fn3plmg2yhy6rf/skip.png' alt='button skip'/></div>");
		$("#playback-container").after(Controls);
	}
	
	var box,settings,css,wsWoot,wsJoin,wsVideo,wsDelChat,wsCss,wsKill,wsBG,wsLengthA,ws_rmvDJ,wsSkip,playbackContainer,playback;
	box = document.getElementById("Box");
	settings = document.getElementById("Settings");
	css = document.getElementById("WiBla-CSS");
	//menu buttons
	wsWoot = document.getElementById("ws-woot");
	wsWoot.addEventListener("click", function(){
		autoW = !autoW;
		autowoot();
		function autowoot() {
			if (autoW === true) {
				$("#woot").click();
				wsWoot.className = "ws-on";
			} else {
				wsWoot.className = "ws-off";
			}
		}
	}, false);
	wsJoin = document.getElementById("ws-join");
 	wsJoin.addEventListener("click", function(){
		autoDj = !autoDj;
		autojoin();
		function autojoin() {
			var dj = API.getDJ();
			if (autoDj) {
				wsJoin.className = "ws-on";
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
						
						default:
						break;
					}
				}
			} else {
				wsJoin.className = "ws-off";
			}
		}
	}, false);
	wsVideo = document.getElementById("ws-video");
 	wsVideo.addEventListener("click", function(){
		hideStream();
		function hideStream() {
			showVideo = !showVideo;
			//playback transition
			playbackContainer.style.setProperty("-webkit-transition", "allÂ  0.25s");
			playbackContainer.style.transition = "all 0.25s";
			//the two states
			if (showVideo === false) {
				playbackContainer.style.visibility = "hidden";
				playbackContainer.style.height = "0";
				ws_rmvDJ.style.top = wsSkip.style.top = "0";
				document.getElementById("playback-controls").style.visibility = "hidden";
				wsVideo.className = "ws-on";
			} else if (showVideo === true) {
				playbackContainer.style.visibility = "visible";
				playbackContainer.style.height = "281px";
				ws_rmvDJ.style.top = wsSkip.style.top = "283px";
				document.getElementById("playback-controls").style.visibility = "visible";
				wsVideo.className = "ws-off";
			}
		}
	}, false);
	wsDelChat = document.getElementById("ws-delChat");
	wsDelChat.addEventListener("click", function(){
		del();
		function del() {
			//bug fixing the fact that when the same user talk, the message won't display
			API.chatLog("I am a bug fix.");
			//then delete
			document.getElementById("chat-messages").innerHTML = "";
		}
	}, false);
	wsCss = document.getElementById("ws-css");
	wsCss.addEventListener("click", function(){
		Css();
		function Css() {
			isOn = !isOn;
			if (isOn) {
				link.href = no_css;
				wsCss.className = "ws-off";
			} else {
				link.href = Alpha_css;
				wsCss.className = "ws-on";
			}
		}
	}, false);
	wsKill = document.getElementById("ws-off");
	wsKill.addEventListener("click", function(){
		WiBla_Script_Shutdown();
		function WiBla_Script_Shutdown() {
			$(window).unbind();
			API.stopListening(API.CHAT_COMMAND, chatCommand);
			if (showVideo === false) {
				hideStream();
				setTimeout(WiBla_Script_Shutdown,500);
			}
			var parent = document.getElementById("app");
			parent.removeChild(box);
			parent.removeChild(settings);
			head.removeChild(css);
			if  (API.hasPermission(null, API.ROLE.BOUNCER) || (isDev)) {
				playback.removeChild(ws_rmvDJ);
				playback.removeChild(wsSkip);
			}
		}
	}, false);
	wsBG = document.getElementById("ws-bg");
	wsBG.addEventListener("click", function(){
		askBg();
		function askBg() {
			var bg = prompt("Image URL:");
			if (bg !== null) {
				fond.setAttribute("style", "left: -12.5px; top: 54px; width: 1600px; height: 900px; background: url(" + bg + ");");
			}
		}
	}, false);
	wsLengthA = document.getElementById("ws-lengthA");
	wsLengthA.addEventListener("click", function(){
		durationAlert = !durationAlert;
		alertDuration();
		function alertDuration() {
			if (durationAlert) {
				wsLengthA.className = "ws-on";
				if (API.getMediaLength().totalseconds > 435) {
					notif.play();
					API.chatLog("Music is too long ! 7:15 max !");
				}
			} else {
				wsLengthA.className = "ws-off";
			}
		}
	}, false);
	//video buttons
	ws_rmvDJ = document.getElementById("ws-rmvDJ");
	wsSkip = document.getElementById("wsSkip");
	//plug
	body = document.getElementsByTagName("body");
	playbackContainer = document.getElementById("playback-container");
	playback = document.getElementById("playback");
	fond = document.querySelector(".room-background");
	fond.setAttribute("style", "left: -12.5px; top: 54px; width: 1600px; height: 900px; background: url(https://dl.dropboxusercontent.com/s/phkx1zigwkc66vg/FEDMC.jpg)");
}

var json = {
	"V": "Alpha 7",
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
notif = new Audio("https://dl.dropboxusercontent.com/s/2oof758mv1hjc2r/notif.wav");
//getting user info to make alpha and beta tester privilege
var pseudo = API.getUser().rawun;
var ID = API.getUser().id;

API.on(API.CHAT_COMMAND, chatCommand);
API.on(API.ADVANCE, alertDuration);
API.on(API.ADVANCE, autowoot);
API.on(API.ADVANCE, autojoin);

$(window).bind("keydown", function (k) {
	if (k.keyCode == 107 && !$(document.getElementById("chat-input")).attr("class")) {
		var volume = API.getVolume();
		volume += 3;
		API.setVolume(volume);
	}
});
$(window).bind("keydown", function (k) {
	if (k.keyCode == 109 && !$(document.getElementById("chat-input")).attr("class")) {
		var volume = API.getVolume();
		volume -= 3;
		API.setVolume(volume);
	}
});
function chatCommand (commande) {
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
		break;
	}
}
function slide() {
	show = !show;
	//menu transition
	settings.style.WebkitTransition = "all 0.3s";
	settings.style.transition = "all 0.3s";
	//the two states
	if (show === false) {
		settings.style.visibility = "hidden";
		settings.style.zIndex = "0";
		settings.style.right = "200px";
	} else if (show === true) {
		settings.style.visibility = "visible";
		settings.style.zIndex = "2";
		settings.style.right = "345px";
	}
}
function removeDJ() {
	API.chatLog("This button will kick of the DJ from the wait-list, but doesn't work atm");
}

API.chatLog("WiBla Script " + json.V + " !");
API.chatLog("Type /list for commands list.");
API.chatLog("If you see some bugs, try the official version http://wibla.free.fr !");