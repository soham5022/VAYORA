import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2, Tag, Compass, Sparkles } from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blog/${slug}`);
        if (res.data?.data) {
          setPost(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Article link copied to clipboard!', 'info');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-charcoal-500">Loading travel story...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-navy-950">Article not found</h2>
        <Link to="/blog" className="text-sm font-bold text-ocean-600 underline">
          Back to all stories
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-50 py-12 sm:py-20 text-navy-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal-500 hover:text-navy-950 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        {/* Header Title & Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-semibold text-ocean-600 uppercase tracking-wider">
            <span>{post.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-charcoal-500">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy-950 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-y border-charcoal-200 py-4">
            <div className="flex items-center gap-3">
              <img src={post.author?.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="text-xs font-bold text-navy-950">{post.author?.name}</div>
                <div className="text-[10px] text-charcoal-500">{post.author?.role}</div>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-charcoal-200 bg-white hover:bg-slate-100 text-xs font-bold text-charcoal-700 transition-all shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Article</span>
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-charcoal-100">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Post Content */}
        <div className="prose prose-slate max-w-none text-charcoal-700 leading-relaxed space-y-6 text-base font-normal">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl sm:text-2xl font-serif font-bold text-navy-950 pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="pt-6 border-t border-charcoal-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-charcoal-400 mr-2 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Tags:
            </span>
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-white border border-charcoal-200 text-xs text-charcoal-600 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Curated Package CTA */}
        <div className="bg-gradient-to-r from-navy-950 to-ocean-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-serif font-bold">Inspired by this story?</h3>
            <p className="text-charcoal-300 text-xs sm:text-sm max-w-md">
              Let VAYORA concierge craft your bespoke departure with private transfers and boutique resort reservations.
            </p>
          </div>
          <Link
            to="/trip-planner"
            className="px-6 py-3.5 rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-md transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Plan This Journey</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
