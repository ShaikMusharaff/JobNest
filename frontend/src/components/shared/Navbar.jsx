import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Sparkles, Briefcase, Compass, Building2, PlusCircle } from 'lucide-react'
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
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar