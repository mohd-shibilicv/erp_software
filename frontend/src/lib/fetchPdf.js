import axios from "axios";

export const fetchPdf = async (pdfUrl) => {
    try {
      const response = await axios.get(pdfUrl, {
        responseType: 'blob', // Important to get the response as a Blob
      });
  
      // Convert the response Blob into an object URL
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      return URL.createObjectURL(pdfBlob);
    } catch (error) {
      console.error('Error fetching the PDF file:', error);
      return null;
    }
  };