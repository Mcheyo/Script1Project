document.addEventListener("DOMContentLoaded", (e) => { 
console.log("connected")
fetchAnimes()
getAnimeForm().addEventListener('submit', addAnime)

})
function getAnimeForm(){ 
    return document.getElementById("anime-form")
}
function fetchAnimes() { 
    fetch('http://localhost:3000/animes')
    .then(r => r.json())
    .then(data => renderAnimes(data))
}

function renderAnimes(data){ 
 data.forEach(anime => buildAnime(anime))
}
function getContainer(){ 
    return document.getElementById("anime-collection")
}

function buildAnime(anime){ 
   let animeContainer =  getContainer()
   let animeTitle = document.createElement("h2")
   animeTitle.innerText = anime.name 
   animeContainer.appendChild(animeTitle)

   let animeImg = document.createElement("img")
   animeImg.className = "card-image"
   animeImg.src = anime.image 
   animeContainer.appendChild(animeImg)

   let animeView = document.createElement('p')
   animeView.innerText = `Views: ${anime.views}`
   animeContainer.appendChild(animeView)

   let viewBtn = document.createElement('button')
     viewBtn.innerText = "Watched"
     viewBtn.dataset.id = anime.id 
     animeContainer.appendChild(viewBtn)
     viewBtn.addEventListener('click', updateView)
}

function addAnime(event){ 
    event.preventDefault()
   let  newTitle = event.target.name.value 
   let newImg = event.target.image.value
    let newAnime = {name: newTitle, image: newImg, views: "0"}
    event.target.reset()
    fetch('http://localhost:3000/animes',{ 
        method: "POST", 
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newAnime)
    }) 
    .then(r => r.json())
    .then(anime => buildAnime(anime))
  
}

function updateView(event){ 
     let newView = {views: incrementViews(event)}
     let animeID = event.target.dataset.id
    fetch('http://localhost:3000/animes/'+ animeID, { 
        method: "PATCH", 
        headers: { 
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify(newView)
    }).then(r => r.json() )
    .then(data => event.target.previousElementSibling.innerText = ` Views: ${data.views}` )

}

function incrementViews(event){ 
  let views = event.target.previousElementSibling.innerText.split(" ")
  let increment  = parseInt(views[1])
  
  return ++increment
}