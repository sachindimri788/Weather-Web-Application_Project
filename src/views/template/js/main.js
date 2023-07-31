const submitBtn = document.getElementById('submitBtn');
const cityName=document.getElementById('cityName');

const city_name=document.getElementById('city_name');

const temp_real_val=document.getElementById('temp_real_val');

const temp_status=document.getElementById('temp_status');

const datahide=document.querySelector('.middle_layer');

const getIntfo=async(event)=>{
    event.preventDefault();       //no refresh after using this line
    let cityVal=cityName.value;

    if(cityVal===""){
        city_name.innerText=`Plz write the name before search`;
        datahide.classList.add('data_hide');
    }
    
    else{
        try{
            let url=`https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=4966c5265ccf1089aa2f9fb47dd5f093`
            const response = await fetch(url);
            
            const data=await response.json(); //for converting the data from jason to javascript object
            console.log(data); //browser console 

            const arrData=[data];
           
            city_name.innerText=`${arrData[0].name}, ${arrData[0].sys.country}`;
            temp_real_val.innerText=arrData[0].main.temp;
           // temp_status.innerText=arrData[0].weather[0].main;

            const tempMood=arrData[0].weather[0].main;
            //condition to check if sunny then image 
            if(tempMood=="Clear"){
                temp_status.innerHTML="<i class='fas fa-sun' style='color: #eccc68';> </i>";
            }

            else if(tempMood=="Clouds"){
                temp_status.innerHTML="<i class='fas fa-cloud' style='color: #f1f2f6';> </i>";
            }
            else if(tempMood=="Rain"){
                temp_status.innerHTML="<i class='fas fa-rain' style='color: #a4b0be';> </i>";
            }
            else {
                temp_status.innerHTML="<i class='fas fa-sun' style='color: #f1f2f6';> </i>";
            }            
            datahide.classList.remove('data_hide');
        }
        catch{
            city_name.innerText=`Plz enter the city name properly`;
            datahide.classList.add('data_hide');
        }
    }
}

submitBtn.addEventListener('click',getIntfo);