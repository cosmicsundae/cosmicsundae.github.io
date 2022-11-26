

const options = {
  method: 'GET',
  headers: {
    cookie: '__cf_bm=N4EXRhoaFU75IQ3kzQhrXFeYTQxX7Hs.3MssMRBOKPk-1669493664-0-AfSInvFUm5eb4gBsq2MDXMc8qjUiY3nvHKF2jLOqhZmAA4O2pl8vcbKFSgCQXkzhqh%2FVMiubaC9oAbzCdXYWZUY%3D; affkey=%22eJyrVipSslJQUqoFAAwfAk0%3D%22'
  }
};

// get name from input
function getName() {
  return document.getElementById("name").value;
}


async function fetchModel() {
  let name = getName();
  const url = `https://chaturbate.com/api/chatvideocontext/${name}?=`;
  console.log('in fetchModel', url);
  return await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.broadcaster_name, data.room_status)
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}



// get room_status from json
function getRoomStatus(json) {
  let room_status = json.room_status;
  console.log('in getRoomStatus', room_status);
  return room_status;
}

//  get broadcaster name
function getBroadcasterName(json) {
  let broadcaster_name = json.broadcaster_name;
  console.log('in getBroadcasterName', broadcaster_name);
  return broadcaster_name;
}


// put room_status into html
function updateRoomStatus(room_status) {
  document.getElementById("room_status").innerText = room_status;
}

// put broadcaster name into html
function updateBroadcasterName(broadcaster_name) {
  document.getElementById("broadcaster_name").innerText = broadcaster_name;
}

//  check if onlnie
function isOnline() {
  let json = fetchModel();
  let room_status = getRoomStatus(json);
  let broadcaster_name = getBroadcasterName(json);
  updateRoomStatus(room_status);
  updateBroadcasterName(broadcaster_name);
  if (room_status == "public") {
    // display room_image preview from url roomimg.stream.highwebmedia.com/ri/{name}.jpg
    document.getElementById("room_image").src = `https://roomimg.stream.highwebmedia.com/ri/${broadcaster_name}.jpg`;
    return true;
  } else {
    document.getElementById("room_image").src = "";
  }
  
}
