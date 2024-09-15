import { ChangeEvent, useState } from "react";
import Draggable from "react-draggable";
import Modal from "react-modal";
import { Worker, Viewer } from "@react-pdf-viewer/core";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
// default layout plugin
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// Import styles of default layout plugin
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

Modal.setAppElement("#root"); // This is required for accessibility

type Props = {
  file: File | string;
};

export default function FileViewerModal({ file }: Readonly<Props>) {
  // Create new plugin instance (called inside of the body of a function component)
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [isMinimized, setIsMinimized] = useState(false);

  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setIsMinimized(false);
    setModalIsOpen(false); // Reset minimize when closed
  };

  // Minimized the modal (shrink it)
  const minimizeModal = () => {
    setIsMinimized(true);
    setModalIsOpen(false);
  };

  // Restore minimized modal to full size
  const restoreModal = () => {
    setIsMinimized(false);
    setModalIsOpen(true);
  };

  // Open the image in a new tab with the image as the background
  const openInNewTab = () => {
    const newWindow = window.open();

    if (newWindow && typeof file !== "string") {
      newWindow.document.write(`
        <html>
          <head>
            <title>Image Preview</title>
            <style>
              body {
                margin: 0;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: url('${URL.createObjectURL(
                  file
                )}') no-repeat center center fixed;
                background-size: cover;
              }
            </style>
          </head>
          <body></body>
        </html>
      `);

      newWindow.document.close();
    }
  };

  const handleZoomChange = (e: ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(Number(e.target.value));
  };

  // Render content based on file type
  const renderFileContent = () => {
    if (typeof file !== "string" && file?.type.startsWith("image/")) {
      // Image rendering
      return (
        <div
          style={{
            overflow: "hidden",
            width: "100%",
            height: "auto",
            textAlign: "center",
          }}
        >
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{
              transform: `scale(${zoomLevel})`,
              transition: "transform 0.3s ease",
              maxWidth: "100%",
              maxHeight: "80vh",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
      );
    } else if (typeof file === "string") {
      // PDF rendering using react-pdf-viewer
      return (
        <div
          style={{
            width: "100%",
            height: "80vh",
            overflow: "auto",
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={file} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </div>
      );
    } else {
      return <p>Unsupported file type: {file?.type}</p>;
    }
  };

  return (
    <div>
      {/* Button to open modal */}
      <button onClick={openModal}>Preview Image</button>

      {/* Modal with Image Preview, Zoom, and PiP */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Preview"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "1080px",
            width: "80%",
          },
        }}
      >
        {/* File content (image, PDF) */}
        {renderFileContent()}

        {/* If image, show zoom slider */}
        {typeof file !== "string" && file?.type.startsWith("image/") && (
          // Zoom slide
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <label htmlFor="zoom-previewed-image" style={{ color: "black" }}>
              Zoom:
            </label>
            <input
              id="zoom-previewed-image"
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoomLevel}
              onChange={handleZoomChange}
              style={{ width: "50%" }}
            />
          </div>
        )}

        {/* Minimize Button */}
        <button onClick={minimizeModal} style={{ marginTop: "10px" }}>
          Minimize
        </button>

        {/* Open in New Tab Button */}
        <button onClick={openInNewTab} style={{ marginLeft: "10px" }}>
          Open in New Tab
        </button>

        {/* Button to close modal */}
        <button onClick={closeModal} style={{ marginTop: "10px" }}>
          Close
        </button>
      </Modal>

      {/* Draggable minimized thumbnail when minimized */}
      {isMinimized && (
        <Draggable>
          <div // NOSONAR
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: "150px",
              height: "100px",
              cursor: "pointer",
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              zIndex: 1000,
              background: "#fff",
            }}
            onClick={restoreModal}
            role="button"
          >
            {/* Thumbnail of the image or text for minimized PDF */}
            {typeof file !== "string" && file?.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Minimized Preview"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <p>PDF</p>
            )}
          </div>
        </Draggable>
      )}
    </div>
  );
}
