'use client';

import { ProductReview } from '@/types/product';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

interface Props {
    reviews: ProductReview[];
}

export default function ProductReviewsSection({ reviews }: Props) {
    if (!reviews || reviews.length === 0) {
        return (
            <section className="mt-10 border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Avis</h2>
                <p className="text-gray-500 italic">Aucun avis pour ce produit.</p>
            </section>
        );
    }

    return (
        <section className="mt-10 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Avis</h2>
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 shadow-sm bg-white">
                        <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-semibold text-primary">
                                <span className="font-medium text-primary">
                                  {review.users_permissions_user?.username ?? 'Utilisateur inconnu'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-400">
                                {format(new Date(review.publishedDate), "dd MMMM yyyy", { locale: fr })}
                            </div>
                        </div>

                        <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.184 3.643a1 1 0 00.95.69h3.831c.969 0 1.371 1.24.588 1.81l-3.1 2.254a1 1 0 00-.364 1.118l1.184 3.643c.3.921-.755 1.688-1.54 1.118l-3.1-2.254a1 1 0 00-1.176 0l-3.1 2.254c-.785.57-1.84-.197-1.54-1.118l1.184-3.643a1 1 0 00-.364-1.118L2.377 9.07c-.783-.57-.38-1.81.588-1.81h3.831a1 1 0 00.95-.69l1.184-3.643z" />
                                </svg>
                            ))}
                        </div>

                        <p className="text-gray-700">{review.content}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
