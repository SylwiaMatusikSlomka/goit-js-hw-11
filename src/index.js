import * as api from "./pixabay-api.js";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import * as _ from "lodash";

const serchBtn = document.querySelector('button[type="submit"]');
const loadMoreBtn = document.querySelector('.load-more');
const input = document.querySelector('input[type="text"]');
const galerry = document.querySelector('.gallery');
let page = 1;
const per_page = 40;
let simpleLightbox = null;

serchBtn.addEventListener('click', ev => {
    ev.preventDefault();
    galerry.innerHTML = "";

    const searchVal = input.value;
    console.log(searchVal);
    page = 1;
    api.downloadContents(searchVal, page, per_page).then(data =>{
        console.log(data);
        const cardInfo = data.data.data.hits;
        if (data.error !== null || cardInfo.length === 0 || data.data.status !== 200){
            Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        }else{
            let tmp = "";
            console.log(cardInfo);
            cardInfo.forEach(element => {
                tmp += generateCard(element);
            });
            galerry.innerHTML += tmp;
            Notiflix.Notify.success(`Hooray! We found ${data.data.data.totalHits} images.`);
            simpleLightbox = new SimpleLightbox('.gallery a', { 
                captionDelay: 250,
                captionsData: 'alt',
            });
            smoothScroll();
        }
    });
});

window.addEventListener('scroll', _.throttle(() => {
    var windowHeight = window.innerHeight;
    var fullHeight = document.body.scrollHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    var scrolled = (scrollY + windowHeight) / fullHeight * 100;

    if (scrolled >= 80) {
        const searchVal = input.value;
        console.log(searchVal);
        page++;
        api.downloadContents(searchVal, page, per_page).then(data =>{
            console.log(data);
            const cardInfo = data.data.data.hits;
            if (data.error !== null || cardInfo.length === 0 || data.data.status !== 200){
                Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results`);
            }else{
                let tmp = "";
                console.log(cardInfo);
                cardInfo.forEach(element => {
                    tmp += generateCard(element);
                });
                galerry.innerHTML += tmp;
                simpleLightbox.refresh();
                smoothScroll();
            }
        });
    }
  }, 500));

function generateCard(data){
    const urlWeb = data.webformatURL;
    const urlLg = data.largeImageURL;
    const likes = data.likes;
    const views = data.views;
    const comments = data.comments;
    const downloads = data.downloads;
    const tags = data.tags;
    let card = 
    `
    <div class="card-info card text-bg-warning border-primary h-100 shadow">
        <a href="${urlLg}"><img src="${urlWeb}" class="card-img-top" alt="${tags}" loading="lazy"></a>
        <div class="card-body d-flex flex-row justify-content-evenly flex-wrap">
            <div class="info-item d-flex flex-column align-items-center">
                <h5 class="card-title">Likes</h5>
                <p class="card-text">${likes}</p>
            </div>
            <div class="info-item d-flex flex-column align-items-center">
                <h5 class="card-title">Views</h5>
                <p class="card-text">${views}</p>
            </div>
            <div class="info-item d-flex flex-column align-items-center">
                <h5 class="card-title">Comments</h5>
                <p class="card-text">${comments}</p>
            </div>
            <div class="info-item d-flex flex-column align-items-center">
                <h5 class="card-title">Downloads</h5>
                <p class="card-text">${downloads}</p>
            </div>
        </div>
    </div>
    `;
    return card;
}

function smoothScroll() {
    window.scrollBy({
        top: 100,
        behavior: "smooth",
    });
}

