import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Building2, Calendar, PlusCircle, ArrowUpRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = companies?.length > 0 && companies.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany || []);
    }, [companies, searchCompanyByText]);

    const getCompanyInitials = (name) => {
        if (!name) return "CO";
        return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    if (!filterCompany || filterCompany.length === 0) {
        return (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6A38C2] flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">No Companies Registered</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                    {searchCompanyByText 
                        ? `No companies match "${searchCompanyByText}". Try another search term.`
                        : "Register your first organization to start publishing job openings and screening candidates."}
                </p>
                <button
                    onClick={() => navigate("/admin/companies/create")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6A38C2] to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:from-[#582da8] hover:to-indigo-700 transition-all cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Register New Company</span>
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-slate-200/80 overflow-hidden bg-white shadow-xs">
            <Table>
                <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-b border-slate-200/80 hover:bg-transparent">
                        <TableHead className="font-bold text-slate-700 text-xs py-4 pl-6">Company</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4">Headquarters</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4">Created On</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4 text-right pr-6">Manage</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany.map((company) => (
                        <TableRow key={company._id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                            <TableCell className="pl-6 py-4">
                                <div className="flex items-center gap-3.5">
                                    <Avatar className="h-10 w-10 rounded-2xl border border-slate-200 shadow-2xs">
                                        <AvatarImage src={company.logo} alt={company.name} />
                                        <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white font-bold text-xs">
                                            {getCompanyInitials(company.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <span className="font-bold text-slate-900 text-sm block">
                                            {company.name}
                                        </span>
                                        {company.website && (
                                            <a 
                                                href={company.website} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                                            >
                                                <span>Visit Website</span>
                                                <ArrowUpRight className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell className="py-4 text-xs text-slate-600 font-medium">
                                {company.location || "Remote / Unspecified"}
                            </TableCell>

                            <TableCell className="py-4">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{formatDate(company.createdAt)}</span>
                                </div>
                            </TableCell>

                            <TableCell className="py-4 text-right pr-6">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer ml-auto">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 p-2 rounded-2xl shadow-xl border-slate-200">
                                        <button 
                                            onClick={() => navigate(`/admin/companies/${company._id}`)} 
                                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-[#6A38C2] transition-colors cursor-pointer text-left"
                                        >
                                            <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                                            <span>Edit Details</span>
                                        </button>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable