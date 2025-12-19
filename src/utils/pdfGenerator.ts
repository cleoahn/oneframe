import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

export const generatePDF = async (content: string, title: string = 'document'): Promise<void> => {
  try {
    const pdf = new jsPDF();
    
    // 한글 지원을 위한 폰트 설정 (기본 폰트 사용)
    pdf.setFont('helvetica');
    
    // 제목 추가
    pdf.setFontSize(20);
    pdf.text(title, 20, 30);
    
    // 내용 추가
    pdf.setFontSize(12);
    
    // 긴 텍스트를 여러 줄로 분리
    const lines = pdf.splitTextToSize(content, 170);
    let yPosition = 50;
    
    for (const line of lines) {
      if (yPosition > 280) { // 페이지 하단에 도달하면 새 페이지 추가
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, 20, yPosition);
      yPosition += 7;
    }
    
    // PDF 다운로드
    pdf.save(`${title}.pdf`);
  } catch (error) {
    console.error('PDF 생성 오류:', error);
    throw new Error('PDF 생성 중 오류가 발생했습니다.');
  }
};

export const downloadTextFile = (content: string, title: string = 'document'): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${title}.txt`);
};
