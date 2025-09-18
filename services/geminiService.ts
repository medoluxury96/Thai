
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

// ######################################################################
// ## QUAN TRỌNG: DÁN API KEY CỦA BẠN VÀO ĐÂY ##
// ######################################################################
// Vui lòng thay thế chuỗi "YOUR_API_KEY_HERE" bằng Google AI API Key thật của bạn.
// CẢNH BÁO: Việc để lộ API key trong mã nguồn phía máy khách là không an toàn cho các ứng dụng công khai.
// Bất kỳ ai cũng có thể xem và sử dụng key của bạn. Chỉ sử dụng cách này cho mục đích thử nghiệm cá nhân.
const API_KEY = "YOUR_API_KEY_HERE"; 
// ######################################################################

if (API_KEY === "YOUR_API_KEY_HERE") {
  throw new Error("Vui lòng thay thế 'YOUR_API_KEY_HERE' bằng API key của bạn trong file services/geminiService.ts");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Chuyển đổi một chuỗi URL dữ liệu thành đối tượng Part cho API Gemini.
 * @param dataUrl URL dữ liệu của hình ảnh.
 * @returns Một đối tượng Part của Gemini.
 */
function dataUrlToGeminiPart(dataUrl: string): { inlineData: { data: string, mimeType: string } } {
  const [header, base64Data] = dataUrl.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
  return {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };
}

/**
 * Ghép hai ảnh lại với nhau, giữ lại khuôn mặt từ ảnh đầu tiên và áp dụng phong cách từ ảnh thứ hai.
 * @param faceImage Ảnh chứa khuôn mặt nguồn (định dạng base64 data URL).
 * @param styleImage Ảnh chứa phong cách, bối cảnh đích (định dạng base64 data URL).
 * @param userPrompt Ghi chú tùy chỉnh từ người dùng để điều khiển kết quả.
 * @returns Một promise phân giải thành URL dữ liệu của hình ảnh đã được ghép.
 */
export async function mergeImages(faceImage: string, styleImage: string, userPrompt: string): Promise<string> {
    const faceImagePart = dataUrlToGeminiPart(faceImage);
    const styleImagePart = dataUrlToGeminiPart(styleImage);
    
    // Lời nhắc cơ bản bằng tiếng Anh để mô hình hoạt động hiệu quả.
    const basePrompt = `From the first image, precisely extract the person's face, including their facial features and expression. From the second image, use the overall scene, body, clothes, and lighting as the target context. Seamlessly integrate the extracted face onto the person in the second image. Ensure the final image is photorealistic and the facial identity from the first image is perfectly preserved. The lighting on the face should match the lighting of the second image's environment.`;

    // Nối ghi chú của người dùng vào lời nhắc cơ bản nếu có.
    const finalText = userPrompt ? `${basePrompt} Additional instruction from user: ${userPrompt}` : basePrompt;

    const textPart = {
      text: finalText,
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [faceImagePart, styleImagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        // Tìm phần hình ảnh trong phản hồi.
        const imagePartResponse = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
        
        if (imagePartResponse && imagePartResponse.inlineData) {
            const { data, mimeType } = imagePartResponse.inlineData;
            return `data:${mimeType};base64,${data}`;
        } else {
             // Lỗi này được đưa ra nếu phản hồi API không chứa hình ảnh,
             // điều này có thể xảy ra vì lý do an toàn hoặc các vấn đề khác.
             throw new Error("Không tìm thấy dữ liệu hình ảnh trong phản hồi từ AI. Phản hồi có thể đã bị chặn.");
        }
    } catch(error) {
        console.error("Lỗi API Gemini:", error);
        throw new Error("Yêu cầu đến API Gemini thất bại. Hãy kiểm tra API key và bảng điều khiển của bạn.");
    }
}
