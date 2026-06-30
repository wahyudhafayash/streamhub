const handle = "@loncengelias";
fetch(`https://www.youtube.com/${handle}`).then(r => r.text()).then(html => {
  const scriptRegex = /var ytInitialData = (.*?);<\/script>/;
  const dataMatch = html.match(scriptRegex);
  if(dataMatch) {
    const data = JSON.parse(dataMatch[1]);
    const header = data?.header?.pageHeaderRenderer?.content?.pageHeaderViewModel;
    console.log(JSON.stringify(header));
  }
}).catch(console.error);
