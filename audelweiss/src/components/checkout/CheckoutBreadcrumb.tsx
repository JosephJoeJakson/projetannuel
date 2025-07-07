'use client';

interface CheckoutBreadcrumbProps {
    currentStep: 'cart' | 'checkout' | 'payment' | 'confirmation';
}

export default function CheckoutBreadcrumb({ currentStep }: CheckoutBreadcrumbProps) {
    const steps = [
        { id: 'cart', label: 'Panier', icon: '🛒' },
        { id: 'checkout', label: 'Informations', icon: '📝' },
        { id: 'payment', label: 'Paiement', icon: '💳' },
        { id: 'confirmation', label: 'Confirmation', icon: '✅' }
    ];

    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className={`flex items-center space-x-2 ${
                            index <= currentStepIndex ? 'text-primary' : 'text-gray-400'
                        }`}>
                            <span className="text-lg">{step.icon}</span>
                            <span className={`font-medium ${
                                index <= currentStepIndex ? 'text-primary' : 'text-gray-400'
                            }`}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`mx-4 w-8 h-0.5 ${
                                index < currentStepIndex ? 'bg-primary' : 'bg-gray-300'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Étape {currentStepIndex + 1} sur {steps.length}
                </p>
            </div>
        </div>
    );
} 