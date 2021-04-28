/*
  Studio Ghibli API
  Jun Han Yap (22507198)
  Uses: https://ghibliapi.herokuapp.com
*/


const app = document.getElementById('content');

const logo = document.createElement('img');
logo.setAttribute("id", "ghiblilogo");
logo.src = 'css/images/ghibli/logo.png';

var movieList = []
var movieNumber;
var firstTime = true;

const container = document.createElement('div');
container.setAttribute('class', 'container');
const searchBar = document.createElement('input');
const movieCountDisplay = document.createElement('p');
movieCountDisplay.textContent = "Loading data...";
movieCountDisplay.setAttribute('id', 'movieCountDisplay');
searchBar.setAttribute('id', 'searchBar');
searchBar.setAttribute('type', 'text');
searchBar.setAttribute('placeholder', 'Search Movie');
app.appendChild(logo);
app.appendChild(searchBar);
app.appendChild(movieCountDisplay);
app.appendChild(container);

var finder = document.querySelector("#searchBar");
finder.addEventListener("keyup", onKeyDown);
var movieSearched = '';

/*Helper Functions*/

// Strips title of white space and other elements for search in the image files
function strip(title)  {
  title = title.replace("'", '');
  title = title.replace(/\s/g, '');

  return title;
}

// Capitalises the first letter of the string for aesthetic purposes
function capitaliseFirstLetter(title) {
  return title.charAt(0).toUpperCase() + title.slice(1);
}

// Begins the search for films with user key input
function onKeyDown(e) {
  var form = document.getElementById("searchBar").value;

  searchMovie(form);
}

/* My Studio Ghibli API Functions */

// Starter code to get data from the Studio Ghibli API
var request = new XMLHttpRequest();
request.open('GET', 'https://ghibliapi.herokuapp.com/films', true);
request.send();
request.onload = function () {
  var data = JSON.parse(request.response);
  if (request.status >= 200 && request.status < 400) {
    displayMovie(data);
  } else {
    const errorMessage = document.createElement('marquee');
    errorMessage.textContent = `Error! There may be a problem with the Studio Ghibli API!`;
    app.appendChild(errorMessage);
  }
}

// Searches movieList with the string
function searchMovie(string)  {

  var movies = [];
  for(var i = 0; i<movieList.length; i++)  {
    if(((movieList[i].title).toLowerCase()).includes(string))  {
      if(!movies.includes(movieList[i].id))  {
        movies.push(movieList[i].id);
      }
    }
  }
  console.log("movies " + movies);
  displaySearch(movies);
}

// Calls the API with the list of movies that correspond with the user's search and displays them
function displaySearch(movies)  {
  var moviesList = [];
  var requests = 0;
  
  for (var i = 0; i < movies.length; i++) {
    var url = "https://ghibliapi.herokuapp.com/films/" + movies[i];
    requests++;

    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            var data = JSON.parse(request.responseText);
            moviesList.push(data);
            requests--;
 
        }
        if(requests==0) {
          container.innerHTML = ''
          displayMovie(moviesList); 
        }
    }
    
    request.send();
  }
}

// Displays the movie poster and the title into a card
function displayMovie(data) {

  data.forEach(movie => {
    const card = document.createElement('a');
    card.setAttribute('class', 'card');
    const h1 = document.createElement('h1');
    const img = document.createElement('img')
    img.setAttribute("id", "ghibliimg")
    img.setAttribute("src", "css/images/ghibli/"+(strip(movie.title)).toLowerCase()+".jpg");
    h1.setAttribute("id", "movieInfo")
    h1.textContent = movie.title;
    var movieID = movie.id;
    card.setAttribute('href', '#')
    card.setAttribute('onclick', "getMovieDetails('"+movieID+"');return false")

    const p = document.createElement('p');
    movie.description = movie.description.substring(0, 300);
    p.textContent = `${movie.description}...`;
    container.appendChild(card);
    card.appendChild(h1);
    card.appendChild(img);
    
    if(firstTime) {
      movieObject = {"id":movieID, "title":movie.title}
      movieList.push(movieObject);
    }
    
  });
  if(firstTime) {
    firstTime = false;
  }
  movieNumber = movieList.length;
  movieCount(data.length);
}

function movieCount(number) {
  const text = document.getElementById('movieCountDisplay');
  text.textContent = "Displaying "+ number + " of " + movieNumber +  " Films"
}

// Gets movie details for the popup info box
function getMovieDetails(movieID){
  var movieDetails = new XMLHttpRequest();
  movieDetails.open('GET', 'https://ghibliapi.herokuapp.com/films/'+movieID, true);

  movieDetails.onload = function () {
    var details = JSON.parse(movieDetails.response);
    if(movieDetails.status >= 200 && movieDetails.status < 400) {
      popUpInfo(details);
    }
    else {
      const errorMessage = document.createElement('marquee');
      errorMessage.textContent = `Error! There may be a problem with the Studio Ghibli API!`;
      app.appendChild(errorMessage);
    }
  }

  movieDetails.send();
}

// Displays the details onto the popup
function popUpInfo(info)  {
  const popup = document.createElement('span');
  popup.setAttribute('class','popuptext');
  popup.setAttribute('id', 'myPopup');

  popup.textContent = `${info.description}`;
  movieInfoBox.style.display = "block";

  var text = document.getElementById('movieInfoText');
  var movieTitle = strip(info['title']).toLowerCase();
  var moviePoster = document.createElement('img');
  moviePoster.setAttribute('src', 'css/images/ghibli//'+movieTitle+'.jpg');
  moviePoster.setAttribute('id', 'moviePoster');
  text.appendChild(moviePoster);

  for(var prop in info) {
    //Prevents unecessary information to be appended
    if((prop == "id") || (prop == "people") || (prop == "species") || (prop == "locations") || (prop == "vehicles") || (prop == "url") || (prop == "length"))  {
      continue;
    }
    var movieInfoBoxContent = document.createElement('p')
    movieInfoBoxContent.textContent = capitaliseFirstLetter(prop) +": "+ info[prop];
    text.appendChild(movieInfoBoxContent);
  }
}

/* PopUp movieInfoBox*/
// Gets movieInfoBox
var movieInfoBox = document.getElementById("movieInfoBox");

// Get the <span> element that closes the movieInfoBox
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the movieInfoBox
span.onclick = function() {
  movieInfoBox.style.display = "none";
  document.getElementById('movieInfoText').innerHTML = "";
}

// Closes the movieInfobox when the user clicks anywhere outside of the movieInfoBox
window.onclick = function(event) {
  if (event.target == movieInfoBox) {
    movieInfoBox.style.display = "none";
    document.getElementById('movieInfoText').innerHTML = "";
  }
}