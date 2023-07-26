var newChat = document.getElementById("new-chat");
var friends = document.getElementById("friend-list");
var search = document.getElementsByClassName("search");
var searchInput = document.querySelector("#search-friend");
var searchResult = document.querySelector("#searchResult");
var list = document.querySelector("#list");
var right = document.querySelector("#right");
newChat.onclick = function (){
    friends.style.display = "initial";
}

window.onclick = function (event){
    if(event.target != friends && event.target !=newChat && event.target !=search && event.target!=searchInput)
    {
        friends.style.display = "none";
    }
}

searchInput.addEventListener("input",function()
{
  var value = searchInput.value;
  if(value.trim().length>0)
  {
    axios.get(`/find/username/${value}`)
    .then((response)=>
    {
      var cluter = ``;
      response.data.forEach((user)=>
      {
        cluter +=  `
        <div class="person" onclick="addFriend('${user.username}','${user.pic}')">
        <div class="picture">
          <img src="${user.pic}" alt="">
        </div>
        <div class="discription">
        <h3>${user.username}</h3>
        </div>      
      </div> 
        `;
      })
      searchResult.innerHTML = cluter;
    })
  }
  else 
  {
    searchResult.innerHTML = ``;
  }
})
var clutter2 = ``;

function addFriend(username,picture)
{
    clutter2 += `
    <div class="person" onclick="openChat('${username}','${picture}')">
    <div class="picture">
      <img src="${picture}" alt="">
    </div>
    <div class="discription">
      <h3>${username}</h3>
      <p>something..</p>
    </div>
    <h6 style="position : absolute; right : 20px;">time</h6>
  </div>`
    list.innerHTML = clutter2;
}

async function openChat(username, picture){
  var response = await axios.post(`/getChat`,{oppositUsername : username});
  
  var userChats = response.data;
  var clutter1 = ``;

  userChats.forEach((chating)=>{
    if(chating.fromUser.username == username)
    {
      clutter1 += `
      <div class="outgoing">
      <div class="outgoingmsg">
        <p>${chating.message}</p>
        <span><p>${chating.time}</p></span>
      </div>
    </div>
    `
    }
    else 
    {
      clutter1 += `
      <div class="incoming">
      <div class="incomingmsg">
        <p>${chating.message}</p>
        <span><p>${chating.time}</p></span>
      </div>
    </div>
      ` 
    }
  })

  var clutter3 = ``;
    clutter3 += 
    `
    <div class="conversation">
    ${clutter1}
    </div>
    <div id="rig-nav">
    <div class="profile">
      <div class="pic">
        <img src="${picture}" alt="">
      </div>
      <h3>${username}</h3>
    </div>
    <div id="contact">
      <i class="ri-live-fill"></i>
      <i class="ri-phone-fill"></i>
      <i class="ri-subtract-fill" style="rotate: -90deg; font-size: 25px;"></i>
      <i class="ri-search-line" style="rotate: -270deg;"></i>
    </div>
  </div>
    <div id="rb-nav">
    <i class="ri-emotion-happy-line"></i>
    <i class="ri-attachment-2"></i>
    <div id="type" >
        <input type="text" onchange="newmsg('${username}')" id="newmsg" placeholder="Type a massage">
    </div>
    <i class="ri-mic-line"></i>
    </div>
    `;

    right.innerHTML =clutter3; 
}



