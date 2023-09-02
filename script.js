let video = document.querySelector("video");
let recordrBtnCount = document.querySelector(".record-btn-cont");
let recordrBtn = document.querySelector(".record-btn");
let captBtnCount = document.querySelector(".capure-btn-cont");
let captBtn = document.querySelector(".capure-btn");
let trnasparentColor="transparent";
let recordFlag = false;


let recorder;
// let chunks=[];  media data in chunks

let constraints = {
    video: true,
    audio: true,
}
// navigator global object and it give browser  related info btaye gi
navigator.mediaDevices.getUserMedia(constraints)   //it return promisises
    .then((stream) => {
        video.srcObject = stream;
        //provides functionality to easily record media.
        recorder = new MediaRecorder(stream);
        recorder.addEventListener("start", (e) => {
           //1) // jb record kre ge uske baad empty krte chlna
            chunks = [];
        })
// dataavailable
//Fires periodically each time timeslice milliseconds of media have been recorded (or when the entire media has been recorded, if timeslice wasn't specified). 
//The event, of type BlobEvent, contains the recorded media in its data property.
//jb stream se dataavaible reh ga to use hme chukns  vle array me daal ke rkh de reh hai
//2)
        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        })
         //recording // stop krneke 
        recorder.addEventListener("stop", (e) => {
            // conversion  of media chunks data to video
  //          read =>data ko only display krna chate hai to read use hoga.
    //write =>data ko update krna chahtte hai then we use write operation

            let blob = new Blob(chunks, { type: "video/mp4" });
            if(db){
                //shortid  using shortid hm id genrate kr reh hai and then vhi id use kre hai
                let videoId=shortid(); //in this we call for id
                let dbTransaction=db.transaction("video","readwrite");
                let videoStore =dbTransaction.objectStore("video");
                let videoEntry={
                    id:`vid-${videoId}`,    //uniquely id hme chayiye sare data ke liye //yha se uniq id jaye ga 
                    blobData:blob
                }
                videoStore.add(videoEntry);
            }
            // donwload vedio this is conten
            // let videoURL = URL.createObjectURL(blob);
            // let a = document.createElement("a");
            // a.href = videoURL;
            // a.download = "stream.mp4";
            // a.click();

        })
    })
    // whwn we strt recording then we don't have data
recordrBtn.addEventListener("click", (e) => {
    // console.log("hi");
    if (!recorder) {
        return;
    }
    recordFlag = !recordFlag;
    if (recordFlag) {
        // strt the media recording
        recorder.start();
        // classlist basiacaly here we use add style or remove style
        recordrBtn.classList.add("scale-record");
        startTimer();
    }
    else {
        // stop the media recording
        recorder.stop();
        recordrBtn.classList.remove("scale-record");
        stopTimer();

    }
})
// canvas to capture image from vedio
captBtnCount.addEventListener("click",(e)=>{
    captBtnCount.classList.add("scale-capture");
    // take the element of canvas using createElement
    let canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    
    //getContext we use  for drawaing on board
    let tool=canvas.getContext("2d");
    // using drwImge canvas ke upar hm image draw kr skte hau
    tool.drawImage(video,0,0,canvas.width,canvas.height);
       // Filteing
       //canvas se image nikal ke filter lga reh hai
       tool.fillStyle=trnasparentColor;
       tool.fillRect(0,0,canvas.width,canvas.height);
    //    canvas se url niklne ke liye toDataURL
    let imageURL=canvas.toDataURL();
    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();
    if(db){
        let imageId=shortid();
        let dbTransaction=db.transaction("image","readwrite");
        let imageStore =dbTransaction.objectStore("image");
        let imageEntry={
            id:`img-${imageId}`,
            url:imageURL
        }
        imageStore.add(imageEntry);
    }
    // adding animation for capturin button
setTimeout(()=>{
    captBtnCount.classList.remove("scale-capture");
},500)
    
})

let timerID;
let counter = 0;  //Represtn total second
let timer = document.querySelector(".timer");

// recording jaise bhi timer start oh jaye  and stop oh jaye

function startTimer() {
    timer.style.display="block"
    function displayTimer() {
        let totalSeconds = counter;
        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds - totalSeconds % 3600;   //remaning value

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;
        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerHTML = `${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerID = setInterval(displayTimer, 1000);

}
function stopTimer() {
    timer.style.display="none"
    clearInterval(timerID);
    timer.innerText = "00:00:00";
}

// next vedio ko record krna pde ga
//Filteing logic
let filterLayer=document.querySelector(".filter-layer");
let allFilters=document.querySelectorAll(".filter");
allFilters.forEach(filterElement => {
    // jb bhi filter pe click oh tbhi tb set vla kaamm hoga
    filterElement.addEventListener("click",(e)=>{
        // get color
        trnasparentColor =getComputedStyle(filterElement).getPropertyValue("background-color");
        //filterLayer.style.backgroundColor   this syntax set the color so first we need to get And then set
        // set color
        filterLayer.style.backgroundColor=trnasparentColor;    
    })
});





