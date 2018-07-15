const newPower = document.querySelector('.btn-power');

function beautifyJSON(data) {
  return JSON.stringify(data).replace(/[[\]'"]+/g, '');
}

newPower.addEventListener('click', () => {
  const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
  const randomUrl = `${corsAnywhere}https://powerlisting.wikia.com/api.php?action=query&generator=random&grnnamespace=0&format=json&callback=?`;

  // generate a random article ID
  fetch(randomUrl)
    .then(response => response.text())
    .then((textResponse) => {
      const text = textResponse.replace('/**/', '').replace(/\(|\)/g, "");
      return JSON.parse(text);
    })
    .then((json) => {
      const randomId = beautifyJSON(Object.keys(json.query.pages));
      const articleAPIUrl = `${corsAnywhere}https://powerlisting.wikia.com/api/v1/Articles/Details/?abstract=300&width=200&height=200&ids=${randomId}`;

      // request random article JSON
      fetch(articleAPIUrl)
        .then(response => response.json())
        .then((json) => {
          const article = json.items[randomId];

          const articleData = {
            title: beautifyJSON(article.title),
            thumb: beautifyJSON(article.thumbnail),
            intro: beautifyJSON(article.abstract),
            url: `https://powerlisting.wikia.com${beautifyJSON(article.url)}`
          }

          const APIContentContainer = document.querySelector('.API-content');
          const APIContent = `<h2 class="result-title"><em>${articleData.title}</h2></em>
           <br>
           <img src="${articleData.thumb}" class="result-img"></img>
           <br>
           <br>
           ${articleData.intro}
           <br>
           <a href="${articleData.url}" target="_blank" class="btn btn-readmore">Click here to read more</a>`;

          APIContentContainer.innerHTML = '';
          APIContentContainer.innerHTML += APIContent;
        });
    })
    .catch(err => console.error(`Error: ${err}`));
});
