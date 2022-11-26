const mydiv = document.getElementById("model_list");

function fetchModel(name = "bananabutt_")
const options = {
    method: 'GET',
    headers: {
      cookie: '__cf_bm=N4EXRhoaFU75IQ3kzQhrXFeYTQxX7Hs.3MssMRBOKPk-1669493664-0-AfSInvFUm5eb4gBsq2MDXMc8qjUiY3nvHKF2jLOqhZmAA4O2pl8vcbKFSgCQXkzhqh%2FVMiubaC9oAbzCdXYWZUY%3D; affkey=%22eJyrVipSslJQUqoFAAwfAk0%3D%22'
    }
  };
  
  fetch('http://chaturbate.com/api/chatvideocontext/bananabutt_?=', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));