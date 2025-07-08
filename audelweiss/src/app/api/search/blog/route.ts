import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json([]);
        }

        const response = await fetch(`${process.env.STRAPI_URL}/api/articles?filters[$or][0][title][$containsi]=${encodeURIComponent(query)}&filters[$or][1][description][$containsi]=${encodeURIComponent(query)}&populate=*`, {
            headers: {
                'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des articles');
        }

        const data = await response.json();
        return NextResponse.json(data.data || []);

    } catch (error) {
        console.error('Erreur recherche blog:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
} 