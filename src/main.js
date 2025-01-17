import * as Turbo from "@hotwired/turbo"
import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import { Application } from "@hotwired/stimulus"
import MenuController from "./menu_controller"
import ViewImagesController from "./view_images_controller"
import NavtreeController from "./navtree_controller"
import ThemeController from "./theme_controller"

// SwiperController没有成功加载，直接在 main.js中定义swiper
//import SwiperController from "./swiper_controller"
import Swiper from 'swiper/bundle'

import AOS from 'aos'
import Dropdown from 'stimulus-dropdown'

window.Alpine = Alpine
Alpine.plugin(collapse)
Alpine.start()

const application = Application.start()
window.Stimulus = application
application.register('menu', MenuController)
application.register('view_images', ViewImagesController)
application.register('navtree', NavtreeController)
application.register('theme', ThemeController)
application.register('dropdown', Dropdown)
//application.register('swiper', SwiperController)


//xiaohui: 下面的方法实现 AOS 能够在每个页面加载时候都生效
Turbo.start()

AOS_options = { duration: 1200, disableMutationObserver: true }

document.addEventListener('DOMContentLoaded', () => {
    AOS.init(AOS_options)
    AOS_options.easing = document.querySelector('body').getAttribute('data-aos-easing')
    AOS_options.duration = document.querySelector('body').getAttribute('data-aos-duration')
    AOS_options.delay = document.querySelector('body').getAttribute('data-aos-delay')
})

document.addEventListener("turbo:load", () => {
    document.querySelector('body').setAttribute('data-aos-easing', AOS_options.easing);
    document.querySelector('body').setAttribute('data-aos-duration', AOS_options.duration);
    document.querySelector('body').setAttribute('data-aos-delay', AOS_options.delay);
    AOS.refreshHard()
})

//加载 Other Action 
document.addEventListener("turbo:load", () => {
    
})


// themes
// Cards spotlight
class Spotlight {
    constructor(containerElement) {
        this.container = containerElement
        this.cards = Array.from(this.container.children)
        this.mouse = {
            x: 0,
            y: 0,
        }
        this.containerSize = {
            w: 0,
            h: 0,
        }
        this.initContainer = this.initContainer.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.init()
    }

    initContainer() {
        this.containerSize.w = this.container.offsetWidth
        this.containerSize.h = this.container.offsetHeight
    }

    onMouseMove(event) {
        const { clientX, clientY } = event
        const rect = this.container.getBoundingClientRect()
        const { w, h } = this.containerSize
        const x = clientX - rect.left
        const y = clientY - rect.top
        const inside = x < w && x > 0 && y < h && y > 0
        if (inside) {
            this.mouse.x = x
            this.mouse.y = y
            this.cards.forEach((card) => {
                const cardX = -(card.getBoundingClientRect().left - rect.left) + this.mouse.x
                const cardY = -(card.getBoundingClientRect().top - rect.top) + this.mouse.y
                card.style.setProperty('--mouse-x', `${cardX}px`)
                card.style.setProperty('--mouse-y', `${cardY}px`)
            })
        }
    }

    init() {
        this.initContainer()
        window.addEventListener('resize', this.initContainer)
        window.addEventListener('mousemove', this.onMouseMove)
    }
}

// Init Spotlight
const spotlights = document.querySelectorAll('[data-spotlight]')

window.addEventListener('load', () => {
    spotlights.forEach((spotlight) => {
        new Spotlight(spotlight)
    })
})

// Masonry layout
const masonryLayout = (parent) => {
    const childElements = Array.from(parent.children)
    const gapSize = parseInt(window.getComputedStyle(parent).getPropertyValue('grid-row-gap'))

    childElements.forEach((el) => {
        let previous = el.previousSibling
        while (previous) {
            if (previous.nodeType === 1) {
                el.style.marginTop = 0
                if (elementLeft(previous) === elementLeft(el)) {
                    el.style.marginTop = -(elementTop(el) - elementBottom(previous) - gapSize) + 'px'
                    break
                }
            }
            previous = previous.previousSibling
        }
    })
}

const elementLeft = (el) => {
    return el.getBoundingClientRect().left
}

const elementTop = (el) => {
    return el.getBoundingClientRect().top + window.scrollY
}

const elementBottom = (el) => {
    return el.getBoundingClientRect().bottom + window.scrollY
}

const masonryElements = document.querySelectorAll('[data-masonry]')

masonryElements.forEach(masonryLayout)

window.addEventListener('load', () => {
    masonryElements.forEach(masonryLayout)
})

window.addEventListener('resize', () => {
    masonryElements.forEach(masonryLayout)
})
