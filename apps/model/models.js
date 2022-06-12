const mydiv = document.getElementById("model_list");

function getOptions() {
    // get tags listed comma separated from input
    let tags = document.getElementById("tags").value;
    console.log(tags);
    let tags_array = tags.split(",");
    if (tags_array.length == 1 && tags_array[0].trim() == "") {
        return { 'gender': "f" };
    }

    let options = {};
    i = 0;
    tags_array.forEach((element) => {
        options["tag" + i] = element.trim();
        i += 1;
    });

    options = Object.assign({}, { 'gender': "f" }, options);
    console.log(options);
    return options;
}

// add query items to the url from dictionary
function addQueryItems(url, items) {
    var q = url.indexOf("?") > -1 ? "&" : "?";
    for (var key in items) {
        if (key.includes("tag")) {
            q += "tag" + "=" + items[key] + "&";
        } else {
            q += key + "=" + items[key] + "&";
        }
    }

    return url + q;
}

function getURL(limit, offset) {
    baseURL =
        "https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=olXgj&client_ip=request_ip";
    return addQueryItems(baseURL, { limit: limit, offset: offset });
}

function addImage(here, image) {
    const newimg = document.createElement("img");
    newimg.src = image;
    newimg.style.width = "25%";
    here.appendChild(newimg);
}

// add image with link to the page
function addImageLink(here, image, link, name) {
    const newimg = document.createElement("img");
    newimg.src = image;
    newimg.alt = name;
    newimg.title = name;
    newimg.style.width = "120px";
    const newa = document.createElement("a");
    newa.href = link;
    newa.target = "_blank";
    newa.id = name;

    newa.appendChild(newimg);
    here.appendChild(newa);
}

function addLink(here, i, link) {
    const newlink = document.createElement("a");
    newlink.href = link;
    newlink.innerText = link;
    // add line number
    const newp = document.createElement("p");
    newp.innerText = "index " + i + "   ";
    here.appendChild(newp);
    newp.appendChild(newlink);
    // here.appendChild(document.createElement('br'));
}

// function to fetch paginated json file from url
async function fetchPaginated(url, limit, offset) {
    let items = { limit: limit, offset: offset };
    return await fetch(addQueryItems(url, items))
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
        });
}

// determine the number of pages
async function getPages(url, limit) {
    let items = { limit: limit, offset: 0 };
    return await fetch(addQueryItems(url, items))
        .then((response) => response.json())
        .then((data) => {
            let count = data.count;
            let npages = Math.ceil(count / limit);
            console.log("# of pages: " + npages);
            return npages;
        })
        .catch((error) => {
            console.log(error);
        });
}

// loop through all pages and concatenate the json files
async function getAllPages(url, limit) {
    let numpages = await getPages(url, limit);
    let results = [];
    for (let i = 0; i < numpages; i++) {
        let data = await fetchPaginated(url, limit, i * limit);
        results = results.concat(data.results);
    }
    return results;
}

// make a gallery for all models in json file
async function generateGalleryFromJSON(url, limit) {
    mydiv.innerHTML = "";
    url = addQueryItems(url, getOptions());
    console.log(url);
    let results = await getAllPages(url, limit);
    console.log("# of models:", results.length);
    document.getElementById("count").innerText = results.length;
    let j = 0;
    cam_per_page = 7 * 13;
    results.forEach((element) => {
        let image = element.image_url;
        modelURL = "https:/chaturbate.com/" + element.username;
        // console.log(modelURL)
        addImageLink(mydiv, image, modelURL, element.username);
        j += 1;
        if (j % cam_per_page == 0) {
            // create a horizontal line/separator
            mydiv.appendChild(document.createElement("br"));
            mydiv.appendChild(document.createElement("hr"));
        }
    });
    console.log("Done");
}

function generateGallery() {
    generateGalleryFromJSON(
        "https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=olXgj&client_ip=request_ip",
        500
    );
}


function getbb() {
     // create empty header for fetch
     init = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET",
            "Host": "chaturbate.com",
            "Origin": "https://chaturbate.com",
            'user-agent': 'curl / 7.82.0',
            "Accept": "*/*",
            'Referer': 'https://chaturbate.com/',
        },
    };
    fetch("https://chaturbate.com/api/chatvideocontext/bananabutt_",init)
        .then((response) => response.json())
        .then((data) => {
            console.table(data);
        }
    ).catch((error) => {
        console.log(error);
    }
    );
}