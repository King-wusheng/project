import homeTpl from "../views/home.html"
const render = ()=>{
    document.querySelector(".all").innerHTML = homeTpl
}
export default{
    render
}