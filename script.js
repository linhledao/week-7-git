const select = document.getElementById("country");
const loader = document.getElementById("loader");

select.addEventListener('change', async function(){
  const countryName = this.value;
  if(!countryName) return;
  
  document.querySelectorAll("#mytable td").forEach(td => td.textContent = " " );
  document.getElementById("flag").innerHTML ="";
  
  loader.style.display="block";
  try{
    const countryRes= await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const countryData = await countryRes.json();
    const c = countryData[0];
    
    
    const name = c.name.common;
    const official = c.name.official;
    const capital= c.capital?.[0] || "N/A";
    const language = Object.values(c.languages || {})[0] || "N/A";
    const population = c.population.toLocaleString();
    const map = c.maps.googleMaps;
    const flag = c.flags.svg;
    const [lat, lon] = c.capitalInfo?.latlng || c.latlng;
    
    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain&forecast_days=1`
      );
    const weatherData = await weatherRes.json();
    
    const temps = weatherData.hourly.temperature_2m;
    const rains = weatherData.hourly.rain;
    const avgTemp = (temps.reduce((a,b) => a+b,0) / temps.length).toFixed(2);
    const totalRain = rains.reduce((a,b) => a+b,0).toFixed(2);
    
  document.getElementById('name').textContent = name;
      document.getElementById('officialname').textContent = official;
      document.getElementById('capital').textContent = capital;
      document.getElementById('language').textContent = language;
      document.getElementById('maplink').innerHTML = `<a href="${map}" target="_blank">View Map</a>`;
      document.getElementById('population').textContent = population;
      document.getElementById('flag').innerHTML = `<img src="${flag}" alt="flag" width="60">`;
      document.getElementById('latitude').textContent = `${lat}, ${lon}`;
      document.getElementById('rain').textContent = `${totalRain} mm`;
      document.getElementById('temp').textContent = `${avgTemp} °C`;
  }
  catch (error){
    console.error("Error:", error);
    alert("Could not load data.");
  }
  finally{
    loader.style.display="none";
  }
});

