import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Sparkles, Heart, Globe, Github, Twitter, Linkedin, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6A38C2] via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white">
                  Job<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Nest</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 -mt-1">
                  Career AI Platform
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Empowering top talent and visionary companies through high-accuracy AI resume parsing, TF-IDF skill matching, and verified career pathways.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational (AI Microservice v2.0)</span>
            </div>
          </div>

          {/* Candidates Col */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-indigo-400 transition-colors">
                  Find Tech Jobs
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-indigo-400 transition-colors">
                  Browse by Role
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span>ATS Resume Matcher</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link to="/jobAI" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Career Assistant</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers Col */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">For Employers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/admin/jobs/create" className="hover:text-indigo-400 transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link to="/admin/companies" className="hover:text-indigo-400 transition-colors">
                  Company Management
                </Link>
              </li>
              <li>
                <Link to="/admin/jobs" className="hover:text-indigo-400 transition-colors">
                  Applicant Tracking
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Talent Sourcing (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Company & Social Col */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Connect</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stay updated with new job drops, platform feature releases, and AI hiring trends.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobNest Inc. Crafted for modern career excellence.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;