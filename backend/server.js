// server.js
// ======================= 1) 모듈 로드 및 기본 설정 =======================
const express = require('express');
const cors = require('cors');
const path = require('path');
const XLSX = require('xlsx');  // 엑셀 읽기/파싱 라이브러리

const app = express();
const PORT = 3000;

// CORS 허용
app.use(cors());
// images 폴더를 정적(static)으로 공개
app.use('/images', express.static(path.join(__dirname, 'images')));

// JSON body 파싱 미들웨어 (필요 시)
app.use(express.json());

// 엑셀 파일 경로 (프로젝트 루트에 bestsellers.xlsx가 위치한다고 가정)
const EXCEL_PATH = path.join(__dirname, 'bestsellers.xlsx');


// ======================= 2) 엑셀 파일을 메모리로 로드 =======================
// 서버가 기동될 때 엑셀 파일을 읽어서 배열 형태로 변환하고, 메모리에 저장해 둡니다.
// 엑셀이 업데이트될 때마다 서버를 재시작하거나, 요청 시마다 다시 읽도록 수정할 수 있습니다.

// 2-1) 워크북(엑셀 파일 전체)을 읽어옵니다.
const workbook = XLSX.readFile(EXCEL_PATH);

// 2-2) 첫 번째 시트(worksheet) 이름을 가져옵니다.
const firstSheetName = workbook.SheetNames[0];

// 2-3) 첫 번째 시트를 JSON 배열로 변환합니다.
//       sheet_to_json: 각 행(Row)을 객체(Object)로 변환, 첫 행(헤더)을 키로 사용
const sheet = workbook.Sheets[firstSheetName];
const allBooks = XLSX.utils.sheet_to_json(sheet, { defval: '' });

// 만약 엑셀 셀에 값이 비어있을 때 (undefined 대신) 빈 문자열을 넣고 싶다면 { defval: '' } 옵션을 사용합니다.

// 예시로, 엑셀의 첫 번째 시트 구조가 아래와 같다고 가정합시다.
// ┌─────────┬───────────┬───────────┬───────────────┐
// │  제목    │   저자    │   출판사  │     isbn      │
// ├─────────┼───────────┼───────────┼───────────────┤
// │ 파리의 심리학 카페 │ 김철수   │ 교보출판사  │ 978-8-1234-5678 │
// │ 따박따박 경제상식  │ 이영희   │ 경제출판소 │ 978-8-2345-6789 │
// │ 구의 증명         │ 박지성   │ 소설서점  │ 978-8-3456-7890 │
// │ The Midnight Library │ Matt Haig │ 영문출판사 │ 978-0-3456-7891 │
// │ Project Hail Mary │ Andy Weir  │ SF출판사  │ 978-0-4567-8901 │
// │ The Alchemist     │ Paulo Coelho │ 고전출판사 │ 978-0-5678-9012 │
// └─────────┴───────────┴───────────┴───────────────┘
//
// 위처럼 header row(제목, 저자, 출판사, isbn)가 첫 번째 행에 있고,
// 그 아래에 값들이 채워져 있다고 가정합니다.

// 로드된 allBooks는 다음과 같은 배열 형태가 됩니다:
/*
[
  { 제목: '파리의 심리학 카페', 저자: '김철수', 출판사: '교보출판사', isbn: '978-8-1234-5678' },
  { 제목: '따박따박 경제상식',  저자: '이영희', 출판사: '경제출판소', isbn: '978-8-2345-6789' },
  { 제목: '구의 증명',        저자: '박지성', 출판사: '소설서점',   isbn: '978-8-3456-7890' },
  { 제목: 'The Midnight Library', 저자: 'Matt Haig', 출판사: '영문출판사', isbn: '978-0-3456-7891' },
  { 제목: 'Project Hail Mary', 저자: 'Andy Weir', 출판사: 'SF출판사',  isbn: '978-0-4567-8901' },
  { 제목: 'The Alchemist',     저자: 'Paulo Coelho', 출판사: '고전출판사', isbn: '978-0-5678-9012' }
]
*/

// ======================= 3) API 라우트 정의 =======================

/**
 * GET /api/books
 *   전체 베스트셀러 데이터를 리턴합니다.
 *   (프론트엔드에서 ‘전체 도서 보기’ 용도로 사용 가능)
 */
app.get('/api/books', (req, res) => {
  return res.json({ success: true, data: allBooks });
});


/**
 * GET /api/recommendations
 *   베스트셀러 목록(allBooks 배열) 중에서
 *   매번 랜덤으로 3개를 추출하여 JSON으로 반환합니다.
 */
app.get('/api/recommendations', (req, res) => {
  // 1) allBooks 배열을 복사하여 pool을 만듭니다.
  const pool = [...allBooks];
  const recommendations = [];

  // 2) 최소 3개권 이상이 있다고 가정 (만약 엑셀에 3권 미만만 있을 때는 allBooks.length로 변경)
  const count = Math.min(3, pool.length);

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    recommendations.push(pool[randomIndex]);
    // 중복 방지를 위해 뽑힌 원소는 삭제
    pool.splice(randomIndex, 1);
  }

  return res.json({ success: true, recommendations });
});


// ======================= 4) 서버 시작 =======================
app.listen(PORT, () => {
  console.log(`📚 베스트셀러 추천 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
