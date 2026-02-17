function calculateAge(){
    const date = new Date();

    const resultYear = document.querySelector("#result-year");
    const resultMonth = document.querySelector("#result-month");
    const resultDay = document.querySelector("#result-day");
    const resultAge = document.querySelector("#result-age");


    let currentYear = date.getFullYear();
    let currentMonth = date.getMonth();
    let currentDay = date.getDate();

    let birthYear = document.querySelector("#year").value;
    let birthMonth = document.querySelector("#month").value;
    let birthDay = document.querySelector("#date").value;

    if(birthDay=="" || birthMonth=="" || birthYear=="")
    {
        alert("Please enter all the fields");
        return;
    }

    let ageYear = currentYear - birthYear;
    let ageMonth = currentMonth - birthMonth+1;
    let ageDay = currentDay - birthDay;
    if(ageMonth<0)
    {
        ageYear--;
        ageMonth += 12;
    }
    if(ageDay<0)
    {
        ageMonth--;
        ageDay += 30;
    }
    resultAge.textContent = "Age";
    resultYear.textContent = ageYear+" Years";
    resultMonth.textContent = ageMonth+" Months";
    resultDay.textContent = ageDay+" Days";
}