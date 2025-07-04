'use client';

import { useEffect, useState } from 'react';
import { ProductVariation } from '@/types/product';

interface VariationSelectorProps {
    variations: ProductVariation[];
    onChange: (variation: ProductVariation | null, selected: Record<string, number | null>) => void;
}

type OptionValueObj = { id: number|string, name: string };
type OptionObj = { id: number|string, name: string };

function extractOptions(variations: ProductVariation[]) {
    const optionsMap: Record<string, { option: OptionObj, values: OptionValueObj[] }> = {};
    variations.forEach(variation => {
        variation.options.forEach(opt => {
            const optName = opt.option?.name || '';
            if (!optName) return;
            if (!optionsMap[optName]) {
                optionsMap[optName] = { option: opt.option, values: [] };
            }
            opt.values.forEach(val => {
                if (!optionsMap[optName].values.some(v => v.id === val.id)) {
                    optionsMap[optName].values.push(val);
                }
            });
        });
    });
    return optionsMap;
}

export default function VariationSelector({ variations, onChange }: VariationSelectorProps) {
    const optionsMap = extractOptions(variations);
    const optionNames = Object.keys(optionsMap);
    const [selected, setSelected] = useState<Record<string, number | null>>({});
    const [matchingVariation, setMatchingVariation] = useState<ProductVariation | null>(null);

    useEffect(() => {
        const init: Record<string, number | null> = {};
        optionNames.forEach(opt => (init[opt] = null));
        setSelected(init);
    }, [variations.length]);

    useEffect(() => {
        if (optionNames.some(opt => !selected[opt])) {
            setMatchingVariation(null);
            onChange(null, selected);
            return;
        }
        const match = variations.find(variation =>
            variation.options.every(opt => {
                const optName = opt.option?.name;
                if (!optName) return false;
                const selectedId = selected[optName];
                return selectedId && opt.values.some(val => val.id === selectedId);
            })
        );
        setMatchingVariation(match || null);
        onChange(match || null, selected);
    }, [selected, variations]);

    function getValidValuesForOption(optionName: string) {
        const filter = { ...selected };
        delete filter[optionName];
        const validIds = new Set<number|string>();
        variations.forEach(variation => {
            let match = true;
            for (const opt of variation.options) {
                const name = opt.option?.name;
                if (!name || name === optionName) continue;
                const sel = selected[name];
                if (sel && !opt.values.some(val => val.id === sel)) {
                    match = false;
                    break;
                }
            }
            if (match) {
                const opt = variation.options.find(o => o.option?.name === optionName);
                if (opt) {
                    opt.values.forEach(val => validIds.add(val.id));
                }
            }
        });
        return validIds;
    }

    const handleSelect = (optionName: string, valueId: number) => {
        setSelected(prev => ({ ...prev, [optionName]: prev[optionName] === valueId ? null : valueId }));
    };

    return (
        <div className="space-y-4">
            {optionNames.map(optionName => {
                const validIds = getValidValuesForOption(optionName);
                const isColorOption = /couleur|color|farbe/i.test(optionName);
                const hasPriceImpact = optionsMap[optionName].values.some(val => val.priceImpact > 0);
                return (
                    <div key={optionName}>
                        <p className="font-semibold mb-1">{optionName}</p>
                        {hasPriceImpact && (
                            <p className="text-xs text-gray-400 mb-2">Certaines options peuvent entraîner un supplément de prix.</p>
                        )}
                        <div className="flex flex-wrap gap-2 items-center">
                            {optionsMap[optionName].values.map(val => {
                                const isSelected = selected[optionName] === val.id;
                                const isAvailable = validIds.has(val.id);
                                if (isColorOption && val.hexColor) {
                                    return (
                                        <div key={`${optionName}-${val.id}`} className="flex flex-col items-center">
                                            <button
                                                onClick={() => isAvailable && handleSelect(optionName, val.id as number)}
                                                disabled={!isAvailable}
                                                title={val.name}
                                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition select-none
                                                    ${isSelected ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}
                                                    ${!isAvailable ? 'bg-gray-200 border-gray-200 cursor-not-allowed' : ''}`}
                                                style={{ backgroundColor: isAvailable ? val.hexColor : '#eee' }}
                                            >
                                                {isSelected && (
                                                    <span className="text-white text-lg font-bold">✓</span>
                                                )}
                                            </button>
                                        </div>
                                    );
                                }
                                return (
                                    <button
                                        key={`${optionName}-${val.id}`}
                                        onClick={() => isAvailable && handleSelect(optionName, val.id as number)}
                                        disabled={!isAvailable}
                                        className={`px-3 py-1 rounded border text-sm transition select-none flex items-center gap-1
                                            ${isSelected ? 'btn-primary' : 'btn-outline-primary'}
                                            ${!isAvailable ? 'bg-gray-200 text-gray-400 border-gray-300 line-through cursor-not-allowed' : ''}`}
                                    >
                                        {val.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
