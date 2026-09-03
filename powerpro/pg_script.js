(function(){
  const track = document.getElementById('carouselTrack');
  const wrapper = document.getElementById('carouselWrapper');
  const prevBtn = document.getElementById('btnPrev');
  const nextBtn = document.getElementById('btnNext');

  let index = 0;
  const gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 30;

  function calc() {
    const cards = track.querySelectorAll('.card');
    const card = cards[0];
    if(!card) return {cards:0, cardWidth:0, cardsPerView:0, maxIndex:0};

    const cardWidth = card.getBoundingClientRect().width;
    const wrapperWidth = wrapper.getBoundingClientRect().width;
    const cardsPerView = Math.max(1, Math.floor((wrapperWidth + gap) / (cardWidth + gap)));
    const totalCards = cards.length;
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    return { totalCards, cardWidth, cardsPerView, maxIndex };
  }

  function updateButtonsState(maxIndex) {
    if(window.matchMedia('(max-width: 768px)').matches) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      document.querySelector('.nav-buttons').style.display = 'none';
      track.style.transform = '';
      return;
    } else {
      document.querySelector('.nav-buttons').style.display = '';
    }
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= maxIndex;
  }

  function moveToIndex(i, cardWidth) {
    track.style.transform = `translateX(${ - Math.round(i * (cardWidth + gap)) }px)`;
  }

  let { totalCards, cardWidth, cardsPerView, maxIndex } = calc();
  updateButtonsState(maxIndex);
  moveToIndex(index, cardWidth);

  nextBtn.addEventListener('click', () => {
    const info = calc();
    maxIndex = info.maxIndex;
    cardWidth = info.cardWidth;
    if (index < maxIndex) {
      index++;
      moveToIndex(index, cardWidth);
    }
    updateButtonsState(maxIndex);
  });

  prevBtn.addEventListener('click', () => {
    const info = calc();
    cardWidth = info.cardWidth;
    maxIndex = info.maxIndex;
    if (index > 0) {
      index--;
      moveToIndex(index, cardWidth);
    }
    updateButtonsState(maxIndex);
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const info = calc();
      totalCards = info.totalCards;
      cardWidth = info.cardWidth;
      cardsPerView = info.cardsPerView;
      maxIndex = info.maxIndex;
      if(index > maxIndex) index = maxIndex;
      moveToIndex(index, cardWidth);
      updateButtonsState(maxIndex);
    }, 80);
  });

  const mq = window.matchMedia('(max-width: 768px)');
  function mqHandler(e){
    const info = calc();
    maxIndex = info.maxIndex;
    cardWidth = info.cardWidth;
    if(e.matches) {
      track.style.transform = '';
      document.querySelector('.nav-buttons').style.display = 'none';
    } else {
      document.querySelector('.nav-buttons').style.display = '';
      if(index > maxIndex) index = maxIndex;
      moveToIndex(index, cardWidth);
    }
    updateButtonsState(maxIndex);
  }
  mq.addEventListener ? mq.addEventListener('change', mqHandler) : mq.addListener(mqHandler);
  mqHandler(mq);
})();