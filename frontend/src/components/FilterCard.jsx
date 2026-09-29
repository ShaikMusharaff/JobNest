import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Filter, MapPin, Briefcase, IndianRupee, RotateCcw } from 'lucide-react'

const filterData = [
    {
        filterType: "Location",
        icon: MapPin,
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"]
    },
    {
        filterType: "Job Domain",
        icon: Briefcase,
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science"]
    },
    {
        filterType: "Salary Range",
        icon: IndianRupee,
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    const clearFilters = () => {
        setSelectedValue('');
        dispatch(setSearchedQuery(''));
    }

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);

    return (
        <div className='w-full bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs sticky top-24'>
            {/* Header */}
            <div className='flex items-center justify-between pb-4 border-b border-slate-100'>
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-xl bg-purple-50 text-[#6A38C2] flex items-center justify-center'>
                        <Filter className='w-4 h-4' />
                    </div>
                    <h2 className='font-bold text-base text-slate-900'>Filter Jobs</h2>
                </div>

                {selectedValue && (
                    <button 
                        onClick={clearFilters}
                        className='inline-flex items-center gap-1 text-xs font-semibold text-[#6A38C2] hover:text-indigo-800 transition-colors cursor-pointer'
                    >
                        <RotateCcw className='w-3 h-3' />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            {/* Filter Groups */}
            <RadioGroup value={selectedValue} onValueChange={changeHandler} className="space-y-6 pt-5">
                {filterData.map((data, index) => {
                    const IconComp = data.icon;
                    return (
                        <div key={index} className='space-y-2.5'>
                            <div className='flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-400'>
                                <IconComp className='w-3.5 h-3.5 text-slate-400' />
                                <span>{data.filterType}</span>
                            </div>

                            <div className='space-y-1.5'>
                                {data.array.map((item, idx) => {
                                    const itemId = `filter-${index}-${idx}`;
                                    const isSelected = selectedValue === item;
                                    return (
                                        <div 
                                            key={idx}
                                            onClick={() => changeHandler(item)}
                                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                                                isSelected 
                                                    ? 'bg-purple-50 text-[#6A38C2] font-bold border border-purple-200' 
                                                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                                            }`}
                                        >
                                            <div className='flex items-center space-x-2.5'>
                                                <RadioGroupItem value={item} id={itemId} className="text-[#6A38C2]" />
                                                <Label htmlFor={itemId} className="cursor-pointer text-xs">{item}</Label>
                                            </div>
                                            {isSelected && (
                                                <span className='w-1.5 h-1.5 rounded-full bg-[#6A38C2]' />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </RadioGroup>
        </div>
    )
}

export default FilterCard