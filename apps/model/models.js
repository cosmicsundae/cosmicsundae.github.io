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
function addImageLink(image, link, name) {

    // create image
    const newimg = document.createElement("img");
    newimg.className = 'model'
    newimg.src = image;
    newimg.alt = name;
    newimg.title = name;

    // create link
    const newa = document.createElement("a");
    newa.href = link;
    newa.target = "_blank";
    newa.id = name;

    // put the image in the link
    newa.appendChild(newimg);

    // add link to element
    return newa
}

function addIndexedLink(i, link) {
    const newlink = document.createElement("a");
    newlink.href = link;
    newlink.innerText = link;
    // add line number
    const newp = document.createElement("p");
    newp.innerText = "index " + i + "   ";
    newp.appendChild(newlink);

    return newp

}

// create image with caption below it
function addImageCaption(newimg, caption) {
    // stack image and caption
    const newp = document.createElement("p");
    newp.innerText = caption;
    newp.style.textAlign = "center";
    // make text small, helvetica
    newp.style.fontFamily = "Tahoma, Geneva, sans-serif";
    newp.style.fontSize = "small";
    newp.style.marginBottom = "0px";
    newp.style.marginTop = "0px";

    const newdiv = document.createElement("div");
    newdiv.className = "broadcaster"
    newdiv.style.display = "inline-block";
    // reduce gap between image and caption


    newdiv.appendChild(newimg);
    newdiv.appendChild(newp);

    return newdiv;
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

    // create a new div
    mydiv.innerHTML = "";

    // get url for query
    url = addQueryItems(url, getOptions());
    console.log(url);

    // get all of the results in single json file
    let results = await getAllPages(url, limit);
    console.log("# of models:", results.length);

    // write counts to html
    document.getElementById("count").innerText = results.length;

    // loop over all items
    let j = 0;
    cam_per_page = 7 * 13; // break into pages

    await results.forEach((element) => {

        let image = element.image_url;
        modelURL = "https://chaturbate.com/" + element.username;
        // console.log(modelURL)

        // add image with link
        image_link = addImageLink(image, modelURL, element.username);
        image_with_caption = addImageCaption(image_link, element.username);
        mydiv.appendChild(image_with_caption)
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

