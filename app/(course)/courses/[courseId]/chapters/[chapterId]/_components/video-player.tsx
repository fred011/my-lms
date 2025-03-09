"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  // const onEnd = async () => {
  //   try {
  //     if (completeOnEnd) {
  //       await axios.put(
  //         `/api/courses/${courseId}/chapters/${chapterId}/progress`,
  //         {
  //           isCompleted: true,
  //         }
  //       );

  //       toast.success("Progress updated");
  //       router.refresh();

  //       if (nextChapterId) {
  //         router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
  //       }

  //       if (!nextChapterId) {
  //         confetti.onOpen();
  //       }
  //     }
  //   } catch {
  //     toast.error("Something went wrong");
  //   }
  // };

  const onEnd = async () => {
    if (!completeOnEnd) return;

    try {
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: true,
        }
      );

      toast.success("Progress updated");
      router.refresh();

      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      } else {
        confetti.onOpen();
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="relative  aspect-video ">
      {/* 🔹 Show loading spinner while video is loading */}
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}

      {/* 🔹 Show lock icon if video is locked */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}

      {/* 🔹 MuxPlayer with full width and height */}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden", "w-full h-full")} // Ensure full height
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          playbackId={playbackId}
        />
      )}
    </div>
  );
};
