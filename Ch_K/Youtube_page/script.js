const channels = [
  "Channel 1",
  "Channel 2",
  "Channel 3",
  "Channel 4",
  "Channel 5",
  "Channel 6",
  "Channel 7",
  "Channel 8",
  "Channel 9",
  "Channel 10"
];

function setChannels() {
  const list = document.getElementById("channels");
  list.innerHTML = "";

  channels.forEach(name => {
    const btn = document.createElement("button");
    btn.innerHTML = `<i class="fa-solid fa-user"></i> ${name}`;
    list.appendChild(btn);
  });
}

setChannels();

const categories = [
    "All",
    "Music",
    "Gaming",
    "Jams",
    "Poadcasts",
    "News",
    "Sports",
    "Live",
    "Learning",
    "Comedy"
]

function setCategories() {
    const list = document.getElementById("categories");
    list.innerHTML = "";

    categories.forEach(name => {
      const btn = document.createElement("button");
      btn.innerHTML = `${name}`;
      list.appendChild(btn);
    });
}

setCategories();

const API_KEY = "AIzaSyDjQGx12AztfawEBMCmq8-WftP6_A3NTx4";

const video_ids = [
  "fijq0UXjBmE",
  "OYD--5WsuKU",
  "bMXFJkqIrx0",
  "BkrICLDQ3T4",
  "zU7iblkQ-Eg",
  "mpk5FuMOphA",
  "fdXI9yznzz8",
  "7Ve1xSip_bc"
];

function formatViews(views){
  return Intl.NumberFormat('en', { notation: "compact" }).format(views);
}

function formatDate(dateString){
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function formatTitle(title) {
  if (title.length > 60) {
    return title.slice(0, 57) + "...";
  }
  return title;
}

function formatChannelName(name) {
  if (name.length > 60) {
    return name.slice(0, 57) + "...";
  }
  return name;
}

async function getVideoData(video_id) {

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${video_id}&key=${API_KEY}`
  );

  const data = await res.json();
  const v = data.items[0];

  return {
    id: video_id,
    title: formatTitle(v.snippet.title),
    channel: formatChannelName(v.snippet.channelTitle),
    channelId: v.snippet.channelId,
    views: formatViews(v.statistics.viewCount),
    uploadDate: formatDate(v.snippet.publishedAt)
  };
}

async function getChannelAvatar(channelId) {

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`
  );

  const data = await res.json();

  return data.items[0].snippet.thumbnails.default.url;
}

function showVideoData(videoData, avatarUrl) {
  const container = document.getElementById("videos");

  const card = document.createElement("div");
  card.className = "video-card";

  card.innerHTML = `
    <a href="https://www.youtube.com/watch?v=${videoData.id}" target="_blank">
      <img class="video-thumbnail" src="https://img.youtube.com/vi/${videoData.id}/hqdefault.jpg">
    </a>

    <div class="video-info">
      <img class="avatar" src="${avatarUrl}">

      <div class="video-info-container">
        <div class="video-title-container">
          <p class="title">${videoData.title}</p>
          <button><i class="fa-solid fa-ellipsis-vertical ellipsis-icon" style="color: #fff;"></i></button>
        </div>
        <p class="channel">${videoData.channel}</p>
        <p class="meta">${videoData.views} • ${videoData.uploadDate}</p>
      </div>
    </div>
  `;

  container.appendChild(card);
}

async function loadVideos() {

  const videos = await Promise.all(
    video_ids.map(id => getVideoData(id))
  );

  for (const video of videos) {

    const avatar = await getChannelAvatar(video.channelId);

    showVideoData(video, avatar);
  }
}

loadVideos();

const shorts_ids = [
  "Oq4zRUAOM-Y",
  "Mqw5-Y814Xg",
  "EM41yq0OUQ4",
  "hDKSGAcyPCc",
  "sIDVCVGrclw"
];

async function getShortData(video_id) {

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${video_id}&key=${API_KEY}`
  );

  const data = await res.json();
  const v = data.items[0];

  return {
    id: video_id,
    title: formatTitle(v.snippet.title),
    views: formatViews(v.statistics.viewCount)
  };
}

function showShortData(shortData) {
  const container = document.querySelector(".shorts-video-section");

  const card = document.createElement("div");
  card.className = "short-card";

  card.innerHTML = `
    <div class="short-thumb-wrapper">
      <a href="https://www.youtube.com/shorts/${shortData.id}" target="_blank">
        <img class="short-thumbnail"
          src="https://img.youtube.com/vi/${shortData.id}/hqdefault.jpg"
          alt="Short preview">
      </a>
    </div>

    <div class="short-info">
      <p class="short-title">${shortData.title}</p>
      <p class="short-views">${shortData.views} views</p>
    </div>
  `;

  container.appendChild(card);
}

async function loadShorts() {

  const shorts = await Promise.all(
    shorts_ids.map(id => getShortData(id))
  );

  for (const short of shorts) {
    showShortData(short);
  }
}

loadShorts();