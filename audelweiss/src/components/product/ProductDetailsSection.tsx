'use client';

import { FC } from 'react';
import { ProductDetailsProps } from '@/types/product';

const ProductDetailsSection: FC<ProductDetailsProps> = ({ technicalFeatures = [], additionalInfo = [] }) => {
    if (technicalFeatures.length === 0 && additionalInfo.length === 0) return null;

    return (
        <div className="mt-12 border-t pt-6 space-y-6">
            {technicalFeatures.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold mb-2">Caractéristiques techniques</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {technicalFeatures.map((feature, i) => (
                            <li key={i}>
                                <strong>{feature.title} :</strong> {feature.value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {additionalInfo.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold mb-2">Autres informations</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {additionalInfo.map((info, i) => (
                            <li key={i}>
                                <strong>{info.title} :</strong> {info.value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsSection;
