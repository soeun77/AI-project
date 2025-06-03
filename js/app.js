//document.addEventListener('DOMContentLoaded', () => {
/*const recommendBtn = document.querySelector('.explore-btn');
  recommendBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:3000/recommend');
      if (!response.ok) throw new Error('서버 응답 오류');
      const book = await response.json();
      // 받아온 JSON(book.id, book.title, book.author)을 활용해
      // 서브페이지(1) DOM에 해당 정보를 렌더링. 예시:
      const container = document.querySelector('.most-recommended-card');
      container.innerHTML = `
        <img src="images/book_${book.id}.jpg" alt="${book.title} 표지" class="most-book-img" />
        <div class="most-book-info">
          <h2 class="most-book-title">${book.title}</h2>
          <p class="most-book-author">${book.author}</p>
        </div>
      `;
    } catch (err) {
      console.error(err);
    }
  });
  */
// js/app.js (예시)

/*document.addEventListener('DOMContentLoaded', () => {
  const recContainer = document.querySelector('.recommend-list');

  // 페이지 로드 시 또는 버튼 클릭 시 추천 데이터 가져오기
  fetch('http://localhost:3000/api/recommendations')
    .then(res => {
      if (!res.ok) throw new Error('추천 데이터를 불러오지 못했습니다.');
      return res.json();
    })
    
    .then(data => {
      const book = data.recommendations; // Excel에서 읽어온 3개 책 객체
      recContainer.innerHTML = '';        // 기존 내용 비우기

      books.forEach(book => {
        // 엑셀 컬럼명이 “제목”과 “저자”라면 밑처럼 book.제목, book.저자 형태로 사용
        // 영어 헤더(예: “title”, “author”)로 엑셀 첫 행이 구성되었다면 book.title, book.author 등으로 사용
        const TITLE_KEY = '제목';   // 엑셀에서 변환된 JSON 키가 “제목”이라면
        const AUTHOR_KEY = '저자';
        const IMAGE_KEY = '이미지 파일명';

        // 5) 받아온 책 배열을 순회하며 카드 생성
      books.forEach((book, index) => {
        // 동적으로 div.recommend-card 생성
        const card = document.createElement('div');
        card.className = 'recommend-card';

        // 내부 HTML 구조: <img> + <h3>제목</h3> + <p class="author">저자</p> + <button> 등
        card.innerHTML = `
          <img src="images/${book[IMAGE_KEY]}" alt="${book[TITLE_KEY]} 표지" />
          <h3>${index + 1}위: ${book[TITLE_KEY]}</h3>
          <p class="author">${book[AUTHOR_KEY]}</p>
          <button class="card-nav prev">&larr;</button>
        `;

        recContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      recContainer.innerHTML = '<p>추천 도서를 불러올 수 없습니다.</p>';
    }); */

  document.addEventListener('DOMContentLoaded', () => {
  // 1) 추천 도서를 보여줄 컨테이너 선택
  const recContainer = document.querySelector('.recommend-list');
  if (!recContainer) {
    console.error('❌ .recommend-list를 찾을 수 없습니다.');
    return;
  }

  // 2) 백엔드 엑셀 기반 엔드포인트 호출
  fetch('http://localhost:3000/api/recommendations')
    .then(res => {
      if (!res.ok) throw new Error('추천 도서 데이터를 불러오지 못했습니다.');
      return res.json();
    })
    .then(json => {
      if (!json.success) throw new Error('서버에서 올바른 응답을 받지 못했습니다.');

      const books = json.recommendations; 
      if (!Array.isArray(books) || books.length === 0) {
        recContainer.innerHTML = '<p>추천 도서가 없습니다.</p>';
        return;
      }
      

      // ↓ 여기서 반드시 "이미지 파일명" (공백 포함) 으로 맞춰야 함 ↓
      const TITLE_KEY  = '제목';
      const AUTHOR_KEY = '저자';
      const IMAGE_KEY  = '이미지 파일명';  // <-- 공백 포함
      
      recContainer.innerHTML = '';

      books.forEach((book, index) => {
        // 디버깅: book[IMAGE_KEY]가 실제로 무엇인지 찍어보기
        console.log(`[RECOMMEND][${index}]`, book);

        // 만약 IMAGE_KEY가 틀리거나 값이 undefined라면 콘솔에서 undefined로 찍힙니다.
        // → 콘솔을 보고 IMAGE_KEY 값을 실제 JSON 프로퍼티 이름과 100% 일치시켜야 합니다.
        console.log('▶ IMAGE 파일명:', book[IMAGE_KEY]);

        const card = document.createElement('div');
        card.className = 'recommend-card';
        card.innerHTML = `
          <img src="images/${book[IMAGE_KEY]}" alt="${book[TITLE_KEY]} 표지" />
          <h3>${index + 1}위: ${book[TITLE_KEY]}</h3>
          <p class="author">${book[AUTHOR_KEY]} || ''}</p>
          <button class="card-nav prev">&larr;</button>
        `;
        recContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      recContainer.innerHTML = '<p>추천 도서를 불러올 수 없습니다.</p>';
    });
      
  /* // 목표 설정 기능
  const goalForm = document.getElementById('goal-form');
  const goalInput = document.getElementById('goal-input');
  const goalMessage = document.getElementById('goal-message');

  goalForm.addEventListener('submit', e => {
    e.preventDefault();
    const goal = goalInput.value;
    goalMessage.textContent = `이번 달 독서 목표는 ${goal}권입니다. 화이팅!`;
    goalForm.reset();
  });

  // 추천 도서 예시 데이터
  const books = [
    { title: '성공하는 사람들의 7가지 습관', cover: 'https://via.placeholder.com/150x200' },
    { title: '에이트', cover: 'https://via.placeholder.com/150x200' },
    { title: '미움받을 용기', cover: 'https://via.placeholder.com/150x200' }
  ];
  const bookList = document.getElementById('book-list');
  books.forEach(book => {
    const article = document.createElement('article');
    article.className = 'book-item';
    article.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" />
      <h4>${book.title}</h4>
    `;
    bookList.appendChild(article);
  }); */
});