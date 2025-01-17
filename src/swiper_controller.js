// app/javascript/controllers/swiper_controller.js
import { Controller } from '@hotwired/stimulus';
import Swiper from 'swiper/bundle';

export default class extends Controller {
  connect() {
    this.swiper = new Swiper('.swiper-container', {
        centeredSlides:!0,
        loop:!0,
        hashNavigation:{watchState:!0},
        pagination:{
          el:".swiper-pagination",
          clickable:!0
        },
        autoplay:{
          delay:5500,
          disableOnInteraction:!1
        }
      });

      const carouselEl = document.querySelectorAll('.carousel');
      if (carouselEl.length > 0) {
        const carousel = new Swiper('.carousel', {
          slidesPerView: 'auto',
          grabCursor: true,
          loop: false,
          centeredSlides: false,
          initialSlide: 0,
          spaceBetween: 24,
          watchSlidesProgress: true,
          navigation: {
            nextEl: '.carousel-next',
            prevEl: '.carousel-prev',
          },
        });
      }
    
  }
}
