import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Sparkles, Briefcase, Compass, Building2, PlusCircle, Bell, Check, Clock, AlertTriangle } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to logout");
        }
    }

    const isActive = (path) => location.pathname === path;

    // Real-Time Notification Center
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New AI Match Discovered",
            desc: "New FullStack Engineer roles matching your skills were posted.",
            time: "10m ago",
            unread: true,
            type: "match"
        },
        {
            id: 2,
            title: "Application Status Update",
            desc: "Your application for Senior Developer is under active recruiter review.",
            time: "1h ago",
            unread: true,
            type: "status"
        },
        {
            id: 3,
            title: "Application Deadline Alert",
            desc: "1 job opening closes in 24 hours. Submit your application soon.",
            time: "3h ago",
            unread: false,
            type: "deadline"
        }
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
        toast.info("All notifications marked as read");
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    return (
        <nav className='sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-slate-200/70 shadow-2xs transition-all duration-300'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-18 px-4 md:px-8'>
                {/* Brand Logo */}
                <Link to="/" className='flex items-center gap-2.5 group'>
                    <div className='w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6A38C2] via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform'>
                        <Briefcase className='w-5 h-5' />
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors'>
                            Job<span className='bg-gradient-to-r from-[#6A38C2] to-violet-600 bg-clip-text text-transparent'>Nest</span>
                        </span>
                        <span className='text-[9px] font-extrabold uppercase tracking-widest text-indigo-600 -mt-1'>
                            Career AI
                        </span>
                    </div>
                </Link>

                {/* Navigation Links */}
                <div className='flex items-center gap-8'>
                    <ul className='hidden md:flex font-semibold items-center gap-1 text-sm text-slate-600'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li>
                                        <Link
                                            to="/admin/companies"
                                            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                                                isActive("/admin/companies")
                                                    ? "bg-indigo-50 text-[#6A38C2] font-bold"
                                                    : "hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <Building2 className="w-4 h-4" />
                                            <span>Companies</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/admin/jobs"
                                            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                                                isActive("/admin/jobs")
                                                    ? "bg-indigo-50 text-[#6A38C2] font-bold"
                                                    : "hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <Briefcase className="w-4 h-4" />
                                            <span>Posted Jobs</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/admin/jobs/create"
                                            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                                                isActive("/admin/jobs/create")
                                                    ? "bg-indigo-50 text-[#6A38C2] font-bold"
                                                    : "hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <PlusCircle className="w-4 h-4 text-indigo-600" />
                                            <span>Post Job</span>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            to="/"
                                            className={`px-3.5 py-2 rounded-xl transition-all ${
                                                isActive("/")
                                                    ? "bg-indigo-50 text-[#6A38C2] font-bold"
                                                    : "hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/jobs"
                                            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                                                isActive("/jobs")
                                                    ? "bg-indigo-50 text-[#6A38C2] font-bold"
                                                    : "hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <span>Find Jobs</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/browse"
                                            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                                                isActive("/browse")
                                                    ? "bg-indigo-50 text-[#6A38C2] font-bold"
                                                    : "hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <Compass className="w-4 h-4" />
                                            <span>Browse</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/jobAI"
                                            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                                                isActive("/jobAI")
                                                    ? "bg-purple-100 text-[#6A38C2] font-bold shadow-2xs"
                                                    : "text-indigo-600 hover:bg-purple-50 font-bold"
                                            }`}
                                        >
                                            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                                            <span>AI Career Chat</span>
                                        </Link>
                                    </li>
                                </>
                            )
                        }
                    </ul>

                    {/* Auth Status & CTA */}
                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login">
                                    <Button variant="ghost" className="font-bold text-slate-700 hover:text-indigo-600 rounded-xl px-4">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white rounded-xl font-bold px-5 shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {/* Notification Center */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button 
                                            aria-label="Notifications"
                                            className="relative w-10 h-10 rounded-2xl bg-slate-100/80 hover:bg-indigo-50 hover:text-[#6A38C2] border border-slate-200/60 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                                        >
                                            <Bell className="w-4 h-4" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center ring-2 ring-white animate-pulse">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 sm:w-96 p-4 rounded-3xl shadow-2xl border-slate-200/90">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-extrabold text-sm text-slate-900">Notifications</span>
                                                    {unreadCount > 0 && (
                                                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#6A38C2] text-[10px] font-extrabold">
                                                            {unreadCount} new
                                                        </span>
                                                    )}
                                                </div>
                                                {unreadCount > 0 && (
                                                    <button 
                                                        onClick={markAllAsRead} 
                                                        className="text-xs font-bold text-[#6A38C2] hover:underline cursor-pointer"
                                                    >
                                                        Mark all read
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                                {notifications.map((item) => (
                                                    <div 
                                                        key={item.id} 
                                                        onClick={() => markAsRead(item.id)}
                                                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                                                            item.unread 
                                                                ? 'bg-purple-50/50 border-purple-200/80 hover:bg-purple-50' 
                                                                : 'bg-white border-slate-100 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                                                            item.type === 'match' 
                                                                ? 'bg-purple-100 text-[#6A38C2]' 
                                                                : item.type === 'deadline'
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                            {item.type === 'match' ? <Sparkles className="w-4 h-4" /> : item.type === 'deadline' ? <Clock className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                                        </div>
                                                        <div className="flex-1 overflow-hidden">
                                                            <div className="flex items-center justify-between gap-1">
                                                                <h5 className="font-bold text-xs text-slate-900 truncate">{item.title}</h5>
                                                                <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* User Profile Popover */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100/80 cursor-pointer border border-slate-200/60 transition-colors">
                                            <Avatar className="h-9 w-9 ring-2 ring-indigo-200">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            </Avatar>
                                            <span className="hidden sm:inline font-bold text-xs text-slate-800 max-w-[120px] truncate">
                                                {user?.fullname}
                                            </span>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-5 rounded-3xl shadow-2xl border-slate-200/80">
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-3 pb-3 border-b border-slate-100'>
                                            <Avatar className="h-12 w-12 ring-2 ring-indigo-100">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            </Avatar>
                                            <div className="overflow-hidden">
                                                <h4 className='font-bold text-sm text-slate-900 truncate'>{user?.fullname}</h4>
                                                <p className='text-xs text-slate-400 capitalize'>{user?.role || "Candidate"}</p>
                                                <p className='text-xs text-slate-500 truncate mt-0.5'>{user?.email}</p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-1 text-sm font-semibold text-slate-700'>
                                            {
                                                user && user.role === 'student' && (
                                                    <Link
                                                        to="/profile"
                                                        className='flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50 hover:text-[#6A38C2] transition-colors'
                                                    >
                                                        <User2 className="w-4 h-4 text-indigo-500" />
                                                        <span>My Profile & Resume</span>
                                                    </Link>
                                                )
                                            }

                                            <button
                                                onClick={logoutHandler}
                                                className='flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left w-full'
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            </div>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar