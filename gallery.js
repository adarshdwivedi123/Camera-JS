setTimeout(()=>{
    // page jo reload oh rha hai use kuch time lga ge fa then data aye ga
    //that why we use settimout jaaise page reload oh turanth dat a ajaye 
    //aise time dale ge user ko pta bhi  nhi chle ga reload oh jaye ga
    // settimeout hm use kr reh hai ki db se data a rh ahai  kuch timeme 



    if(db)
    {
        // vedio retrival
        // images retrival
        let dbTransaction=db.transaction("video","readonly");  //db se  read krna hai  that why readonly use kr skte oh
        let videoStore=dbTransaction.objectStore("video");
        // jitne bhoi vedio sb ko acces krna chahta hu
        let videoRequest =videoStore.getAll();  //Event driven
        videoRequest.onsuccess=(e)=>{
            let videoResult=videoRequest.result;
            let galleryCont=document.querySelector(".gallery-cont");
            // console.log(videoResult);
            videoResult.forEach((videoObj) => {
                let mediaElement=document.createElement("div");
                mediaElement.setAttribute("class","media-cont");
                mediaElement.setAttribute("id",videoObj.id);
                let url=URL.createObjectURL(videoObj.blobData);
                // blobdata ko url me convert krne ke liye hm use kr reh  hai createObjecURL
                // becoz autoplay and loop our vedio is running as it is in gallery
                mediaElement.innerHTML=`
                <div class="media">
                    <video  autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div> 
                   `;
                //    listerner
                // yha dekho media elmenent ke andar rkha hai sb to mediaElement se isliye nikal rha hai
                   let deleteBtn=mediaElement.querySelector(".delete");
                   deleteBtn.addEventListener("click",deleteListener);   //deleter listenrer syntax se we can do in this way also

                   let downlaodBtn=mediaElement.querySelector(".download");
                   downlaodBtn.addEventListener("click",downloadListener);
                   galleryCont.appendChild(mediaElement);
            });
        }
        // images retrival

        let imagedbTransactions=db.transaction("image","readonly");
        let imageStore=imagedbTransactions.objectStore("image");
        let imageRequest =imageStore.getAll();  //Event driven
        imageRequest.onsuccess=(e)=>{
            let imageResult=imageRequest.result;
            let galleryCont=document.querySelector(".gallery-cont");
            // console.log(videoResult);
            imageResult.forEach((imageObj) => {
                let mediaElement=document.createElement("div");
                mediaElement.setAttribute("class","media-cont");
                mediaElement.setAttribute("id",imageObj.id);
                let url= imageObj.url;
                mediaElement.innerHTML=`
                <div class="media">
                    <img src="${url}"/>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div> 
                   `;
                //    listerner
                   galleryCont.appendChild(mediaElement);
                   let deleteBtn=mediaElement.querySelector(".delete");
                   deleteBtn.addEventListener("click",deleteListener);

                   let downlaodBtn=mediaElement.querySelector(".download");
                   downlaodBtn.addEventListener("click",downloadListener);
                 
            });
        }
    }
},100)

// ui remove 
//Db se remove krna hai datsa
// delete krne se phele pta krna pde ga voe vedio element hai image hai
function deleteListener(e){
    console.log("kcuh aya "+ JSON.stringify(e));
    // ye hai Db removal
    // yha pe delete button pe click kiya to iske parent ke pass id hai
    //to iske parent se id nikal ke le aye hai
    let id=e.target.parentElement.getAttribute('id');
    // check vedio or img
    let type=id.slice(0,3);
    if(type === "vid")
    // herer vedio store me ja kr delete kr reh hai
    {
        let dbTransaction=db.transaction("video","readwrite");
        let videoStore=dbTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if(type === "img")
    {
            
        let imagedbTransactions=db.transaction("image","readwrite");
        let imageStore=imagedbTransactions.objectStore("image");
        imageStore.delete(id);
    }
    // ui remmoval aise hoga
    e.target.parentElement.remove();
}

function downloadListener(e){
    let id=e.target.parentElement.getAttribute('id');
    let type=id.slice(0,3);
    if(type === "vid")
    {
        let dbTransaction=db.transaction("video","readwrite");
        let videoStore=dbTransaction.objectStore("video");
         let videoRequest= videoStore.get(id);
         videoRequest.onsuccess =(e) =>{
            let videoResult=videoRequest.result;

             let videoURL = URL.createObjectURL(videoResult.blobData);
            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
         }
    }
    else if(type === "img")
    {
        let imgdbTransaction=db.transaction("image","readwrite");
        let imageStore=imgdbTransaction.objectStore("image");
         let imageRequest= imageStore.get(id);
         imageRequest.onsuccess =(e) =>{
            let imageResult=imageRequest.result;

            //  let imageURL = URL.createObjectURL(imageResult.blobData);
            let a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpg";
            a.click();
         }

    }


    }
