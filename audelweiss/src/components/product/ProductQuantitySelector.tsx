'use client';

interface ProductQuantitySelectorProps {
    quantity: number;
    onChange: (newQty: number) => void;
    max?: number;
}

export default function ProductQuantitySelector({ quantity, onChange, max = 999 }: ProductQuantitySelectorProps) {
    const decrement = () => {
        if (quantity > 1) {
            onChange(quantity - 1);
        }
    };

    const increment = () => {
        if (quantity < max) {
            onChange(quantity + 1);
        }
    };

    return (
        <div className="flex items-center gap-2 my-4">
            <button
                type="button"
                className="px-3 py-1 rounded bg-gray-200 text-lg"
                onClick={decrement}
                disabled={quantity <= 1}
            >
                –
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
                type="button"
                className={`px-3 py-1 rounded text-lg ${
                    quantity >= max
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200'
                }`}
                onClick={increment}
                disabled={quantity >= max}
            >
                +
            </button>
        </div>
    );
}
