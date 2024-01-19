let currSong = new Audio();
let currFolder;
let songs = [];
function convertSecondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

//   // Example usage:
//   const totalTimeInSeconds = 125;
//   const formattedTime = convertSecondsToMinutesAndSeconds(totalTimeInSeconds);
//   console.log(formattedTime); // Output: "2:05"

async function getsongs(folder) {
  currFolder = folder;
  // console.log(`/assets/music/${folder}`);
  let a = await fetch(
    `/Spotify-clone/assets/music/${folder}`
  );
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element);
      // console.log(element);
      // songs.push(element.innerText);
    }
  }
    // get the list of all the songs


    // console.log(songs);
    let songUl = document
      .querySelector(".songList")
      .getElementsByTagName("ul")[0];
    songUl.innerHTML = "";
    for (const song of songs) {
      allsongs.push(song.innerText);
      songUl.innerHTML += `<li>
          <img src="./assets/images/music.svg" alt="songs">
          <div class="song-info">
              <div>${song.innerText.split("-")[0]}</div>
              <div>${song.innerText.split("-")[1].split(".")[0]}</div>
              </div>
              <div class="play-now">
              <div>Play Now</div>
              <img class="invert" src="./assets/images/play.svg" alt="">
          </div>
          </li>`;
    }

    Array.from(
      document.querySelector(".songList").getElementsByTagName("li")
      ).forEach((e) => {
        e.addEventListener("click", (element) => {
          const path = e.querySelector(".song-info");
          const playthis =
          path.firstElementChild.innerText +
          "-" +
          path.lastElementChild.innerText +
          ".mp3";
          // console.log(e);
          playMusic(
            path.firstElementChild.innerText,
            path.lastElementChild.innerText,
            playthis
            );
          });
      // console.log(path.firstElementChild.innerText +"-"+ path.lastElementChild.innerText+".mp3");
    });
    return songs;
}

const playMusic = (name, artist, e) => {
  let folder = currFolder;
  // console.log(folder,name,artist,e);
  console.log(e);
  // let audio = new Audio(`./assets/music/${e}`);
  currSong.src = `./assets/music/${folder}/${e}`;
  currSong.play();
  play.src = "./assets/images/playpause.svg";
  document.querySelector(".song-info-playbar").innerHTML = `${name}-${artist}`;
  document.querySelector(".song-time-playbar").innerHTML = `00:00/00:00`;
};

async function getFolders(){
  let a = await fetch(`/Spotify-clone/assets/music/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".card-container")
  for(let i=0; i<anchors.length; i++){
    const element = anchors[i];
    if(element.href.includes("/music")){
      let folder = (element.href.split("/").slice(-2)[0]);
      let a = await fetch(`/Spotify-clone/assets/music/${folder}/info.json`);
      let response = await a.json();
      // console.log(response.title,response.descreption,response.datafolder);
      cardContainer.innerHTML+= `                    <div data-folder=${response.datafolder} class="card">
      <div class="img">
          <img src="./assets/music/${folder}/cover.jpg" alt="">
          <div class="circle">
              <img src="./assets/images/play.svg" alt="">
          </div>
      </div>
      <div class="h3">
          <h3>${response.title}</h3>
      </div>
      <div class="para">
          <p>${response.descreption}</p>
      </div>
  </div>`
    }
  }
      // Load the playlist when card is clicked
      Array.from(document.getElementsByClassName("card")).forEach((e)=>{
        e.addEventListener("click",async (item)=>{
          // console.log(item.currentTarget);
          songs = await getsongs(`${item.currentTarget.dataset.folder}`);
          // console.log(songs[0]);
          // console.log(songs[0].href.split("/").slice(-1)[0].split("-")[0].replaceAll("%20"," "));
          let name = songs[0].href.split("/").slice(-1)[0].split("-")[0].replaceAll("%20"," ");
          let artist = songs[0].href.split("/").slice(-1)[0].split("-")[1].split(".")[0].replaceAll("%20"," ");
          playMusic(name,artist,name+"-"+artist+".mp3");
        })
      })
}
let allsongs =[];
async function main() {
  // get all the folders
  getFolders();

  // console.log(songs);

  // var audio = new Audio(songs[2].href);
  // document.querySelector(".play").addEventListener("mousedown",()=>{
    //     audio.play()
    // });
    // document.querySelector(".pause").addEventListener("mousedown",()=>{
      //     audio.pause();
      // });
      await getsongs("FrankSinatra");

      // Attach event listener to prev play next
      play.addEventListener("click", (e) => {
        if (currSong.src != "") {
          if (currSong.paused) {
            currSong.play();
            play.src = "./assets/images/playpause.svg";
          } else {
            currSong.pause();
            play.src = "./assets/images/playpause2.svg";
          }
        }
      });

      // song play pause using spacebar
      document.addEventListener("keydown",(e)=>{
        if(e.code=="Space"){
          if(currSong.src!=""){
            if(currSong.paused){
              currSong.play();
              play.src = "./assets/images/playpause.svg";
            }
            else{
              currSong.pause();
              play.src = "./assets/images/playpause2.svg";
            }
        }
      }
  })

  // listen for time update event
  currSong.addEventListener("timeupdate", (e) => {
    // console.log(currSong.currentTime, currSong.duration);
    document.querySelector(
      ".song-time-playbar"
      ).innerHTML = `${convertSecondsToMinutesAndSeconds(currSong.currentTime)} / ${convertSecondsToMinutesAndSeconds(currSong.duration)}`;
      document.querySelector(".circle2").style.left = (currSong.currentTime/currSong.duration)*100 + "%";
    });

    // Add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
      let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
      document.querySelector(".circle2").style.left = percent + "%";
      currSong.currentTime = (percent * currSong.duration)/100;
    });

    // add an eventlistner for hamburger
    document.querySelector(".hamburger").addEventListener("click",(e)=>{
      document.querySelector(".left").style.left = 0+"%";
    })

    // add an event listener for cross
    document.querySelector(".cross").addEventListener("click",()=>{
      document.querySelector(".left").style.left = "-140%";
    })

    // add an event listener to prev and next
    prev.addEventListener("click",()=>{
      // console.log(allsongs);
      if(currSong.src!=""){
        const s = currSong.src.split("/").slice(-1)[0].replaceAll("%20"," ");
        let idx = allsongs.indexOf(s);
        // console.log(idx);
        if(idx>0){
          const prevSong = allsongs[idx-1];
          // console.log(prevSong);
          playMusic(prevSong.split("-")[0],prevSong.split("-")[1].split(".")[0],prevSong)
          // console.log(prevSong.split("-")[0],prevSong.split("-")[1].split(".")[0],prevSong);
        }
      }
    })
    next.addEventListener("click",()=>{
      // console.log(allsongs);
      if(currSong.src!=""){
        const s = currSong.src.split("/").slice(-1)[0].replaceAll("%20"," ");
        let idx = allsongs.indexOf(s);
        // console.log(idx);
        if(idx<allsongs.length-1){
          const nextSong = allsongs[idx+1];
          // console.log(nextSong);
          playMusic(nextSong.split("-")[0],nextSong.split("-")[1].split(".")[0],nextSong)
          // console.log(nextSong.split("-")[0],nextSong.split("-")[1].split(".")[0],nextSong);
        }
      }
    })
    // volume
    document.addEventListener("keydown",(e)=>{
      if(e.key=="ArrowDown"){
        currSong.volume = currSong.volume - (10/100);
      }
      if(e.key=="ArrowUp"){
        currSong.volume = currSong.volume + (10/100);
      }
    })


  }
  main();
