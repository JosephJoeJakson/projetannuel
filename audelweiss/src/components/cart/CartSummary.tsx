import { useCartStore } from '@/stores/cart';

export default function CartSummary() {
    const items = useCartStore((state) => state.items);

    if (items.length === 0) return <p>Panier vide</p>;

    return (
        <div>
            {items.map((item) => (
                <div key={item.product.id + '-' + (item.variation ? JSON.stringify(item.variation.options) : 'no-var')}>
                    {item.product.name} x {item.quantity} — {item.product.price}€
                    {item.variation && (
                        <div className="text-xs text-gray-500">
                            {item.variation.options.map(opt => (
                                <span key={opt.option} className="mr-2">
                                    {opt.option} : {opt.values.join(', ')}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
