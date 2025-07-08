'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Package, FileText, ShoppingBag, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { performGlobalSearch, SearchResult } from '@/services/search';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
            setResults([]);
            setSelectedIndex(-1);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < results.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    handleResultClick(results[selectedIndex]);
                }
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, results, selectedIndex, onClose]);

    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            if (query.trim().length >= 2) {
                performSearch(query.trim());
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [query]);

    const performSearch = async (searchQuery: string) => {
        setIsLoading(true);
        try {
            const results = await performGlobalSearch(searchQuery);
            setResults(results);
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };


    const handleResultClick = (result: SearchResult) => {
        router.push(result.url);
        onClose();
    };

    const getResultIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'product': return <Package className="w-4 h-4" />;
            case 'page': return <FileText className="w-4 h-4" />;
            case 'blog': return <FileText className="w-4 h-4" />;
            case 'category': return <ShoppingBag className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getResultTypeLabel = (type: SearchResult['type']) => {
        switch (type) {
            case 'product': return 'Produit';
            case 'page': return 'Page';
            case 'blog': return 'Article';
            case 'category': return 'Catégorie';
            default: return 'Résultat';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-start justify-center min-h-screen pt-16 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity search-modal__overlay"
                    onClick={onClose}
                />

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full search-modal__content">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Recherche
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Rechercher des produits, pages, articles..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent search-modal__input"
                            />
                        </div>

                        <div className="mt-4 max-h-96 overflow-y-auto">
                            {isLoading && (
                                <div className="flex items-center justify-center py-8 search-modal__loading">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <span className="ml-2 text-gray-600">Recherche en cours...</span>
                                </div>
                            )}

                            {!isLoading && query.length >= 2 && results.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>Aucun résultat trouvé pour "{query}"</p>
                                </div>
                            )}

                            {!isLoading && results.length > 0 && (
                                <div className="space-y-2">
                                    {results.map((result, index) => (
                                        <div
                                            key={`${result.type}-${result.id}`}
                                            className={`p-3 rounded-lg border cursor-pointer transition-colors search-modal__result ${
                                                index === selectedIndex
                                                    ? 'bg-primary/10 border-primary'
                                                    : 'hover:bg-gray-50 border-gray-200'
                                            }`}
                                            onClick={() => handleResultClick(result)}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getResultIcon(result.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                                            {result.title}
                                                        </h4>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded search-modal__type-badge">
                                                            {getResultTypeLabel(result.type)}
                                                        </span>
                                                    </div>
                                                    {result.description && (
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                            {result.description}
                                                        </p>
                                                    )}
                                                    {result.type === 'product' && result.price && (
                                                        <p className="text-sm font-medium text-primary mt-1">
                                                            {result.price.toFixed(2)} €
                                                        </p>
                                                    )}
                                                    {result.category && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {result.category}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isLoading && query.length < 2 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>Tapez au moins 2 caractères pour commencer la recherche</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 