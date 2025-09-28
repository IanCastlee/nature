import React, { useEffect, useRef } from "react";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";
import "photo-sphere-viewer/dist/plugins/markers.css";

import image1 from "../../assets/dummyImages/test1.jpg";
import image2 from "../../assets/dummyImages/test2.jpg";
import image3 from "../../assets/dummyImages/test3.jpg";

import pinIcon from "../../assets/icons/pinicon.png";

export default function Test() {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  const tour = {
    pano1: {
      src: image1,
      markers: [
        {
          id: "to-pano2",
          longitude: 2.9,
          latitude: -0.2,
          image: pinIcon,
          width: 40,
          height: 40,
          anchor: "bottom center",
          tooltip: "Go to Panorama 2",
          target: "pano2",
        },
      ],
    },
    pano2: {
      src: image2,
      markers: [
        {
          id: "to-pano1",
          longitude: -1.3,
          latitude: -0.2,
          image: pinIcon,
          width: 40,
          height: 40,
          anchor: "bottom center",
          tooltip: "Back to Panorama 1",
          target: "pano1",
        },
        {
          id: "to-pano3",
          longitude: 1.7,
          latitude: -0.2,
          image: pinIcon,
          width: 40,
          height: 40,
          anchor: "bottom center",
          tooltip: "Go to Panorama 3",
          target: "pano3",
        },
      ],
    },
    pano3: {
      src: image3,
      markers: [
        {
          id: "to-pano2",
          longitude: -1.0,
          latitude: 0.3,
          image: pinIcon,
          width: 40,
          height: 40,
          anchor: "bottom center",
          tooltip: "Back to Panorama 2",
          target: "pano2",
        },
      ],
    },
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: tour.pano1.src,
      plugins: [[MarkersPlugin, {}]],
      defaultZoomLvl: 0, // 👈 No zoom by default
      minFov: 30,
      maxFov: 90,
    });

    const markersPlugin = viewer.getPlugin(MarkersPlugin);

    const loadPanorama = (panoKey) => {
      const pano = tour[panoKey];

      viewer
        .setPanorama(pano.src, {
          longitude: pano.markers[0].longitude,
          latitude: pano.markers[0].latitude,
          zoom: 0, // 👈 Keep zoom level stable
        })
        .then(() => {
          markersPlugin.clearMarkers();
          pano.markers.forEach((m) => markersPlugin.addMarker(m));
        });
    };

    loadPanorama("pano1");

    markersPlugin.on("select-marker", (e, marker) => {
      markersPlugin.removeMarker(marker.id);

      const target =
        tour.pano1.markers.find((m) => m.id === marker.id)?.target ||
        tour.pano2.markers.find((m) => m.id === marker.id)?.target ||
        tour.pano3.markers.find((m) => m.id === marker.id)?.target;

      if (target) {
        loadPanorama(target);
      }
    });

    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh", background: "#000" }}
    />
  );
}
