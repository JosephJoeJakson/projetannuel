'use client';

import { useEffect, useState } from 'react';
import { OptionValue, ProductVariationCombination } from '@/types/product';

interface GroupedOptions {
    [optionName: string]: OptionValue[];
}

interface VariationSelectorProps {
    combinations: ProductVariationCombination[];
    onChange: (combination: ProductVariationCombination | null) => void;
}

export default function VariationSelector({ combinations, onChange }: VariationSelectorProps) {
    const [groupedOptions, setGroupedOptions] = useState<GroupedOptions>({});
    const [selectedOptions, setSelectedOptions] = useState<Record<string, OptionValue | null>>({});
    const [matchingCombination, setMatchingCombination] = useState<ProductVariationCombination | null>(null);

    useEffect(() => {
        const map: GroupedOptions = {};
        combinations.forEach(comb => {
            comb.optionValues.forEach(val => {
                const optionName = val.option.name;
                if (!map[optionName]) map[optionName] = [];
                if (!map[optionName].some(v => v.id === val.id)) map[optionName].push(val);
            });
        });
        setGroupedOptions(map);
        const initSelected: Record<string, OptionValue | null> = {};
        Object.keys(map).forEach(opt => (initSelected[opt] = null));
        setSelectedOptions(initSelected);
    }, [combinations]);

    useEffect(() => {
        const selectedIds = Object.values(selectedOptions)
            .filter((opt): opt is OptionValue => opt !== null)
            .map(opt => opt.id);

        const totalRequired = Object.keys(groupedOptions).length;

        if (selectedIds.length < totalRequired) {
            setMatchingCombination(null);
            onChange(null);
            return;
        }

        const match = combinations.find((comb) => {
            const comboIds = comb.optionValues.map(val => val.id);
            const isMatch =
                comboIds.length === selectedIds.length &&
                selectedIds.every(id => comboIds.includes(id)) &&
                comboIds.every(id => selectedIds.includes(id));
            return isMatch;
        });

        setMatchingCombination(match || null);
        onChange(match || null);
    }, [selectedOptions, groupedOptions, combinations]);

    const handleSelect = (optionName: string, value: OptionValue) => {
        setSelectedOptions(prev => {
            if (prev[optionName]?.id === value.id) {
                return { ...prev, [optionName]: null };
            }
            return { ...prev, [optionName]: value };
        });
    }
    return (
        <div className="space-y-4">
            {Object.entries(groupedOptions).map(([optionName, values]) => (
                <div key={optionName}>
                    <p className="font-semibold mb-1">{optionName}</p>
                    <div className="flex flex-wrap gap-2">
                        {values.map(value => {
                            const isSelected = selectedOptions[optionName]?.id === value.id;

                            const tempSelected = { ...selectedOptions, [optionName]: value };
                            const selectedIds = Object.entries(tempSelected)
                                .filter(([k, v]) => v && k !== optionName)
                                .map(([_, v]) => (v as OptionValue).id)
                                .concat(value.id);
                            const isAvailable = combinations.some(comb =>
                                selectedIds.every(id => comb.optionValues.some(val => val.id === id))
                            );

                            return (
                                <button
                                    key={value.id}
                                    onClick={() => isAvailable && handleSelect(optionName, value)}
                                    disabled={!isAvailable}
                                    className={`px-3 py-1 rounded border text-sm transition select-none
                                        ${isSelected ? 'btn-primary' : 'btn-outline-primary'}
                                        ${!isAvailable ? 'bg-gray-200 text-gray-400 border-gray-300 line-through cursor-not-allowed' : ''}`}
                                >
                                    {value.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
