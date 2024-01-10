// Making text appear an disappear when marker of geyser is clicked

document.addEventListener('mouseover', function(event) {
  var elementsToHide = document.querySelectorAll(".Text");
            elementsToHide.forEach(function(element) {
                element.style.display = "none";
            });

  const Text = document.getElementById('PredictableText');
  Text.style.top = (event.clientY + window.scrollY) + 'px';
  Text.style.left = (event.clientX + window.scrollX) + 'px';
  
  if (event.target.classList.contains('PredictableMarker')) { 
    var circleId = event.target.id;
    getLink(circleId)
        .then(result => {
            return LastEruption(circleId, result);
        })
        .then(() => getPredictionLink(circleId))
        .then(link => {
          return PredictionEruption(link);
        })
        .then(() => {
            // Toggle the visibility of the text element
            ToggleVisibility();
        });
  }

  else if (event.target.classList.contains('PredictableLabel')) {
    var circleId = event.target.id.replace(' Label', '');
    getLink(circleId)
        .then(result => {
            return LastEruption(circleId, result);
        })
        .then(() => getPredictionLink(circleId))
        .then(link => {
          return PredictionEruption(link);
        })
        .then(() => {
            // Toggle the visibility of the text element
            ToggleVisibility();
        });
  }

  else if (event.target.classList.contains('GeyserMarker')) { 
    var circleId = event.target.id;
    getLink(circleId)
    .then(result => {
      return LastEruption(circleId, result);
    })
    .then(() => {
        ToggleVisibility();
    });
}
  else if (event.target.classList.contains('GeyserLabel')) {
      var circleId = event.target.id.replace(' Geyser Label', '');
      new Promise(function(resolve) {
          resolve(getLink(circleId))
      }).then(function(result) {
          return LastEruption(circleId, result)
      }).then(function() {
          ToggleVisibility();
      })
  }
});

//Generate link to request geyser info through API
function getLink(circleID){
  return fetch('https://www.geysertimes.org/api/v5/geysers')
  .then(res => res.json())
  .then(data => {
    const entry = data.geysers.find(entry => circleID == entry.name);
    if (entry){
      return 'https://www.geysertimes.org/api/v5/entries_latest/' + entry.id;
    } 
  });
};

function getPredictionLink(circleID){
  return fetch('https://www.geysertimes.org/api/v5/geysers')
  .then(res => res.json())
  .then(data => {
    const entry = data.geysers.find(entry => circleID == entry.name);
    if (entry){
      return 'https://www.geysertimes.org/api/v5/predictions_latest/' + entry.id;
    } 
  });
};
//Fetching and printing last geyser eruption
async function LastEruption(circleID, link){
    const response = await fetch(link)
    const jsonResp = await response.json()

    const entry = jsonResp.entries[0];
    const eruptionTime = entry.time;
    const date = new Date(eruptionTime * 1000);
    const timeFormatting = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
        hour12: true
    };
    // Convert the date to a string in the specified time zone
    const formattedDate = date.toLocaleString('en-US', timeFormatting);
    const targetDiv = document.getElementById('PredictableText');
    const targetHeader = targetDiv.querySelector('H3');
    targetHeader.innerHTML = `${circleID} Geyser`;
    const targetParagraph = targetDiv.querySelector('p');
    targetParagraph.innerHTML = `Last eruption: ${formattedDate}`;
    const target = document.getElementById('PredictableText');
    const targetP = target.querySelector('#Prediction');
    targetP.innerHTML = ``;
};

  function PredictionEruption(link){
    fetch(link)
      .then(res => res.json())
      .then(data => {
        const entry = data.predictions[0];
        if (data.predictions.length === 0){
          const targetDiv = document.getElementById('PredictableText');
          const targetParagraph = targetDiv.querySelector('#Prediction');
          targetParagraph.innerHTML = `No current predictions`;
        }else{
          if (entry.userID == '44'){
            STime = entry.windowOpen;
            FTime = entry.windowClose;
          } else {
            const alternateEntry = data.predictions[1];
            STime = alternateEntry.windowOpen;
            FTime = alternateEntry.windowClose;
          };
          const start = new Date(STime * 1000);
          const finish = new Date(FTime * 1000);
          const timeFormatting = {
            month: 'short', 
            day: 'numeric',     
            year: 'numeric',     
            hour: '2-digit',     
            minute: '2-digit',   
            timeZoneName: 'short',  
            hour12: true  
          };
          // Convert the date to a string in the specified time zone
          const StartTime = start.toLocaleString('en-US', timeFormatting);
          const FinishTime = finish.toLocaleString('en-US', timeFormatting);
          const targetDiv = document.getElementById('PredictableText');
          const targetParagraph = targetDiv.querySelector('#Prediction');
          targetParagraph.innerHTML = `Next Eruption: from ${StartTime}<br>to ${FinishTime}`;
        }})
        
      .catch(error => {
        console.error('Error fetching data:', error);
                  const targetDiv = document.getElementById('PredictableText');
          const targetParagraph = targetDiv.querySelector('#Prediction');
          targetParagraph.innerHTML = `No current predictions`;
      });
    };

// Toggle the visibility of the text element
function ToggleVisibility(){
  var textElement = document.getElementById('PredictableText');
  textElement.style.display = (textElement.style.display === 'none' || textElement.style.display === '') ? 'block' : 'none';
};

//Open New Areas
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('Area')) { 
    const link = 'http://127.0.0.1:5500/' + event.target.id + '.html';
    window.location.href = link;
  };
      });
  