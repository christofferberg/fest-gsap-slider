import { TimelineMax, TweenMax } from "gsap";
import { data } from "./imageData";

let activeIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.querySelector(".next-item");
  nextButton.addEventListener("click", nextItem);
  populateInitialData();
});

const populateInitialData = () => {
  const images = document.querySelectorAll(".item__image");
  const buttonImages = document.querySelectorAll(".preview__image");
  const titles = document.querySelectorAll(".item__title-text");
  const nextTitles = document.querySelectorAll(".next-item__title-text");

  // Images
  images[0].src = `${data[activeIndex].image}`;
  images[1].src = `${data[getNextIndex()].image}`;

  // Button images
  buttonImages[0].src = `${data[getNextIndex()].thumb}`;
  buttonImages[1].src = `${data[getNextIndex(1)].thumb}`;

  // Button titles
  nextTitles[0].innerHTML = data[getNextIndex()].nextTitle;
  nextTitles[1].innerHTML = data[getNextIndex(1)].nextTitle;

  // Big image titles
  titles[0].innerHTML = data[activeIndex].title;
  titles[1].innerHTML = data[getNextIndex()].title;
};

const titleAnimation = new TimelineMax({ paused: true })
  .to(".item__title-wrapper", 0.8, { ease: Power2.easeOut, yPercent: -50 }, 0)
  .to(".item__title-text--first", 0.5, { opacity: 0 }, 0)
  .to(".item__title-text--next", 0.5, { opacity: 1 }, 0)

  .eventCallback("onComplete", () => {
    titleAnimation.progress(0).pause();

    const titles = document.querySelectorAll(".item__title-text");
    titles[0].innerHTML = data[activeIndex].title;
    titles[1].innerHTML = data[getNextIndex()].title;
  });

const imageAnimation = new TimelineMax({ paused: true })
  .to(".item__image--first", 0.8, { ease: Power2.easeOut, opacity: 0 }, 0)
  .fromTo(
    ".item__image--next",
    0.8,
    { ease: Power2.easeOut, opacity: 0, scale: 1.35 },
    { ease: Power2.easeOut, opacity: 1, scale: 1 },
    0
  )
  .eventCallback("onComplete", () => {
    imageAnimation.progress(0).pause();

    const images = document.querySelectorAll(".item__image");
    images[0].src = data[activeIndex].image;
    images[1].src = data[getNextIndex()].image;
  });

const previewAnimation = new TimelineMax({ paused: true })
  .to(".next-item__content", 0.5, { ease: Sine.easeOut, x: 150 })
  .to(".next-item__content", 0.5, { ease: Sine.easeOut, x: 0 }, "sliderClosed+=0.15")
  .to(".preview__image--first", 0.8, { ease: Power2.easeOut, xPercent: 25 }, 0)
  .fromTo(
    ".preview__image--next",
    0.6,
    { ease: Sine.easeOut, xPercent: 100 },
    { ease: Sine.easeOut, xPercent: 0 },
    "sliderClosed+=0.05"
  )
  .to(".next-item__title-text--first", 0.4, { opacity: 0 }, "sliderClosed+=0.15")
  .fromTo(".next-item__title-text--next", 0.5, { opacity: 0 }, { opacity: 1 }, "sliderClosed+=0.15")
  .eventCallback("onComplete", () => {
    previewAnimation.progress(0).pause();

    const nextTitles = document.querySelectorAll(".next-item__title-text");
    nextTitles[0].innerHTML = data[activeIndex].nextTitle;
    nextTitles[1].innerHTML = data[getNextIndex()].nextTitle;

    const images = document.querySelectorAll(".preview__image");
    images[0].src = data[getNextIndex()].thumb;
    images[1].src = data[getNextIndex(1)].thumb;
  });

const nextItem = () => {
  console.log("next item clicked");

  if (!titleAnimation.isActive() && !imageAnimation.isActive() && !previewAnimation.isActive()) {
    activeIndex = getNextIndex();
    titleAnimation.play();
    imageAnimation.play();
    previewAnimation.play();
  }
};

// Helpers
const getNextIndex = (skipSteps = 0) => {
  const incrementIndex = () => {
    if (newIndex >= data.length - 1) {
      newIndex = 0;
    } else {
      newIndex = newIndex + 1;
    }
  };

  let newIndex = activeIndex;
  incrementIndex();

  for (let i = 0; i < skipSteps; i++) {
    incrementIndex();
  }

  return newIndex;
};
