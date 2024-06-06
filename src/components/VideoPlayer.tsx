import { type VideoHTMLAttributes, useRef } from "react";

interface Props extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  width: string | number;
}

export default function VideoPlayer({ src, width, ...other }: Readonly<Props>) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleEnterPip = async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error(
        "Error entering picture-in-picture mode: ",
        JSON.stringify(error, null, 2)
      );
    }
  };

  const handleLeavePip = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    } catch (error) {
      console.error(
        "Error exiting Picture-in-Picture mode: ",
        JSON.stringify(error, null, 2)
      );
    }
  };

  return (
    <>
      <video src={src} width={width} {...other} ref={videoRef}>
        <track
          default
          kind="captions"
          srcLang="en"
          src="https://gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbccbc069a2af4266e5120ae6bad62699a/sample.vtt"
        />
      </video>
      <div
        style={{
          marginTop: "32px",
          display: "flex",
          justifyContent: "center",
          gap: "32px",
        }}
      >
        <button style={{ maxWidth: "fit-content" }} onClick={handleEnterPip}>
          Enter Picture-in-Picture
        </button>
        <button style={{ maxWidth: "fit-content" }} onClick={handleLeavePip}>
          Exit Picture-in-Picture
        </button>
      </div>
    </>
  );
}
