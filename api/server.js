const XLSX = require('xlsx');
const path = require('path');

module.exports = (req, res) => {
  const excelPath = path.join(process.cwd(), 'bestsellers.xlsx');
  const workbook = XLSX.readFile(excelPath);
  const firstSheet = workbook.SheetNames[0];
  const books = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: '' });

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname.endsWith('/recommendations')) {
    const pool = [...books];
    const count = Math.min(3, pool.length);
    const recommendations = [];

    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * pool.length);
      const book = pool[index];
      pool.splice(index, 1);

      // 오직 필요한 필드만 추출
      recommendations.push({
        제목: book['제목'] || '',
        저자: book['저자'] || '',
        이미지파일명: book['이미지 파일명'] || ''
      });
    }

    return res.status(200).json({ success: true, recommendations });
  }

  return res.status(404).json({ success: false, message: 'Not Found' });
};
