let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //working on the current code.
  fetch("http://localhost:3000/toys")
    .then((ftch) => ftch.json())
    .then((data) => {
      data.forEach((toy) => {
        const toyCard = createToyCard(toy);
        toyCollection.appendChild(toyCard);
      });
    });
  toyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const imageInput = document.getElementById("image");

    const newToy = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0,
    };
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify(newToy),
    })
      .then((ftch) => ftch.json())
      .then((toyadded) => {
        const newToyCard = createToyCard(toyadded);
        toyCollection.appendChild(newToyCard);
        nameInput.value = "";
        imageInput.value = "";
      });
  });
  toyCollection.addEventListener("click", function (event) {
    if (event.target.classList.contains("like-btn")) {
      const likeButton = event.target;
      const toyId = likeButton.id; 
  
      const toyCard = likeButton.parentElement; 
      const likeCountElement = toyCard.querySelector("p"); 
  
      const currentLikes = parseInt(likeCountElement.textContent.split(": ")[1]); 
  
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: currentLikes + 1 }), 
      })
        .then(response => response.json())
        .then(updatedToy => {
          likeCountElement.textContent = `Likes: ${updatedToy.likes}`;
        })
    };
  });
});

function fetchToys() {
  fetch(toyUrl)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((toy) => {
        const toyCard = createToyCard(toy);
        toyCollection.appendChild(toyCard);
      });
    });
}

function createToyCard(toy) {
  const card = document.createElement("div");
  card.classList.add("card");

  const name = document.createElement("h2");
  name.textContent = toy.name;
  card.appendChild(name);

  const image = document.createElement("img");
  image.classList.add("toy-avatar");
  image.src = toy.image;
  card.appendChild(image);

  const likes = document.createElement("p");
  likes.textContent = `Likes: ${toy.likes}`;
  card.appendChild(likes);

  const likeButton = document.createElement("button");
  likeButton.classList.add("like-btn");
  likeButton.id = toy.id;
  likeButton.textContent = "Like";
  card.appendChild(likeButton);

  return card;
}

