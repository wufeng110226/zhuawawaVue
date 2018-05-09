
function activate(e, n) {
	var o = 0;
	return $.ajax({
		url: ACCESS_URL + "/doll_oem/user/activate",
		type: "post",
		dataType: "json",
		async: !1,
		data: JSON.stringify({
			app_name: APP_NAME,
			app_version: APP_VER,
			channel_code: e,
			activate_type: "new",
			identifier: e + "_" + n
		}),
		success: function(e) {
			2e3 == e.result_code && 0 == e.result.error_code || (console.log(JSON.stringify(e)), o = -3), null != e.result.user_id && (user_id = e.result.user_id), null != e.result.token && (token = e.result.token), o = 0
		},
		fail: function(e) {
			console.log(JSON.stringify(e)), o = -2
		}
	}), o
}

function initialize(e, n, o) {
	return "" == e || "" == n || "" == o ? (console.log("please check your parameter"), null) : ($.ajax({
		url: ACCESS_URL + "/doll/management/get_channel_code",
		type: "POST",
		dataType: "json",
		async: !1,
		data: JSON.stringify({
			app_id: e,
			app_secret: n
		}),
		success: function(e) {
			if(console.log(JSON.stringify(e)), null == e || null == e.channel_code) return null;
			null != e.channel_code && (channel_code = e.channel_code);
			return 0 != activate(channel_code, o) ? (console.log("activate failed"), null) : void 0
		},
		fail: function(e) {
			return console.log(JSON.stringify(e)), null
		}
	}), token)
}

function getRoomList(e) {
	if(null == e || "" == e) return console.log("Invalid parameter"), null;
	var n = $.now(),
		o = null;
	return $.ajax({
		url: ACCESS_URL + "/doll_oem/doll/rooms?_token=" + e + "&_ts=" + n + "&_v=1",
		type: "get",
		async: !1,
		success: function(e) {
			2e3 != e.result_code && (console.log(JSON.stringify(e)), o = null), roomList = e.result, o = roomList
		},
		fail: function(e) {
			console.log(JSON.stringify(e)), o = null
		}
	}), o
}

function joinRoom(e, n, o, l, t) {
	if(null == e || null == o || null == l || null == n || null == t || "" == e || "" == o || "" == l || "" == n) return console.log("please check your parameter"), -1;
	if(room_id = parseInt(e), token = n, null == (roomList = getRoomList(token)) || 0 == roomList.length) return console.log("please get room list first"), -1;
	for(i = 0; i < roomList.length; i++)
		if(roomList[i].room_id == room_id) {
			target_room = roomList[i];
			break
		}
	if(i == roomList.length) return console.log("the room id is wrong"), -2;
	try {
		eventHandler = t;
		var r = target_room.h5video_uri,
			a = parseInt(target_room.ssrc),
			s = parseInt(target_room.front_camera),
			c = parseInt(target_room.side_camera);
		console.log(target_room);
		(wsavc = new WSAvcPlayer(o, "webgl")).connect(r), (wsavc2 = new WSAvcPlayer(l, "webgl")).connect(r), window.wsavc2 = wsavc2, window.wsavc = wsavc, setTimeout(function() {
			wsavc.playStream(a, s), wsavc2.playStream(a, c)
		}, 1e3), (ws_connect = new WebSocket(target_room.ws_server_url + "/ws/websocket?no=" + target_room.room_id)).onmessage = function(e) {
			"fail" == JSON.parse(e.data).type ? eventHandler.prototype.onPlayFinish(PLAY_RESULT_FAILED,CURRENT_PLAYID) : "success" == JSON.parse(e.data).type ? eventHandler.prototype.onPlayFinish(PLAY_RESULT_CATCHED,CURRENT_PLAYID) : JSON.parse(e.data).type
		}
	} catch(e) {
		console.log("ReferenceError:WSAvcPlayer is not defined");
		return console.log(e), -3
	}
}

function quitRoom() {
	null == ws_connect ? console.log("ws_connect is null") : ws_connect.close(), null == wsavc ? console.log("wsavc is null") : wsavc.disconnect(), null == wsavc2 ? console.log("wsavc2 is null") : wsavc2.disconnect()
}

function control(n) {
	if(n != CONTROL_FORWARD && n != CONTROL_BACKWARD && n != CONTROL_LEFT && n != CONTROL_RIGHT && n != CONTROL_CATCH) return console.log("Invalid parameter"), -1;
	var o = null;
	n == CONTROL_FORWARD ? o = 3 : n == CONTROL_BACKWARD ? o = 4 : n == CONTROL_LEFT ? o = 1 : n == CONTROL_RIGHT ? o = 2 : n == CONTROL_CATCH && (o = 0);
	var l = {
		type: "play",
		play_id: play_id,
		action: o
	};
	try {
		ws_connect.send(JSON.stringify(l))
	} catch(n) {
		return console.log(e), -2
	}
}

function startPlay(e) {
	if(typeof(e) == 'number') e = e.toString();
	if(null == token || "" == token) return console.log("invalid token"), -1;
	if(null == target_room.room_id || "" == target_room.room_id) return console.log("invalid room id, please check"), -1;
	if(null == eventHandler) return console.log("EventHandler is null"), -1;
	null == e && (e = "");
	clearInterval(null);
	var n = 0;
	$.ajax({
		url: ACCESS_URL + "/doll_oem/doll/begin?_token=" + token + "&_v=1",
		type: "post",
		dataType: "json",
		data: JSON.stringify({
			room_id: parseInt(target_room.room_id),
			prv_data: e
		}),
		success: function(e) {
			console.log(e);
			CURRENT_PLAYID = e.result.play_id;
			2e3 == e.result_code ? (n = e.result.count_down - 5, eventHandler.prototype.onPlaySucceed(n,CURRENT_PLAYID), play_id = e.result.play_id, console.log("play_id = ", JSON.stringify(e.result))) : eventHandler.prototype.onPlayFailed()
		},
		fail: function(e) {
			eventHandler.prototype.onPlayFailed()
		}
	})
}

function changeView(e, n, o) {
	return e != VIEW_FRONT && e != VIEW_SIDE ? (console.log("Invalid parameter."), -1) : currentView != e ? (0 == e ? (n.style.display = "inline", o.style.display = "none") : (n.style.display = "none", o.style.display = "inline"), currentView = e, 0) : void 0
}
var channel_code = "",
	user_id = "",
	room_id = "",
	token = "",
	roomList = null,
	player = null,
	wsavc = null,
	wsavc2 = null,
	target_room = null,
	play_id = null,
	eventCallback = null,
	ws_connect = null,
	currentView = 0,
	eventHandler = null,
	APP_NAME = "cootek.cranesdk.h5.public",
	APP_VER = "1",
	ACCESS_URL = "http://wawaji.cootekservice.com",
	VIEW_FRONT = 0,
	VIEW_SIDE = 1,
	CONTROL_FORWARD = 1,
	CONTROL_BACKWARD = 2,
	CONTROL_LEFT = 4,
	CONTROL_RIGHT = 8,
	CONTROL_CATCH = 16,
	ROOM_STATUS_READY = 0,
	ROOM_STATUS_PLAYING = 1,
	ROOM_MAINTENANCE = 2,
	CURRENT_PLAYID = null,
	PLAY_RESULT_CATCHED = !0,
	PLAY_RESULT_FAILED = !1;