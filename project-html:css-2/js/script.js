let burger = document.getElementById("burger"),
    navigation = document.getElementById("navigation");

burger.addEventListener("click", function(){

    // При клике добавляется/удаляется класс к меню
    navigation.classList.toggle("open");

    // При клике добавляется/удаляется к бургеру класс
    burger.classList.toggle("burger-opened");
});
