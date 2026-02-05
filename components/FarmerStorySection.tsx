"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Quote,
  Sprout,
  Sun,
  HandHeart,
  ClipboardCheck,
  ChevronRight,
  X,
  Star,
  Award,
  Heart,
} from "lucide-react";
import { fetchStories } from "@/lib/supabase";

interface FarmImage {
  id: number;
  url: string;
  alt: string;
}

interface TimelineNode {
  stage: string;
  month: string;
  icon: string;
  description: string;
  date: string;
}

interface FarmerStory {
  id: string;
  name: string;
  avatar: string;
  location: string;
  experience: string;
  quote: string;
  rating: number;
  reviews: number;
  images: FarmImage[];
  timeline: TimelineNode[];
}

interface FarmerStorySectionProps {
  story?: FarmerStory;
}

function getTimelineIcon(icon: string) {
  const iconMap: Record<string, JSX.Element> = {
    sprout: <Sprout className="w-5 h-5" />,
    sun: <Sun className="w-5 h-5" />,
    heart: <HandHeart className="w-5 h-5" />,
    check: <ClipboardCheck className="w-5 h-5" />,
  };
  return iconMap[icon] || <Sprout className="w-5 h-5" />;
}

function Lightbox({
  images,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: {
  images: FarmImage[];
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        onClick={onPrev}
        className="absolute left-4 p-3 text-white/70 hover:text-white transition-colors"
      >
        <ChevronRight className="w-8 h-8 rotate-180" />
      </button>

      <div className="relative w-full max-w-2xl mx-4">
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-medium">{images[currentIndex].alt}</p>
            <p className="text-white/70 text-sm">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="absolute right-4 p-3 text-white/70 hover:text-white transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function FarmerStorySection({
  story: initialStory,
}: FarmerStorySectionProps) {
  const [story, setStory] = useState<FarmerStory | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      const data = await fetchStories();
      if (data.length > 0) {
        const firstStory = data[0];
        const storyWithImages: FarmerStory = {
          ...firstStory,
          images: firstStory.images || [],
          timeline: firstStory.timeline || [],
        };
        setStory(storyWithImages);
      }
      setLoading(false);
    }
    loadStories();
  }, []);

  const displayStory = story || initialStory;

  const handleNext = () => {
    if (!displayStory) return;
    setCurrentImageIndex((prev) =>
      prev === displayStory.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    if (!displayStory) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayStory.images.length - 1 : prev - 1
    );
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg shadow-emerald-900/5 border border-slate-100 overflow-hidden p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-slate-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!displayStory) return null;

  return (
    <>
      <section className="bg-white rounded-3xl shadow-lg shadow-emerald-900/5 border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            农户故事与溯源
          </h2>
        </div>

        <div className="p-5 space-y-6">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-shrink-0">
              <button
                onClick={() => openLightbox(0)}
                className="relative group"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-br from-amber-200 to-orange-200 shadow-lg shadow-amber-900/10">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <Image
                      src={story.avatar}
                      alt={story.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-slate-800">
                  {story.name}
                </h3>
                <span className="px-2.5 py-1 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-xs font-medium text-amber-700 border border-amber-200/50">
                  {story.experience}
                </span>
              </div>

              <div className="flex items-center gap-1 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>{story.location}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(story.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                  <span className="ml-1 font-bold text-slate-800">
                    {story.rating}
                  </span>
                </div>
                <span className="text-slate-400 text-sm">
                  ({story.reviews} 条评价)
                </span>
              </div>

              <blockquote className="relative bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-xl p-4">
                <Quote className="absolute top-2 left-2 w-5 h-5 text-amber-300 opacity-50" />
                <p className="text-slate-700 italic text-sm leading-relaxed pl-4">
                  "{story.quote}"
                </p>
              </blockquote>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">
              果园实拍
            </p>
            <div className="grid grid-cols-4 gap-2">
              {story.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 p-5">
          <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-wide">
            生长历程
          </p>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-slate-200" />

            <div className="space-y-6">
              {story.timeline.map((node, index) => (
                <div key={node.stage} className="relative flex items-start gap-4 pl-10">
                  <div
                    className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                      index === story.timeline.length - 1
                        ? "bg-emerald-500 border-emerald-500"
                        : "bg-white border-emerald-400"
                    } z-10`}
                  />
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      index === story.timeline.length - 1
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {getTimelineIcon(node.icon)}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {node.month}
                      </span>
                      <span className="font-bold text-slate-800">{node.stage}</span>
                    </div>
                    <p className="text-sm text-slate-600">{node.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                您的本次兑换将直接帮助农户增加{" "}
                <span className="font-bold text-amber-300">¥15.00</span> 收入，
                并减少{" "}
                <span className="font-bold text-amber-300">0.5kg</span> 农资碳排放。
              </p>
            </div>
          </div>
        </div>
      </section>

      <Lightbox
        images={story.images}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}
