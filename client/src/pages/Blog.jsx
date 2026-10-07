import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import api from '../api/client';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Destination Guides', 'Travel Tips', 'Luxury Stays', 'Adventure', 'Culture & Heritage'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/blog', {
          params: { category: category !== 'All' ? category : undefined },
        });
        if (res.data?.data) {
          setPosts(res.data.data);
        }
      } catch (err) {
        console.warn('Blog load notice:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [category]);

  const featured = posts[0];
  const list = posts.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 py-16 sm:py-24 text-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-50 text-ocean-700 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The VAYORA Journal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy-950">Stories & Travel Inspiration</h1>
          <p className="text-charcoal-600 text-sm sm:text-base">
            Insider perspectives, curated field notes, culinary explorations, and timeless guides crafted by our team of global travelers.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'bg-white border border-charcoal-200 text-charcoal-600 hover:border-charcoal-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post Hero */}
        {featured && (
          <div className="bg-white rounded-3xl overflow-hidden border border-charcoal-100 shadow-xl grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="aspect-[16/10] lg:aspect-auto h-full overflow-hidden">
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-8 sm:p-12 space-y-6">
              <div className="flex items-center gap-3 text-xs font-semibold text-ocean-600">
                <span className="px-2.5 py-1 rounded-md bg-ocean-50 text-ocean-700 uppercase tracking-wider">{featured.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-charcoal-400">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 leading-tight">
                <Link to={`/blog/${featured.slug}`} className="hover:text-ocean-600 transition-colors">
                  {featured.title}
                </Link>
              </h2>
              <p className="text-charcoal-600 text-sm leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <img src={featured.author?.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-navy-950">{featured.author?.name}</div>
                    <div className="text-[10px] text-charcoal-400">{featured.author?.role}</div>
                  </div>
                </div>
                <Link
                  to={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-600 hover:text-ocean-700 group"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Remaining Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((post) => (
            <article
              key={post._id}
              className="bg-white rounded-3xl overflow-hidden border border-charcoal-100 shadow-soft hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-ocean-600">
                    <span className="uppercase tracking-wider">{post.category}</span>
                    <span className="flex items-center gap-1 text-charcoal-400">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-navy-950 line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-ocean-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-charcoal-600 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 border-t border-charcoal-50 flex items-center justify-between">
                <span className="text-xs font-medium text-charcoal-500">{post.author?.name}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-xs font-bold text-ocean-600 hover:text-ocean-700 flex items-center gap-1"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
