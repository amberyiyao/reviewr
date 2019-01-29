if (document.deviceready) {
    document.addEventListener("deviceready", init);
} else {
    document.addEventListener("DOMContentLoaded", init);
}

let test = [];
// let test = [{
//         id: 1497858930404,
//         title: "This is a flower!",
//         rating: 3,
//         img: "img/example1.jpg"
//     },
//     {
//         id: 1477808630404,
//         title: "This is art! ^___^",
//         rating: 1,
//         img: "img/example2.jpg"
//     }
// ];
let imageList = "imageList";
let newRating;
let imageURL;

function init() {
    if (localStorage.getItem(imageList)) {
        test = JSON.parse(localStorage.getItem(imageList));
        getImages();
    } else {
        document.querySelector('.noImage').classList.remove('hidden');
    }
    // localStorage.setItem(imageList, JSON.stringify(test));
    document.querySelector(".backButton").addEventListener("click", homePage);
    document.querySelector(".deleteButton").addEventListener("click", deleteImage);
    document.getElementById("addButton").addEventListener('click', addImage);
    document.getElementById('ABButton').addEventListener('click', homePage);
    document.getElementById('saveButton').addEventListener("click", saveData);
}

function saveData(){

    let title = document.getElementById('newPhotoTitle').value;

    if (!title) {
        alert("Please enter the title!");
        document.getElementById("newPhotoTitle").focus();

    } else if (!newRating) {
        alert("Please press the stars to review!");

    } else {
        let newImage = {
            id: Date.now(),
            title: title,
            rating: newRating,
            img: imageURL
        }
        test.unshift(newImage);
        localStorage.setItem(imageList, JSON.stringify(test));
        homePage();
    }
}

function homePage() {
    document.getElementById("home").classList.remove("hidden");
    document.getElementById("home").classList.add("show");
    document.getElementById("addButton").classList.remove("hidden");
    document.getElementById("addButton").classList.add("show");

    document.getElementById("add").classList.remove("show");
    document.getElementById("add").classList.add("hidden");

    document.getElementById("detail").classList.remove("show");
    document.getElementById("detail").classList.add("hidden");

    getImages();
}

function getImages() {
    //get images from local storage, use json in test

    document.querySelector('.noImage').classList.add('hidden');

    let content = document.querySelector(".contentList");
    content.innerHTML = "";

    if (test.length == 0) {
        document.querySelector('.noImage').classList.remove('hidden');
    } else {

        let documentFragment = new DocumentFragment();
        for (let i = 0; i < test.length; i++) {
            let imageInfo = test[i];
            documentFragment.appendChild(creatImageCard(imageInfo));
        }

        content.appendChild(documentFragment);
    }
}

function creatImageCard(imageInfo) {

    let documentFragment = new DocumentFragment(); 

    let imageCard = document.createElement("div");
    let imageSection = document.createElement("section");
    let image = document.createElement("img");
    let title = document.createElement("p");
    let time = document.createElement("p");

    imageCard.className = "card";
    imageCard.setAttribute("data-number", imageInfo.id);
    imageSection.className = "imageContener";
    image.className = "image";
    image.src = imageInfo.img;

    title.className = "imageTitle";
    title.textContent = imageInfo.title;
    let date = new Date(imageInfo.id);
    time.textContent = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`//https://blog.csdn.net/qq_38543537/article/details/79196192
    
    time.className = 'imgeTime';

    let infoDiv = document.createElement("div");
    infoDiv.className = 'infoDive';
    infoDiv.appendChild(title);
    infoDiv.appendChild(time);
    imageSection.appendChild(image);
    imageCard.appendChild(imageSection);
    imageCard.appendChild(infoDiv);

    imageCard.addEventListener('click', imageDetail);

    documentFragment.appendChild(imageCard);

    return documentFragment;
}

function addImage() {

    document.getElementById('newPhotoTitle').value = '';

    let opts = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK
    };

    let photoFc = {
        yes: function (imgURL) {

            document.getElementById("home").classList.remove("show");
            document.getElementById("home").classList.add("hidden");

            document.getElementById("addButton").classList.remove("show");
            document.getElementById("addButton").classList.add("hidden");

            document.getElementById("add").classList.remove("hidden");
            document.getElementById("add").classList.add("show");

            document.getElementById('photo').src = imgURL;

            imageURL = imgURL;
            addListener();

        },
        no: function (msg) {
            alert("Ooops! "+ msg);
        }
    }

    navigator.camera.getPicture(photoFc.yes, photoFc.no, opts);

}

function imageDetail(ev) {

    document.getElementById("home").classList.remove("show");
    document.getElementById("home").classList.add("hidden");

    document.getElementById("addButton").classList.remove("show");
    document.getElementById("addButton").classList.add("hidden");

    document.getElementById("detail").classList.remove("hidden");
    document.getElementById("detail").classList.add("show");

    let image = document.querySelector(".imageD");
    let title = document.querySelector(".titleD");
    let rating = document.querySelector(".stars");

    let n = ev.currentTarget.getAttribute("data-number");
    let number = test.findIndex( img => img.id == n );

    let date = new Date(test[number].id);
    let time = document.createElement("div");
    time.textContent = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    time.className = 'imgeDTime';
    title.textContent = test[number].title;
    title.appendChild(time);

    image.setAttribute("src", test[number].img);
    rating.setAttribute("data-rating", test[number].rating);
    rating.setAttribute("data-num", number);

    addListener();

}

function addListener() {
    let stars, rating;
    if (document.getElementById("add").className.indexOf('show') === 0) {

        stars = document.querySelectorAll('.A.star');
        rating = 0;

    } else {
        stars = document.querySelectorAll('.D.star');
        rating = parseInt(document.querySelector('.D.stars').getAttribute('data-rating'));
    }
    stars.forEach(star => star.addEventListener('click', setRating));
   
    let target = stars[rating - 1];

    if (rating === 0) {
        stars.forEach(star => star.classList.remove('rated'));
    } else {
        target.dispatchEvent(new MouseEvent('click'));
    }
}

function setRating(ev) {

    let star, stars;
    let span = ev.currentTarget;

    if (document.getElementById("add").className.indexOf('show') === 0) {

        stars = document.querySelectorAll('.A.star');
        star = document.querySelector('.A.stars');

    } else {
        stars = document.querySelectorAll('.D.star');
        star = document.querySelector('.D.stars');
    }

    let match = false;
    let num = 0;
    stars.forEach((star, index) => {
        if (match) {
            star.classList.remove('rated');
        } else {
            star.classList.add('rated');
        }
        if (star === span) {
            match = true;
            num = index + 1;
        }
    });

    if (document.getElementById("add").className.indexOf('show') === 0) {

        newRating = num;

    } else {
        star.setAttribute('data-rating', num);
        let n = star.getAttribute('data-num');

        test[n].rating = num;

        localStorage.setItem(imageList, JSON.stringify(test));
    }
}

function deleteImage() {
    let star = document.querySelector('.stars');
    let n = star.getAttribute('data-num');
    test.splice(n, 1);
    localStorage.setItem(imageList, JSON.stringify(test));

    homePage();
}