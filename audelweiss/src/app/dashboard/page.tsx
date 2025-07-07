'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders, getStatusLabel, getStatusColor, Order } from '@/services/order';
import Image from 'next/image';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoggedIn, isLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, isLoading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (isLoggedIn && user) {
                const token = localStorage.getItem('jwt');
                if (token) {
                    const userOrders = await getUserOrders(token);
                    setOrders(userOrders);
                }
                setOrdersLoading(false);
            }
        };

        fetchOrders();
    }, [isLoggedIn, user]);

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Chargement...</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">Mon Compte</h1>
            
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Informations personnelles</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <p className="text-lg">
                        <span className="font-semibold">Nom d'utilisateur :</span> {user.username}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Email :</span> {user.email}
                    </p>
                </div>
            </div>

            {/* Commandes */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Mes Commandes</h2>
                
                {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Chargement des commandes...</span>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-6xl mb-4">📦</div>
                        <p className="text-gray-600 text-lg">Vous n'avez pas encore de commandes</p>
                        <button 
                            onClick={() => router.push('/products')}
                            className="mt-4 btn-primary"
                        >
                            Découvrir nos produits
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">Commande #{order.id}</h3>
                                        <p className="text-gray-600 text-sm">
                                            Passée le {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.statusOrder)}`}>
                                            {getStatusLabel(order.statusOrder)}
                                        </span>
                                        <span className="text-lg font-bold text-primary">
                                            {order.total.toFixed(2)} €
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {order.order_items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                            {item.product.main_picture && (
                                                <div className="relative w-16 h-16 flex-shrink-0">
                                                    <Image
                                                        src={item.product.main_picture.url}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.product.name}</h4>
                                                {item.variation_snapshot && (
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {item.variation_snapshot.options?.map((opt: any, index: number) => (
                                                            <span key={index} className="mr-2">
                                                                {opt.option?.name || opt.option}: {opt.values?.[0]?.name || opt.values?.[0]}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{item.price.toFixed(2)} €</p>
                                                <p className="text-sm text-gray-600">Qté: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 