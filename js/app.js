document.addEventListener('DOMContentLoaded', () => {
  // 목표 설정 기능
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
  });
});