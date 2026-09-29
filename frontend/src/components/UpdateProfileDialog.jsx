import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, User, Mail, Phone, FileText, Code2, UploadCloud, CheckCircle2, FileCheck } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        bio: "",
        skills: "",
        resume: null
    });
    const [selectedFileName, setSelectedFileName] = useState("");

    // Synchronize form when user or dialog open state changes
    useEffect(() => {
        if (user) {
            setInput({
                fullname: user.fullname || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.profile?.bio || "",
                skills: Array.isArray(user.profile?.skills) ? user.profile.skills.join(", ") : (user.profile?.skills || ""),
                resume: null
            });
            setSelectedFileName(user.profile?.resumeOriginalName || "");
        }
    }, [user, open]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, resume: file });
            setSelectedFileName(file.name);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.resume) {
            formData.append("resume", input.resume);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message || "Profile updated successfully!");
                setOpen(false);
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const skillsPreview = input.skills
        ? input.skills.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[550px] p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xl">
                <DialogHeader className="pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6A38C2] flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-extrabold text-slate-900">Edit Profile</DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 mt-0.5">
                                Keep your contact details, bio, and candidate skills current for best matching.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={submitHandler} className="space-y-4 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fullname" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                <span>Full Name</span>
                            </Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                type="text"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                required
                                placeholder="Your full name"
                                className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                <span>Email Address</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                required
                                placeholder="your.email@example.com"
                                className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Phone Number */}
                        <div className="space-y-1.5">
                            <Label htmlFor="phoneNumber" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <span>Phone Number</span>
                            </Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                placeholder="+91 9876543210"
                                className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                            />
                        </div>

                        {/* Bio */}
                        <div className="space-y-1.5">
                            <Label htmlFor="bio" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                <span>Short Bio / Headline</span>
                            </Label>
                            <Input
                                id="bio"
                                name="bio"
                                type="text"
                                value={input.bio}
                                onChange={changeEventHandler}
                                placeholder="e.g. Senior MERN Stack Engineer"
                                className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                            />
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-1.5">
                        <Label htmlFor="skills" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <Code2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Key Skills (comma-separated)</span>
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal">e.g. React, Node.js, Python, MongoDB</span>
                        </Label>
                        <Input
                            id="skills"
                            name="skills"
                            type="text"
                            value={input.skills}
                            onChange={changeEventHandler}
                            placeholder="React, Node.js, Express, MongoDB, TailwindCSS"
                            className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                        />
                        {skillsPreview.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1.5 max-h-20 overflow-y-auto">
                                {skillsPreview.slice(0, 10).map((skill, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6A38C2] text-[11px] font-semibold border border-purple-200/60">
                                        {skill}
                                    </span>
                                ))}
                                {skillsPreview.length > 10 && (
                                    <span className="text-[11px] text-slate-400 self-center">
                                        +{skillsPreview.length - 10} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Resume Upload Box */}
                    <div className="space-y-1.5 pt-1">
                        <Label htmlFor="resumeFile" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                            <span>Resume Document (PDF)</span>
                        </Label>
                        
                        <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#6A38C2] flex items-center justify-center shrink-0">
                                    <FileCheck className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-slate-800 truncate">
                                        {selectedFileName || (user?.profile?.resume ? "Current resume attached" : "No resume uploaded")}
                                    </p>
                                    <p className="text-[10px] text-slate-400">PDF, DOCX up to 5MB</p>
                                </div>
                            </div>

                            <label 
                                htmlFor="resumeFile"
                                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-[#6A38C2] text-xs font-bold shadow-2xs hover:bg-indigo-50/50 cursor-pointer shrink-0 transition-colors"
                            >
                                Browse File
                            </label>
                            <input
                                id="resumeFile"
                                type="file"
                                accept="application/pdf,.pdf,.doc,.docx"
                                onChange={fileChangeHandler}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="rounded-xl bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 px-6 cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center gap-1.5">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </span>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;