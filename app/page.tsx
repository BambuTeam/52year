"use client";

import React, { useState, useEffect, useRef } from "react";
import { WordCloud52Canvas } from "@/components/3d/WordCloud52Canvas";
import { HUDOverlay } from "@/components/ui/HUDOverlay";
import { AddWordModal } from "@/components/ui/AddWordModal";
import { ShareSnapshotModal } from "@/components/ui/ShareSnapshotModal";
import { INITIAL_TRITECH_WORDS, TritechWord } from "@/lib/wordList";

const BACKGROUND_VIDEOS = [
  "/gears.mp4",
  "/interlocking.mp4",
  "/gears_alt.mp4",
];
const VIDEO_ROTATION_MS = 25 * 1000; // Automatic rotation every 25 seconds

export default function Home() {
  const [words, setWords] = useState<TritechWord[]>(INITIAL_TRITECH_WORDS);
  const [selectedWord, setSelectedWord] = useState<TritechWord | null>(null);
  const [lastSubmittedWordId, setLastSubmittedWordId] = useState<string | undefined>(undefined);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Automatic background video rotation between the 3 videos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideoIndex((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
    }, VIDEO_ROTATION_MS);
    return () => clearInterval(interval);
  }, []);

  // Guarantee all 3 video streams actively play in sync for instant smooth 3s crossfading
  useEffect(() => {
    videoRefs.current.forEach((vid) => {
      if (vid) {
        vid.play().catch(() => {});
      }
    });
  }, [activeVideoIndex]);

  const handleSelectWord = (word: TritechWord) => {
    setSelectedWord(word);
  };

  const handleAddWord = (newWordObj: TritechWord) => {
    setWords((prev) => [newWordObj, ...prev]);
    setSelectedWord(newWordObj);
    setLastSubmittedWordId(newWordObj.id);
  };

  const handleResetSelection = () => {
    setSelectedWord(null);
  };

  return (
    <main className="w-screen h-screen h-[100dvh] overflow-hidden bg-[#07090e] relative">
      
      {/* 1. Optimized High-Visual Alternating Background Videos (Automatic 3-second crossfade between all 3 videos) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {BACKGROUND_VIDEOS.map((src, idx) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover mix-blend-screen filter brightness-105 contrast-125 scale-105 transition-opacity duration-[3000ms] ease-in-out ${
              activeVideoIndex === idx ? "opacity-45" : "opacity-0 pointer-events-none"
            }`}
          />
        ))}

        {/* Industrial Dark Gradient Overlay & Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#07090e]/70 to-[#07090e] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-[#07090e]/80 pointer-events-none" />
      </div>

      {/* Industrial Grid Lines Backdrop */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-[1]"
        style={{
          backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(to right, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Pulsing Light Glow Behind 3D Cloud */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none orb-pulse z-[1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none z-[1]" />

      {/* 100% Viewport Interactive 3D Canvas */}
      <div className="w-full h-full relative z-10">
        <WordCloud52Canvas
          words={words}
          onSelectWord={handleSelectWord}
          selectedWordId={selectedWord?.id}
          lastSubmittedWordId={lastSubmittedWordId}
        />
      </div>

      {/* Floating HUD Controls */}
      <HUDOverlay
        wordCount={words.length}
        selectedWord={selectedWord}
        lastSubmittedWordId={lastSubmittedWordId}
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenShareModal={() => setIsShareOpen(true)}
        onResetSelection={handleResetSelection}
      />

      {/* Add Word Modal Overlay */}
      <AddWordModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddWord={handleAddWord}
      />

      {/* Share & Snapshot Modal Overlay */}
      <ShareSnapshotModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        selectedWord={selectedWord}
      />

    </main>
  );
}
