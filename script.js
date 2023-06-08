import conditions from './conditions.js';
console.log(conditions);

const apiKey = 'd5e0185c9d4142c1ac4101351230606'

const header = document.querySelector('.header');

const form = document.querySelector('#form');

const input = document.querySelector('#inputCity');


 //Удаляем предыдущию карточку
function removeCard(){
 const prevCard = document.querySelector('.card');
 if(prevCard) prevCard.remove();
}

//карточка с ошибкой
function showError(errorMessage){
    const html = `<div class="card">${errorMessage}</div>`;
    header.insertAdjacentHTML('afterend',html);
}

function showCard({name , country , temp , condition ,wind , humidity , uv , pressure, imgPath}){
    //разметка для карточки 
const html = `<div class="card">
<h2 class="card-city">${name} <span>${country}</span></h2>

<div class="card-weather">
<div class="card-value">${temp}<sup>°c</sup></div>
<img class="card-img" src="${imgPath}" alt="Weather">
<div class="card-description">${condition}</div>
</div>
<div class="iconki">

<figure class = "iconki1">
<img src="./3d weather icons/wind.png" width="40" height="40"alt="Weather">
<figcaption>Скорость ветра</figcaption>
<h3 class="sotnya1">${wind}</h3>
</figure>

<figure class = "iconki2">
<img src="./3d weather icons/humidity.png" width="40" height="40"alt="Weather">
<figcaption>влажность</figcaption>
<h4 class="sotnya2">${humidity}</h4>
</figure>

<figure class = "iconki3">
<img src="./3d weather icons/uv-index.png" width="40" height="40"alt="Weather">
<figcaption>УФ-индекс</figcaption>
<h5 class="sotnya3">${uv}</h5>
</figure>


<figure class = "iconki5">
<img src="./3d weather icons/gauge.png" width="40" height="40"alt="Weather">
<figcaption>давление</figcaption>
<h7 class="sotnya5">${pressure}</h7>
</figure>


</div>
</div>`
//отображаем карточку на странице  

header.insertAdjacentHTML('afterend',html);
}

async function getWeather(city) {
    //Адрес запроса
const url=`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
const responce = await fetch(url);
const data = await responce.json();
console.log(data);
return data;
}

//слушаем отправку формы

form.onsubmit = async function (e) {
    //Отменяем отправку
    e.preventDefault ();

    //Берем значение из input, обрезаем пробелы
    let city = input.value.trim();
    
    
    
    //Получаем данные с сервера
    const data = await getWeather(city);


    if (data.error){
        removeCard();
        showError(data.error.message);
    } else {
        removeCard();
        
        console.log(data.current.condition.code);

        const info = conditions.find((obj) => obj.code === data.current.condition.code)
        console.log(info);
        console.log(info.languages[23] ['day_text']);
        
        const filePath = './3d weather icons/' + (data.current.is_day ? 'day' : 'night') + '/';

        const fileName = (data.current.is_day ? info.day : info.night) + '.png';

        const imgPath = filePath + fileName;

        console.log('filePath', filePath + fileName);

        const WeatherData = {
            name: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            condition: data.current.is_day
             ?info.languages[23] ['day_text']
             :info.languages[23] ['night_text'],
            wind: data.current.wind_kph,
            humidity: data.current.humidity,
            uv: data.current.uv,
            pressure: data.current.pressure_mb,
            imgPath,
        };


        showCard(WeatherData);    
    }
}
