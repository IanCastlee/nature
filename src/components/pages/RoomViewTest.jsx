import React, { useEffect, useRef } from "react";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

import { useParams } from "react-router-dom";
import { uploadUrl } from "../../utils/fileURL";

export default function RoomViewTest() {
  const { photo } = useParams();
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: `${uploadUrl.uploadurl}photosphere/${photo}`,
      defaultZoomLvl: 0,
      minFov: 30,
      maxFov: 90,
    });

    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
    };
  }, [photo]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        zIndex: 9999,
      }}
    />
  );
}
