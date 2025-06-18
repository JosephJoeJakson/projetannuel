import { useCartStore } from '@/stores/cart';

export default function CartSummary() {
    const items = useCartStore((state) => state.items);

    if (items.length === 0) return <p>Panier vide</p>;

    return (
        <div>
            {items.map((item) => (
                <div key={item.product.id}>
                    {item.product.name} x {item.quantity} — {item.product.price}€
                </div>
            ))}
        </div>
    );
}
