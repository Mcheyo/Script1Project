let animeTruth = [];
let backgroundURL = ["https://pixelz.cc/wp-content/uploads/2018/07/my-neighbor-totoro-side-uhd-4k-wallpaper..jpg", "https://i.pinimg.com/originals/fc/bb/9b/fcbb9b01e4b2ce1f915474f89be3dbca.png", "https://c4.wallpaperflare.com/wallpaper/452/817/174/studio-ghibli-totoro-my-neighbor-totoro-anime-wallpaper-preview.jpg", "https://c4.wallpaperflare.com/wallpaper/746/686/492/olly-moss-studio-ghibli-hayao-miyazaki-howl-s-moving-castle-wallpaper-preview.jpg"]
document.addEventListener("DOMContentLoaded", (e) => { 
console.log("connected")
fetchAnimes()
getAnimeForm().addEventListener('submit', addAnime)
getAnimeSearchForm().addEventListener('submit', (e)=> searchAnime(e))
document.querySelector('h1').addEventListener('click', (e)=> fetchAnimes())
document.getElementById("change-background").addEventListener('click', changeBackground)
})


function getAnimeSearchForm(){
    return document.getElementById('anime-search-form')
}

function getAnimeForm(){ 
    return document.getElementById("anime-form")
}
function fetchAnimes() { 
    fetch('http://localhost:3000/animes')
    .then(r => r.json())
    .then(data => {
        animeTruth = data;
        renderAnimes();
    })
}

function renderAnimes(searchArray){ 
    clearAnime();
    if(!searchArray){
        animeTruth.forEach(anime => buildAnime(anime))}
    else{
        searchArray.forEach(anime => buildAnime(anime))
    }
}

function clearAnime(){
    while(getContainer().firstChild){
        getContainer().removeChild(getContainer().firstChild);
    }
}

function getContainer(){ 
    return document.getElementById("anime-collection")
}

function buildAnime(anime){ 
   let animeContainer =  getContainer()
   let animeTitle = document.createElement("h2")

   let animeCard = document.createElement('div')
   animeCard.dataset.id = anime.id
   animeCard.className="card"
   animeContainer.appendChild(animeCard);

   animeTitle.innerText = anime.name 
   animeCard.appendChild(animeTitle)

   let animeImg = document.createElement("img")
   animeImg.className = "card-image"
   animeImg.src = anime.image 
   animeCard.appendChild(animeImg)

   let animeView = document.createElement('p')
   animeView.innerText = `Views: ${anime.views}`
   animeCard.appendChild(animeView)

   let viewBtn = document.createElement('button')
     viewBtn.innerText = "Watched"
     viewBtn.dataset.id = anime.id 
     
     animeCard.appendChild(viewBtn)
     viewBtn.addEventListener('click', updateView)

    let deleteButton = document.createElement('button');
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener('click', (e)=> deleteOneAnime(e))   
    deleteButton.dataset.id = anime.id;
    animeCard.appendChild(deleteButton);

    if(anime.episodes){
        anime.episodes.forEach(episode => {

            let episodeButton = document.createElement('button');
            episodeButton.innerText = episode.name;
            episodeButton.addEventListener('click', (e)=> showEpisode(e, episode.name, episode.synopsis))
            animeCard.appendChild(episodeButton);
        })
    }
}

function showEpisode(event, name, synopsis){

    console.log(event)
    console.log(name)
    console.log(synopsis)
    alert(synopsis)
}

function deleteOneAnime(event){

    console.log(event);
    console.log(`You've deleted this anime`)
    event.target.parentElement.remove()
    alert("You've removed this anime from your view list")
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


function searchAnime(event){
    event.preventDefault();
    console.log(event);
    let searchTerm = event.target.search.value.toLowerCase();
    let searchResults = animeTruth.filter(anime => anime.name.toLowerCase().includes(searchTerm));
    renderAnimes(searchResults);
}

function changeBackground(){ 
     let wallpaper = document.getElementById("background")
     let randomUrl = backgroundURL[Math.floor(Math.random()*backgroundURL.length)]
      let backgroundString = ` body {
        background-image: url("${randomUrl}");
    }`
    wallpaper.innerText = backgroundString
     
}