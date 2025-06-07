document.addEventListener('DOMContentLoaded', () => {
  // 1) 추천 도서를 보여줄 컨테이너 선택
  const recContainer = document.querySelector('.recommend-list');
  if (!recContainer) {
    console.error('❌ .recommend-list를 찾을 수 없습니다.');
    return;
  }

  // 2) 백엔드 엑셀 기반 엔드포인트 호출
  fetch('https://ai-project-delta-seven.vercel.app/api/server/recommendations')
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
          <img src="https://ai-project-delta-seven.vercel.app/images/${book[IMAGE_KEY].trim()}" alt="${book[TITLE_KEY]} 표지" />
          <h3>${book[TITLE_KEY]}</h3>
          <p class="author">${book[AUTHOR_KEY]}</p>
          
        `;
        recContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      recContainer.innerHTML = '<p>추천 도서를 불러올 수 없습니다.</p>';
    });
 
});