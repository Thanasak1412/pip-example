import { useCallback, useState } from "react";
import "./App.css";
import VideoPlayer from "./components/VideoPlayer";
import FileViewerModal from "./components/FileViewerModal";
import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<string | ArrayBuffer | null>(null);

  const createImageFileFromURL = useCallback(
    async (imageUrl: string, fileName: string = "example-image.png") => {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a File object from the Blob
      const imageFile = new File([blob], fileName, { type: blob.type });

      setImageFile(imageFile);
    },
    []
  );

  const createPDFFile = useCallback((fileName: string = "example-pdf.pdf") => {
    // Define the document structure
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: "Page 1 Content", fontSize: 16 },

        // Add a page break after this content
        { text: "End of Page 1", pageBreak: "after" },

        // Content for the second page
        { text: "Page 2 Content", fontSize: 16 },

        // Add another page break
        { text: "End of Page 2", pageBreak: "after" },

        // Content for the third page
        { text: "Page 3 Content", fontSize: 16 },
      ],
    };

    // Generate the PDF and get the Blob
    pdfMake.createPdf(docDefinition).getBlob((blob) => {
      // Convert the Blob to a File object
      const file = new File([blob], fileName, { type: "application/pdf" });

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        setPdfFile(e?.target?.result ?? null);
      };
    });
  }, []);

  return (
    <>
      <h1>Picture-in-Picture Demo</h1>
      <VideoPlayer
        controls
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        width="600"
      />

      <button
        onClick={() =>
          createImageFileFromURL(
            "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?cs=srgb&dl=pexels-francesco-ungaro-1525041.jpg&fm=jpg"
          )
        }
        style={{
          marginTop: "50px",
        }}
      >
        Generate Image File
      </button>

      <button onClick={() => createPDFFile()}>Generate PDF File</button>

      {imageFile && <FileViewerModal file={imageFile} />}
      {pdfFile && <FileViewerModal file={String(pdfFile)} />}
    </>
  );
}

export default App;
