let data,
  mainTag = document.querySelector(".main"),
  filterSection = document.querySelector(".filter-section"),
  inputContainer = document.querySelector(".input_container"),
  dataList = document.querySelector(".filter-section__datalist"),
  unorderedList = document.querySelector(".filter-section__ul"),
  clearButton = document.querySelector(".filter_buttons_clear"),
  searchButton = document.querySelector(".filter_buttons_search"),
  currentFilterEnabled = [];

if (localStorage.getItem("companies")) {
  data = JSON.parse(localStorage.getItem("companies"));
} else {
  await fetchData();
}

clearButton.addEventListener("click", async () => {
  while (unorderedList.firstChild) {
    unorderedList.removeChild(unorderedList.firstChild);
  }
  await fetchData();
  location.reload();
});

searchButton.addEventListener("click", async () => {
  if(currentFilterEnabled.length === 0) {
    await fetchData();
    localStorage.setItem("companies", JSON.stringify(data));
    location.reload();
  }
  else {
    let newData = [];
    await fetchData();
    data.forEach((ele) => {
      let found = false;
      currentFilterEnabled.forEach((filter) => {
          if (!found && ele.languages.includes(filter)) {
              newData.push(ele);
              found = true;
          }
      });
    });
    data = newData;
    localStorage.setItem("companies", JSON.stringify(data));
    location.reload();
  }
  
});

buildFilterSection();
function buildFilterSection() {
  let inputTag = document.createElement("input");
  inputTag.name += "skills";
  inputTag.setAttribute("list", "skills");
  inputTag.setAttribute("onfocus", `this.value=''`);
  inputTag.setAttribute("type", "text");
  inputTag.addEventListener("input", () => {
    let currentVal = inputTag.value;
    inputTag.value = "";

    if (!currentFilterEnabled.includes(currentVal)) {
      currentFilterEnabled.push(currentVal);
      let list = document.createElement("li");
      list.classList.add("company_filter_names");
      list.textContent += currentVal;
      unorderedList.appendChild(list);
    }
  });
  inputContainer.insertBefore(inputTag, dataList);
}

async function fetchData() {
  const companyFetch = await fetch("data.json");
  const companyData = await companyFetch.json();
  data = companyData;
  localStorage.setItem("companies", JSON.stringify(data));
}

// Building the layout
data.forEach((item) => {
  buildLayout(item);
});

function buildLayout(item) {
  let skeleton = buildSkeleton(item);

  // Appending skeleton
  mainTag.appendChild(skeleton);
}

function buildSkeleton(item) {
  let section = document.createElement("section");
  section.classList.add("section");
  if (item.featured) {
    section.classList.add("special");
  }

  // 1st section
  let imagePart = document.createElement("div");
  imagePart.classList.add("company-image");
  let img = document.createElement("img");
  img.src += item.logo;
  imagePart.appendChild(img);

  // 2nd section
  let details = document.createElement("div");
  details.classList.add("company-details");

  // 1st div
  let firstDiv = document.createElement("div");
  firstDiv.classList.add("first-div");
  let companyName = document.createElement("span");
  companyName.classList.add("company-name");
  companyName.textContent += item.company;
  firstDiv.appendChild(companyName);

  if (item.new) {
    let newFlag = document.createElement("span");
    newFlag.classList.add("new");
    newFlag.textContent += "NEW!";
    firstDiv.appendChild(newFlag);
  }
  if (item.featured) {
    let featured = document.createElement("span");
    featured.classList.add("featured");
    featured.textContent += "FEATURED";
    firstDiv.appendChild(featured);
  }

  // 2nd Div
  let secondDiv = document.createElement("div");
  secondDiv.classList.add("second-div");
  let role = document.createElement("div");
  role.classList.add("role");
  role.textContent += item.position;
  secondDiv.appendChild(role);

  // 3rd Div
  let thirdDiv = document.createElement("div");
  thirdDiv.classList.add("third-div");
  let timeline = document.createElement("span");
  timeline.classList.add("timeline");
  timeline.textContent += item.postedAt;
  let dot = document.createElement("span");
  dot.textContent += ".";
  let dot1 = document.createElement("span");
  dot1.textContent += ".";
  let roleType = document.createElement("span");
  roleType.classList.add("role-type");
  roleType.textContent += item.contract;
  let location = document.createElement("span");
  location.classList.add("location");
  location.textContent += item.location;
  thirdDiv.appendChild(timeline);
  thirdDiv.appendChild(dot);
  thirdDiv.appendChild(roleType);
  thirdDiv.appendChild(dot1);
  thirdDiv.appendChild(location);

  // Appending 2nd section
  details.appendChild(firstDiv);
  details.appendChild(secondDiv);
  details.appendChild(thirdDiv);

  // 3rd section
  let tags = document.createElement("div");
  tags.classList.add("company-tags");
  if (item.role.length > 0) {
    let arr = document.createElement("div");
    arr.textContent += item.role;
    tags.appendChild(arr);
  }
  if (item.level.length > 0) {
    let arr = document.createElement("div");
    arr.textContent += item.role;
    tags.appendChild(arr);
  }
  if (item.languages.length > 0) {
    item.languages.forEach((e) => {
      let arr = document.createElement("div");
      arr.textContent += e;
      tags.appendChild(arr);
    });
  }
  if (item.tools.length > 0) {
    item.tools.forEach((e) => {
      let arr = document.createElement("div");
      arr.textContent += e;
      tags.appendChild(arr);
    });
  }

  // Final merge of HTML elements
  section.appendChild(imagePart);
  section.appendChild(details);
  section.appendChild(tags);

  return section;
}
