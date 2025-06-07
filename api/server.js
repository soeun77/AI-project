import XLSX from 'xlsx'
import path from 'path'

export default function handler(req, res) {
  // 엑셀 읽기
  const excelPath = path.join(process.cwd(), 'bestsellers.xlsx')
  const workbook = XLSX.readFile(excelPath)
  const books = XLSX.utils
    .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' })

  // 랜덤 3개 뽑기
  const pool = [...books]
  const count = Math.min(3, pool.length)
  const recommendations = []
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    recommendations.push({
      제목: pool[idx]['제목'] || '',
      저자: pool[idx]['저자'] || '',
      '이미지 파일명': pool[idx]['이미지 파일명'] || ''
    })
    pool.splice(idx, 1)
  }

  return res.status(200).json({ success: true, recommendations })
}