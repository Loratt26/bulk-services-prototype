import { NextResponse } from 'next/server';

type ProductPayload = {
  title?: string;
  variants?: unknown[];
  availability?: unknown;
  advancedSettings?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProductPayload;

    if (!body?.title || !Array.isArray(body.variants)) {
      return NextResponse.json(
        { error: 'Invalid product payload.' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Product received successfully.',
      product: {
        ...body,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }
}
