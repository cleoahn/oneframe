import mammoth from 'mammoth';

export const processFile = async (file: File): Promise<string> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  try {
    if (fileExtension === 'txt') {
      return await file.text();
    } else if (fileExtension === 'pdf') {
      return await extractTextFromPDF(file);
    } else if (fileExtension === 'docx') {
      return await extractTextFromDOCX(file);
    } else {
      throw new Error('지원하지 않는 파일 형식입니다.');
    }
  } catch (error) {
    console.error('파일 처리 오류:', error);
    throw new Error('파일을 읽는 중 오류가 발생했습니다.');
  }
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  // PDF 텍스트 추출을 위한 간단한 구현
  // 실제로는 pdf-parse 라이브러리를 사용하지만, 여기서는 기본 구현
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // PDF 파일은 바이너리이므로 텍스트 추출이 복잡합니다.
      // 간단한 구현으로는 파일 이름을 반환합니다.
      resolve(`[PDF 파일: ${file.name}]`);
    };
    reader.readAsArrayBuffer(file);
  });
};

const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('DOCX 처리 오류:', error);
    throw new Error('DOCX 파일을 읽는 중 오류가 발생했습니다.');
  }
};