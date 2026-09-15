"use client";

import React, { useState, useEffect, useRef } from "react";
import { WordCloud52Canvas } from "@/components/3d/WordCloud52Canvas";
import { HUDOverlay } from "@/components/ui/HUDOverlay";
import { AddWordModal } from "@/components/ui/AddWordModal";
import { ShareSnapshotModal } from "@/components/ui/ShareSnapshotModal";
import { INITIAL_TRITECH_WORDS, TritechWord } from "@/lib/wordList";

const LOCAL_STORAGE_KEY = "tritech_52year_local_words";

export default function Home() {
  const [words, setWords] = useState<TritechWord[]>(INITIAL_TRITECH_WORDS);
  const [selectedWord, setSelectedWord] = useState<TritechWord | null>(null);
  const [lastSubmittedWordId, setLastSubmittedWordId] = useState<string | undefined>(undefined);
  const [powerUpTimestamp, setPowerUpTimestamp] = useState<number | undefined>(undefined);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Load persistent user-contributed words from database API on mount
  useEffect(() => {
    async function loadBackendPhrases() {
      try {
        const res = await fetch("/api/phrases");
        const data = await res.json();
        if (data.success && Array.isArray(data.phrases)) {
          const dbWords: TritechWord[] = data.phrases.map((p: any) => ({
            id: p.id,
            text: p.text,
            author: p.author,
            plant: p.department,
            country: p.country,
            position: p.position,
            color: p.color || "#f59e0b",
            isCustom: true,
          }));

          setWords((prev) => {
            const staticOnly = prev.filter((w) => !w.isCustom);
            return [...dbWords, ...staticOnly];
          });
        }
      } catch (e) {
        console.error("Error fetching database phrases:", e);
      }
    }

    loadBackendPhrases();
  }, []);

  const handleSelectWord = (word: TritechWord) => {
    setSelectedWord(word);
  };

  const handleAddWord = (newWordObj: TritechWord) => {
    setWords((prev) => [newWordObj, ...prev.filter((w) => w.id !== newWordObj.id)]);
    setSelectedWord(newWordObj);
    setLastSubmittedWordId(newWordObj.id);
    setPowerUpTimestamp(Date.now()); // Trigger 3.5s Wankel Core Power-Up Surge!
  };

  const handleResetSelection = () => {
    setSelectedWord(null);
  };

  return (
    <main className="w-screen h-screen h-[100dvh] overflow-hidden bg-[#030712] relative select-none">
      
      {/* 1. Pristine Deep-Space Radial Vignette Backdrop Centered Right Behind Wankel Engine Core */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: "radial-gradient(circle at 50% 50%, #0c1938 0%, #050b18 45%, #030712 85%)",
          }}
        />
        {/* Soft Ambient Core Glow Spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* 100% Viewport Interactive 3D Canvas */}
      <div className="w-full h-full relative z-10">
        <WordCloud52Canvas
          words={words}
          onSelectWord={handleSelectWord}
          selectedWordId={selectedWord?.id}
          lastSubmittedWordId={lastSubmittedWordId}
          powerUpTimestamp={powerUpTimestamp}
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
