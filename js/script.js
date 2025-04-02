let postDiv = document.getElementById("post-wrapper");
let postOverlay = document.getElementById("window");
let contentPost = document.getElementById("content");
let closeIcon = document.getElementById("closeBtn");
let overlayAddIcon = document.getElementById("add");
let overlayAdd = document.getElementById("overlay-add");
let form = document.getElementById("form-el");

function ajax(url, fnc) {
  fetch(url, {
    method: "GET",
  })
    .then(function (response) {
      if (!response.ok) {
        throw response.status;
      }
      return response.json();
    })
    .then(function (responseJs) {
      console.log(responseJs);
      fnc(responseJs);
    })
    .catch(function (error) {
      let pError = document.createElement("p");
      if (error == 404) {
        pError.innerText = "Page not found";
      } else if (error == 500) {
        pError.innerText = "Server error";
      } else {
        pError.innerText = "Check your internet connection";
      }
      fetchDiv.appendChild(pError);
    });
}

function forEachItem(data) {
  data.forEach((element) => {
    createPostDiv(element);
  });
}

ajax("https://jsonplaceholder.typicode.com/posts", forEachItem);

function createPostDiv(item) {
  let divElement = document.createElement("div");
  divElement.classList.add("div-post");
  divElement.setAttribute("data-id", item.id);

  let titleId = document.createElement("h3");
  titleId.textContent = item.id;

  let titleNew = document.createElement("h2");
  titleNew.textContent = item.title;

  let deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.setAttribute("data-delete-id", item.id);

  divElement.appendChild(titleId);
  divElement.appendChild(titleNew);
  divElement.appendChild(deleteBtn);
  postDiv.appendChild(divElement);
  console.log(divElement);

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    let deleteBtnId = e.target.getAttribute("data-delete-id");
    console.log("deleted id=", deleteBtnId);
    let deleteUrl = `https://jsonplaceholder.typicode.com/posts/${deleteBtnId}`;
    console.log(deleteUrl);

    fetch(deleteUrl, {
      method: "DELETE",
    }).then(() => divElement.remove());
  });

  divElement.addEventListener("click", function () {
    contentPost.innerHTML = " ";
    let clickedDivIdValue = this.getAttribute("data-id");
    console.log(clickedDivIdValue);

    postOverlay.classList.add("activeOverlay");
    let newUrl = `https://jsonplaceholder.typicode.com/posts/${clickedDivIdValue}`;
    console.log(newUrl);

    ajax(newUrl, function (newInfo) {
      console.log(newInfo);
      content(newInfo);
    });
  });
}

function content(item) {
  let pDescription = document.createElement("p");
  pDescription.innerText = item.body;
  contentPost.appendChild(pDescription);
}

closeIcon.addEventListener("click", function () {
  postOverlay.classList.remove("activeOverlay");
});

overlayAddIcon.addEventListener("click", function () {
  overlayAdd.classList.add("new-overlay");
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(this[0].value);

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      title: this[0].value,
      userId: 11,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((createdPost) => {
      console.log(createdPost);

      overlayAdd.classList.remove("new-overlay");
      this[0].value = " ";
      createPostDiv(createdPost);
    });
});
