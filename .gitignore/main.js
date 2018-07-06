const socket = io('https://peer-eas-server.herokuapp.com/');

//----------------------SOCKET-----------------------
socket.on('DANH_SACH_ONLINE', arrUser => {
	showDivChat();
	loadUser(arrUser);	
	socket.on('CO_NGUOI_DUNG_MOI', arrUser => {
		loadUser(arrUser);		
	});
});


socket.on('DANG_KY_THAT_BAI', ()=>{
	alert('Ten ban qua dep, rat tiec co nguoi dung roi, dang ky ten khac!!!');
	$('#txtUsername').val("");
	
});

socket.on('AI_DO_NGAT_KET_NOI', arrUser=>{
	loadUser(arrUser);
});

function showDivChat(){
	$("#divDangky").hide();
	$("#divChat").show();
}
function loadUser(arrUser){
	$('#listUser').html('');
	console.log(arrUser);
	arrUser.forEach(user => {
		console.log(user);
		const {ten, peerId} = user;
		$('#listUser').append(`<li id="${peerId}">${ten}</li>`);
	});
}

$('#listUser').on('click', 'li', function(){
	//console.log($(this).attr('id'));
	const id = $(this).attr('id');
	console.log("call to :" +id);
	openStream()
	.then(stream => {
		playStream("localStream", stream);
		var call = peer.call(id, stream);
		call.on("stream", remoteStream=> playStream("remoteStream",stream));
	});
});



//---------------PEERJS------------------------------
function openStream(){
	const config = { audio: true, video: true};
	return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}

//openStream()
//	.then(stream => playStream('localStream', stream));
	
//test-peerjs-eas.herokuapp.com

//ket noi server peerjs
const peer = new Peer({
    key: 'peerjs',
    host: 'test-peerjs-eas.herokuapp.com',
    secure: true,
    port: 443,
    config: {'iceServers': [
            { url: 'stun:stun1.l.google.com:19302' },
            { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
        ]}
 }                    
);

peer.on('open', id => {
	console.log("open width id: "+id);
    $('#my-peer').append(id);
	
	$('#btnSignUp').click(()=>{
		const username = $('#txtUsername').val();
		console.log(username);
		socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerId: id});
	});
    //$('#btnSignUp').click(() => {
    //    const username = $('#txtUsername').val();
    //    socket.emit('NGUOI_DUNG_DANG_KY', {
    //        ten: username,
    //        peerId: id
    //    });
    //});
});

//caller
$("#btnCall").click(()=>{
	const id = $("#call_peer").val();
	console.log("call to :" +id);
	openStream()
	.then(stream => {
		playStream("localStream", stream);
		var call = peer.call(id, stream);
		call.on("stream", remoteStream=> playStream("remoteStream",stream));
	});
});

//get call
peer.on("call", call => {
	console.log("Da nhan duoc call");
	console.log(call);
	call.answer(stream); //Tra loi da nhan call
		//playStream("localStream", stream);
	call.on("stream", remoteStream => playStream("remoteStream",remoteStream));
	//openStream()
	//.then(stream => {
	//	call.answer(stream); //Tra loi da nhan call
	//	//playStream("localStream", stream);
	//	call.on("stream", remoteStream => playStream("remoteStream",remoteStream));
		
	//});
});



